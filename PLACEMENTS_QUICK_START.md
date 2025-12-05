# 🚀 Quick Setup - Product Placements System

## ✅ Setup Checklist

### 1️⃣ Database Setup (5 minutes)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run this file: `supabase/create-product-placements.sql`
4. Click "Run" button
5. ✅ Done! Table created with sample data

### 2️⃣ Test Admin Panel (2 minutes)
1. Navigate to: `https://your-site.com/admin/placements`
2. Select "Bestsellers Section"
3. Try adding a product
4. Try reordering with arrow buttons
5. ✅ If it works, you're ready!

### 3️⃣ Configure Your Sections (10 minutes)

#### Bestsellers Section
- Add 4 best-selling products
- Order them by popularity
- These show on homepage main section

#### New Collection Carousel
- Add 6-8 newest products
- Order them by launch date
- These show in the carousel

---

## 🎯 What You Get

✅ **Complete Admin UI** at `/admin/placements`
- Add/remove products from sections
- Drag to reorder (up/down buttons)
- Toggle visibility (hide without deleting)
- See product images while managing

✅ **Smart Frontend Integration**
- Bestsellers Section uses your placements
- New Collection Carousel uses your placements
- Automatic fallback if no placements set
- No code changes needed!

✅ **Database System**
- Product placements table
- Foreign key to products
- Unique constraint (product only once per section)
- Automatic timestamps

---

## 📍 Quick Actions

### View Current Placements
```sql
SELECT section, COUNT(*) as products
FROM product_placements
WHERE is_active = true
GROUP BY section;
```

### Reset Everything (Start Fresh)
```sql
DELETE FROM product_placements;
```

### Check What's Active
```sql
SELECT pp.section, p.name, p.color, pp.display_order
FROM product_placements pp
JOIN products p ON pp.product_id = p.id
WHERE pp.is_active = true
ORDER BY pp.section, pp.display_order;
```

---

## 🎨 Admin Panel Features

| Feature | Description |
|---------|-------------|
| **Section Selector** | Choose which section to manage |
| **Add Product** | Select from dropdown and add |
| **Move Up/Down** | Reorder with arrow buttons |
| **Toggle Active** | Eye icon - show/hide product |
| **Delete** | Trash icon - remove from section |
| **Position Number** | Shows current order (1, 2, 3...) |
| **Product Preview** | See image and details |

---

## 📱 How It Works

1. **You manage** products in admin panel (`/admin/placements`)
2. **System stores** placements in database
3. **Frontend fetches** placements via API
4. **Homepage displays** your selected products in order
5. **If no placements** → shows default products automatically

---

## 🔥 Next Steps

1. ✅ Run the SQL script in Supabase
2. ✅ Visit `/admin/placements`
3. ✅ Add products to "Bestsellers Section"
4. ✅ Add products to "New Collection Carousel"
5. ✅ Check homepage to see your changes live!

---

## 📖 Full Documentation

See `PRODUCT_PLACEMENTS_GUIDE.md` for:
- Complete API documentation
- Troubleshooting guide
- Database schema details
- Advanced features

---

## 🎉 You're Ready!

Everything is set up and deployed. Just run the SQL script and start managing your homepage products!

**Admin Panel**: `/admin/placements`
