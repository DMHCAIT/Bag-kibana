import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { products } from "@/lib/products-data";

// API endpoint to sync static product data to Supabase database
export async function POST() {
  try {
    console.log("Starting product sync from static data...");
    
    // Clear existing products first
    const { error: deleteError } = await supabaseAdmin
      .from("products")
      .delete()
      .neq("id", 0); // Delete all products
    
    if (deleteError) {
      console.error("Error clearing existing products:", deleteError);
      return NextResponse.json({ error: "Failed to clear existing products" }, { status: 500 });
    }

    console.log("Cleared existing products");

    // Transform static products to database format (only using columns that exist in DB)
    const dbProducts = products.map((product) => ({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      color: product.color,
      images: product.images,
      stock: 50, // Default stock
      features: product.features || [],
      care_instructions: [
        "Spot clean with a damp cloth",
        "Avoid prolonged exposure to direct sunlight",
        "Store in a dust bag when not in use"
      ], // Default care instructions
      // Note: Removed rating, reviews, specifications as they don't exist in current schema
    }));

    console.log(`Preparing to insert ${dbProducts.length} products`);

    // Insert products in batches to avoid issues
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < dbProducts.length; i += batchSize) {
      const batch = dbProducts.slice(i, i + batchSize);
      
      const { error } = await supabaseAdmin
        .from("products")
        .insert(batch)
        .select("id, name, color");

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        return NextResponse.json({ 
          error: `Failed to insert batch starting at index ${i}`, 
          details: error.message 
        }, { status: 500 });
      }

      insertedCount += batch.length;
      console.log(`Inserted batch ${i / batchSize + 1}: ${batch.length} products`);
    }

    console.log(`Successfully synced ${insertedCount} products`);

    // Get final count
    const { count } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      message: "Products synced successfully!",
      synced: insertedCount,
      total_in_db: count,
      source: "static products data"
    });

  } catch (error) {
    console.error("Product sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync products", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    const { count: dbCount, error } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    const staticCount = products.length;

    return NextResponse.json({
      database_products: dbCount || 0,
      static_products: staticCount,
      sync_needed: (dbCount || 0) < staticCount,
      sync_endpoint: "/api/admin/sync-products"
    });

  } catch (error) {
    console.error("Sync status check error:", error);
    return NextResponse.json(
      { error: "Failed to check sync status" },
      { status: 500 }
    );
  }
}