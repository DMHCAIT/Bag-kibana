import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Authentication removed - direct access enabled for admin APIs

    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Authentication removed - direct access enabled for admin APIs

    const body = await request.json();
    const {
      name,
      category,
      price,
      description,
      color,
      images,
      stock,
      rating,
      reviews,
      is_bestseller,
      is_new,
      features,
      care_instructions,
      specifications,
    } = body;

    // Validation
    if (!name || !category || !price || !description || !color) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .insert({
        name,
        category,
        price: parseFloat(price),
        description,
        color,
        images: images || [],
        stock: parseInt(stock) || 0,
        rating: parseFloat(rating) || 4.5,
        reviews: parseInt(reviews) || 10,
        is_bestseller: is_bestseller || false,
        is_new: is_new || false,
        features: features || [],
        care_instructions: care_instructions || [],
        specifications: specifications || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
