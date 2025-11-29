import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { products } from "@/lib/products-data";

// Test endpoint to check products data and try a simple insertion
export async function GET() {
  try {
    // First, let's see what data we have
    console.log("Static products count:", products.length);
    console.log("First product structure:", JSON.stringify(products[0], null, 2));

    // Check database schema by trying to get current products
    const { data: existingProducts, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("*")
      .limit(1);

    console.log("Database fetch result:", { existingProducts, fetchError });

    // Try inserting just one simple product to test
    const testProduct = {
      name: "Test Product",
      category: "Test Category", 
      price: 999.00,
      description: "A test product to check database schema",
      color: "Test Color",
      images: ["https://example.com/test.jpg"],
      stock: 10,
      features: ["Test feature"],
      care_instructions: ["Test care instruction"]
    };

    console.log("Attempting to insert test product:", testProduct);

    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from("products")
      .insert([testProduct])
      .select();

    console.log("Insert result:", { insertResult, insertError });

    return NextResponse.json({
      message: "Product sync test completed",
      static_products_count: products.length,
      first_product_sample: products[0] ? {
        name: products[0].name,
        category: products[0].category,
        hasImages: !!products[0].images,
        imageCount: products[0].images?.length
      } : null,
      test_insertion: insertError ? { error: insertError } : { success: true, inserted: insertResult },
      database_fetch_test: fetchError ? { error: fetchError } : { success: true, count: existingProducts?.length }
    });

  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      { error: "Test failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}