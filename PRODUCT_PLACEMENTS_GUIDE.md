# Product Placements System - Complete Guide

## Overview
The Product Placements system allows you to control which products appear in specific sections of your homepage (Bestsellers, New Collection, etc.) directly from the admin panel.

---

## 🎯 Features

- **Section Management**: Control products in different homepage sections
- **Drag & Reorder**: Change display order with up/down buttons
- **Toggle Visibility**: Hide/show products without removing them
- **Visual Admin UI**: See product images and details while managing
- **Fallback System**: Shows default products if no placements are set

---

## 📊 Available Sections

1. **bestsellers** - Bestsellers Section (Homepage)
2. **new-collection** - New Collection Carousel (Homepage)
3. **featured** - Featured Products
4. **hero-products** - Hero Section Products

---

## 🚀 Setup Instructions

### Step 1: Create Database Table

1. Go to Supabase Dashboard → SQL Editor
2. Open the file: `supabase/create-product-placements.sql`
3. Copy and paste the entire SQL script
4. Click "Run" to execute

This will create:
- `product_placements` table
- Indexes for performance
- Row-level security policies
- Sample data (optional - can be removed)

### Step 2: Verify Database Setup

Run this query to check if the table was created:

```sql
SELECT * FROM product_placements;
```

You should see the table structure and any sample data.

### Step 3: Access Admin Panel

1. Navigate to: **`/admin/placements`**
2. You'll see the Product Placements Manager

---

## 🎨 How to Use the Admin Panel

### Select a Section
1. Use the dropdown at the top to choose which section to manage
2. Available sections: Bestsellers, New Collection, Featured, Hero Products

### Add Products to a Section
1. Select a product from the "Add Product" dropdown
2. Click "Add Product" button
3. Product will appear at the bottom of the list

### Reorder Products
- **Move Up** ⬆️: Click the up arrow to move product higher in the list
- **Move Down** ⬇️: Click the down arrow to move product lower
- Products are displayed in the order shown (position 1, 2, 3, etc.)

### Toggle Visibility
- **Eye Icon** 👁️: Product is visible (active)
- **Eye Off Icon** 👁️‍🗨️: Product is hidden (inactive)
- Click to toggle between active/inactive
- Hidden products stay in the list but won't show on the website

### Remove Products
- Click the **Trash icon** 🗑️ to permanently remove from the section
- You'll be asked to confirm before deletion

---

## 💻 API Endpoints

### Public Endpoints (Frontend)

#### Get Products for a Section
```http
GET /api/placements?section=bestsellers
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "VISTARA TOTE",
    "slug": "vistara-tote-teal-blue",
    "color": "Teal Blue",
    "price": 2999,
    "images": ["..."],
    "description": "...",
    "colors": [...]
  }
]
```

### Admin Endpoints (Backend)

#### Get All Placements
```http
GET /api/admin/placements
GET /api/admin/placements?section=bestsellers
```

#### Create New Placement
```http
POST /api/admin/placements
Content-Type: application/json

{
  "product_id": 1,
  "section": "bestsellers",
  "display_order": 0,
  "is_active": true
}
```

#### Update Placement
```http
PUT /api/admin/placements/{id}
Content-Type: application/json

{
  "display_order": 2,
  "is_active": false
}
```

#### Delete Placement
```http
DELETE /api/admin/placements/{id}
```

---

## 🔧 Database Schema

```sql
CREATE TABLE product_placements (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  section VARCHAR(50) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id, section)
);
```

**Key Points:**
- `product_id`: Foreign key to products table
- `section`: Which homepage section (bestsellers, new-collection, etc.)
- `display_order`: Order of appearance (0, 1, 2, ...)
- `is_active`: Whether to show the product or hide it
- **Unique constraint**: A product can only appear once per section

---

## 🎯 Frontend Integration

### Bestsellers Section
File: `components/BestsellersSection.tsx`

```tsx
// Fetches from /api/placements?section=bestsellers
// Falls back to /api/products?limit=4 if no placements
```

### New Collection Carousel
File: `components/NewCollectionCarousel.tsx`

```tsx
// Fetches from /api/placements?section=new-collection
// Falls back to /api/products?limit=8 if no placements
```

Both components automatically:
1. Try to load products from placements
2. Fall back to default products if no placements exist
3. Show loading states
4. Handle errors gracefully

---

## 📝 Example Workflows

### Example 1: Setup Bestsellers Section
1. Navigate to `/admin/placements`
2. Select "Bestsellers Section" from dropdown
3. Add 4 products you want to feature
4. Reorder them by importance (top products first)
5. All 4 products are now live on the homepage

### Example 2: Update New Collection
1. Select "New Collection Carousel"
2. Add 6-8 new products
3. Arrange them in the order you want them displayed
4. Save - they immediately appear on the homepage carousel

### Example 3: Seasonal Promotion
1. Select "Featured Products"
2. Add seasonal/promotional products
3. When promotion ends, click eye icon to hide (don't delete)
4. When next season comes, toggle them back on or swap with new products

---

## 🐛 Troubleshooting

### Products Not Showing on Homepage?
1. Check if placements exist: Go to `/admin/placements`
2. Verify products are set to "Active" (eye icon should be visible)
3. Check browser console for any API errors
4. Verify database table exists in Supabase

### Can't Add Product to Section?
- **Error: "Product already placed in this section"**
  - Product is already in that section
  - Remove it first, or add to a different section

### Display Order Not Updating?
1. Refresh the page to see latest order
2. Check if both products being swapped are active
3. Try manually setting display_order in database if UI fails

### API Returns Empty Array?
- No placements created yet for that section
- Frontend will fall back to default products automatically
- Add products through admin panel

---

## 🔒 Security

- **Row Level Security (RLS)** enabled on product_placements table
- Public can only view active placements
- Only authenticated users (admins) can manage placements
- All admin routes should be protected by authentication

---

## 🚦 Testing Checklist

- [ ] Database table created successfully
- [ ] Can access `/admin/placements` page
- [ ] Can select different sections
- [ ] Can add products to sections
- [ ] Can reorder products (up/down buttons work)
- [ ] Can toggle active/inactive status
- [ ] Can delete products from sections
- [ ] Homepage Bestsellers section displays correct products
- [ ] Homepage New Collection carousel displays correct products
- [ ] Fallback works when no placements exist

---

## 📊 Database Queries for Manual Management

### View All Placements
```sql
SELECT 
  pp.id,
  pp.section,
  pp.display_order,
  pp.is_active,
  p.name as product_name,
  p.color,
  p.slug
FROM product_placements pp
JOIN products p ON pp.product_id = p.id
ORDER BY pp.section, pp.display_order;
```

### Count Products by Section
```sql
SELECT 
  section,
  COUNT(*) as total_products,
  COUNT(CASE WHEN is_active THEN 1 END) as active_products
FROM product_placements
GROUP BY section;
```

### Clear All Placements (Be Careful!)
```sql
DELETE FROM product_placements;
```

---

## 💡 Tips & Best Practices

1. **Keep Sections Updated**: Regularly update featured products to keep content fresh
2. **Use Display Order**: Lower numbers appear first (0, 1, 2, 3...)
3. **Don't Delete, Hide**: Use active/inactive instead of deleting for seasonal products
4. **Test on Frontend**: Always check the homepage after making changes
5. **Limit Products**: Keep 4-8 products per section for best UX
6. **Monitor Performance**: More products = more images = slower loading

---

## 🎉 Done!

Your product placements system is now fully functional! You can control exactly which products appear in which sections of your homepage.

**Admin Panel**: `/admin/placements`
**Questions?** Check the code or console logs for more details.
