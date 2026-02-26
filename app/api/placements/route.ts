import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Cache for 10 minutes
export const revalidate = 600;

// GET - Fetch products for a specific section (public endpoint)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (!section) {
      return NextResponse.json(
        { error: "Section parameter is required" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("product_placements")
      .select(`
        id,
        display_order,
        products (
          id,
          name,
          slug,
          color,
          price,
          images,
          description,
          category,
          colors,
          color_image,
          rating,
          reviews
        )
      `)
      .eq("section", section)
      .eq("is_active", true)
      .order("display_order");

    if (error) {
      console.error("Error fetching section products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract products from the nested structure
    const products: any[] = data?.map((item: any) => item.products).filter(Boolean) || [];

    if (products.length === 0) {
      return NextResponse.json([]);
    }

    // Get all unique product names to fetch all color variants
    const productNames = [...new Set(products.map((p: any) => p.name))];

    // Fetch all variants for these product names to build colors array
    const { data: allVariants } = await supabase
      .from("products")
      .select("id, name, color, color_image, images, slug")
      .in("name", productNames);

    // Group variants by name
    const variantsByName: { [name: string]: any[] } = {};
    (allVariants || []).forEach((v: any) => {
      if (!variantsByName[v.name]) variantsByName[v.name] = [];
      variantsByName[v.name].push(v);
    });

    // Enrich each product with full colors array
    const enriched = products.map((product: any) => {
      const variants = variantsByName[product.name] || [product];
      const colors = variants.map((variant: any) => ({
        name: variant.color,
        value: "#000000",
        available: true,
        image: variant.color_image || (variant.images && variant.images[0]) || null,
      }));
      return {
        id: product.slug || product.id?.toString(),
        dbId: product.id,
        slug: product.slug,
        name: product.name,
        color: product.color,
        price: product.price,
        images: product.images || [],
        category: product.category,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        colors,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Error in GET /api/placements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
