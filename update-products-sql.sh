#!/bin/bash

# Backup the original file
cp supabase/add-vistara-products-fixed.sql supabase/add-vistara-products-fixed.sql.backup

# Add rating, reviews, and specifications to each product
# Pattern: Replace ending ,color) with ,color,rating,reviews,specs)

sed -i.tmp "s/  'Teal Blue'/  'Teal Blue',\n  4.9,\n  12,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Textured\", \"closureType\": \"Magnetic Snap\", \"hardware\": \"Gold-toned\", \"compartments\": [\"1 main compartment\", \"2 inner pockets\", \"1 zip pocket\"], \"shoulderDrop\": \"10 inches\", \"capacity\": \"Fits essentials and more\", \"dimensions\": \"14 x 12 x 5 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Mocha Tan'/  'Mocha Tan',\n  4.8,\n  15,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Textured\", \"closureType\": \"Magnetic Snap\", \"hardware\": \"Gold-toned\", \"compartments\": [\"1 main compartment\", \"2 inner pockets\", \"1 zip pocket\"], \"shoulderDrop\": \"10 inches\", \"capacity\": \"Fits essentials and more\", \"dimensions\": \"14 x 12 x 5 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Mint Green'/  'Mint Green',\n  4.7,\n  10,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Textured\", \"closureType\": \"Magnetic Snap\", \"hardware\": \"Gold-toned\", \"compartments\": [\"1 main compartment\", \"2 inner pockets\", \"1 zip pocket\"], \"shoulderDrop\": \"10 inches\", \"capacity\": \"Fits essentials and more\", \"dimensions\": \"14 x 12 x 5 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Milky Blue'/  'Milky Blue',\n  4.9,\n  18,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Textured\", \"closureType\": \"Magnetic Snap\", \"hardware\": \"Gold-toned\", \"compartments\": [\"1 main compartment\", \"2 inner pockets\", \"1 zip pocket\"], \"shoulderDrop\": \"10 inches\", \"capacity\": \"Fits essentials and more\", \"dimensions\": \"14 x 12 x 5 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

# PRIZMA SLING products
sed -i.tmp "s/  'Black Noir'/  'Black Noir',\n  4.8,\n  22,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Zipper\", \"hardware\": \"Silver-toned\", \"compartments\": [\"1 main compartment\", \"1 front pocket\"], \"shoulderDrop\": \"22 inches adjustable\", \"capacity\": \"Fits phone, wallet, keys\", \"dimensions\": \"9 x 6 x 2 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Jet Black'/  'Jet Black',\n  4.9,\n  25,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Zipper\", \"hardware\": \"Silver-toned\", \"compartments\": [\"1 main compartment\", \"1 front pocket\"], \"shoulderDrop\": \"22 inches adjustable\", \"capacity\": \"Fits phone, wallet, keys\", \"dimensions\": \"9 x 6 x 2 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Chilli Red'/  'Chilli Red',\n  4.7,\n  14,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Zipper\", \"hardware\": \"Silver-toned\", \"compartments\": [\"1 main compartment\", \"1 front pocket\"], \"shoulderDrop\": \"22 inches adjustable\", \"capacity\": \"Fits phone, wallet, keys\", \"dimensions\": \"9 x 6 x 2 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Pastel Purple'/  'Pastel Purple',\n  4.6,\n  11,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Zipper\", \"hardware\": \"Silver-toned\", \"compartments\": [\"1 main compartment\", \"1 front pocket\"], \"shoulderDrop\": \"22 inches adjustable\", \"capacity\": \"Fits phone, wallet, keys\", \"dimensions\": \"9 x 6 x 2 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

# SANDESH LAPTOP BAG products  
sed -i.tmp "s/  'Cosmic Black'/  'Cosmic Black',\n  4.9,\n  35,\n  '{\"material\": \"Canvas with Leather accents\", \"texture\": \"Durable Canvas\", \"closureType\": \"Zipper\", \"hardware\": \"Silver-toned\", \"compartments\": [\"1 padded laptop compartment (15 inch)\", \"2 inner pockets\", \"1 front organizer pocket\"], \"shoulderDrop\": \"Adjustable padded straps\", \"capacity\": \"Fits 15 inch laptop and essentials\", \"dimensions\": \"16 x 12 x 4 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Bottle Green'/  'Bottle Green',\n  4.8,\n  28,\n  '{\"material\": \"Canvas with Leather accents\", \"texture\": \"Durable Canvas\", \"closureType\": \"Zipper\", \"hardware\": \"Silver-toned\", \"compartments\": [\"1 padded laptop compartment (15 inch)\", \"2 inner pockets\", \"1 front organizer pocket\"], \"shoulderDrop\": \"Adjustable padded straps\", \"capacity\": \"Fits 15 inch laptop and essentials\", \"dimensions\": \"16 x 12 x 4 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Navy Blue'/  'Navy Blue',\n  4.9,\n  30,\n  '{\"material\": \"Canvas with Leather accents\", \"texture\": \"Durable Canvas\", \"closureType\": \"Zipper\", \"hardware\": \"Silver-toned\", \"compartments\": [\"1 padded laptop compartment (15 inch)\", \"2 inner pockets\", \"1 front organizer pocket\"], \"shoulderDrop\": \"Adjustable padded straps\", \"capacity\": \"Fits 15 inch laptop and essentials\", \"dimensions\": \"16 x 12 x 4 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

# LEKHA WALLET products
sed -i.tmp "s/  'Mint Blue'/  'Mint Blue',\n  4.7,\n  40,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Snap button\", \"hardware\": \"Gold-toned\", \"compartments\": [\"8 card slots\", \"2 bill compartments\", \"1 zip coin pocket\"], \"shoulderDrop\": \"N/A\", \"capacity\": \"Cards, cash, and coins\", \"dimensions\": \"7.5 x 4 x 1 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Slate Gray'/  'Slate Gray',\n  4.8,\n  42,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Snap button\", \"hardware\": \"Gold-toned\", \"compartments\": [\"8 card slots\", \"2 bill compartments\", \"1 zip coin pocket\"], \"shoulderDrop\": \"N/A\", \"capacity\": \"Cards, cash, and coins\", \"dimensions\": \"7.5 x 4 x 1 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Olive Green'/  'Olive Green',\n  4.6,\n  38,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Snap button\", \"hardware\": \"Gold-toned\", \"compartments\": [\"8 card slots\", \"2 bill compartments\", \"1 zip coin pocket\"], \"shoulderDrop\": \"N/A\", \"capacity\": \"Cards, cash, and coins\", \"dimensions\": \"7.5 x 4 x 1 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Rust Orange'/  'Rust Orange',\n  4.9,\n  45,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Snap button\", \"hardware\": \"Gold-toned\", \"compartments\": [\"8 card slots\", \"2 bill compartments\", \"1 zip coin pocket\"], \"shoulderDrop\": \"N/A\", \"capacity\": \"Cards, cash, and coins\", \"dimensions\": \"7.5 x 4 x 1 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

# VISTAPACK products
sed -i.tmp "s/  'Khaki'/  'Khaki',\n  4.8,\n  20,\n  '{\"material\": \"Canvas\", \"texture\": \"Durable Woven\", \"closureType\": \"Drawstring with flap\", \"hardware\": \"Metal buckles\", \"compartments\": [\"1 main compartment\", \"2 side pockets\", \"1 front pocket\"], \"shoulderDrop\": \"Adjustable padded straps\", \"capacity\": \"25 liters\", \"dimensions\": \"12 x 17 x 6 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Maroon'/  'Maroon',\n  4.7,\n  18,\n  '{\"material\": \"Canvas\", \"texture\": \"Durable Woven\", \"closureType\": \"Drawstring with flap\", \"hardware\": \"Metal buckles\", \"compartments\": [\"1 main compartment\", \"2 side pockets\", \"1 front pocket\"], \"shoulderDrop\": \"Adjustable padded straps\", \"capacity\": \"25 liters\", \"dimensions\": \"12 x 17 x 6 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Forest Green'/  'Forest Green',\n  4.9,\n  23,\n  '{\"material\": \"Canvas\", \"texture\": \"Durable Woven\", \"closureType\": \"Drawstring with flap\", \"hardware\": \"Metal buckles\", \"compartments\": [\"1 main compartment\", \"2 side pockets\", \"1 front pocket\"], \"shoulderDrop\": \"Adjustable padded straps\", \"capacity\": \"25 liters\", \"dimensions\": \"12 x 17 x 6 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Charcoal Gray'/  'Charcoal Gray',\n  4.8,\n  21,\n  '{\"material\": \"Canvas\", \"texture\": \"Durable Woven\", \"closureType\": \"Drawstring with flap\", \"hardware\": \"Metal buckles\", \"compartments\": [\"1 main compartment\", \"2 side pockets\", \"1 front pocket\"], \"shoulderDrop\": \"Adjustable padded straps\", \"capacity\": \"25 liters\", \"dimensions\": \"12 x 17 x 6 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

# Compact Wallet products
sed -i.tmp "s/  'Black'/  'Black',\n  4.9,\n  50,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Snap button\", \"hardware\": \"Silver-toned\", \"compartments\": [\"6 card slots\", \"1 bill fold\", \"1 ID window\"], \"shoulderDrop\": \"N/A\", \"capacity\": \"Cards and cash\", \"dimensions\": \"4.5 x 3.5 x 0.5 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Brown'/  'Brown',\n  4.8,\n  48,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Snap button\", \"hardware\": \"Silver-toned\", \"compartments\": [\"6 card slots\", \"1 bill fold\", \"1 ID window\"], \"shoulderDrop\": \"N/A\", \"capacity\": \"Cards and cash\", \"dimensions\": \"4.5 x 3.5 x 0.5 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

sed -i.tmp "s/  'Navy'/  'Navy',\n  4.7,\n  45,\n  '{\"material\": \"Vegan Leather\", \"texture\": \"Smooth\", \"closureType\": \"Snap button\", \"hardware\": \"Silver-toned\", \"compartments\": [\"6 card slots\", \"1 bill fold\", \"1 ID window\"], \"shoulderDrop\": \"N/A\", \"capacity\": \"Cards and cash\", \"dimensions\": \"4.5 x 3.5 x 0.5 inches (L x H x W)\"}'::jsonb/g" supabase/add-vistara-products-fixed.sql

# Remove temp files
rm -f supabase/add-vistara-products-fixed.sql.tmp

echo "✅ Updated all 22 products with rating, reviews, and specifications!"
