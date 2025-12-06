# Product Placements Management Guide

## Overview
The Product Placements system allows you to control which products appear on different pages and sections of your website through the admin panel.

## Accessing the System
1. Go to Admin Panel → **Placements** from the sidebar
2. URL: `/admin/placements`

## Features

### 1. **Placements Overview Dashboard**
- See at a glance how many products are placed on each page
- Organized by page (Homepage, Women's, Men's, Shop, Collections, All Products)
- Shows count of products in each section

### 2. **Page & Section Selection**
Choose from multiple pages and sections:

#### 🏠 Homepage
- **Bestsellers Section** - Main bestselling products
- **New Collection Carousel** - Latest collection showcase
- **Featured Products** - Highlighted products
- **Hero Products** - Banner/hero area products

#### 👜 Women's Page
- **Featured Products** - Top women's products
- **Trending Now** - Trending women's items

#### 💼 Men's Page
- **Featured Products** - Top men's products
- **Trending Now** - Trending men's items

#### 🛍️ Shop Page
- **Featured** - Featured shop items
- **New Arrivals** - Latest products

#### 📚 Collections Page
- **Featured Collections** - Highlighted collections

#### 📦 All Products Page
- **Top Picks** - Recommended products

### 3. **Adding Products**
1. Select the page & section you want to manage
2. Choose a product from the dropdown (only shows unplaced products)
3. Select position (start, specific position, or end)
4. Click "Add Product at Selected Position"

**Features:**
- Products already placed in the section won't appear in the dropdown
- Shows count of available products
- Visual confirmation with product image, name, color, and price

### 4. **Managing Placements**

#### View Current Products
- See all products in the selected section
- Display shows:
  - Product image
  - Product name and color
  - Price
  - Position number
  - Active/Inactive status

#### Reorder Products
- **Move Up** ↑ - Move product higher in the list
- **Move Down** ↓ - Move product lower in the list
- Changes take effect immediately

#### Toggle Active/Inactive
- Click the eye icon to toggle visibility
- Inactive products won't show on the website
- Useful for temporarily hiding products without removing them

#### Remove Products
- Click the trash icon to remove a product from the section
- Product can be re-added later

#### View on Website
- Click "View on Website" to see the product detail page
- Opens in a new tab

## Best Practices

### 1. **Homepage Sections**
- **Bestsellers**: 4-8 products that are actually selling well
- **New Collection**: 6-10 latest products
- **Featured**: 4-6 premium or seasonal products
- **Hero Products**: 1-3 products for main banner

### 2. **Category Pages (Women's/Men's)**
- **Featured**: 6-8 top products for that category
- **Trending**: 4-6 products gaining popularity

### 3. **Shop Page**
- **Featured**: 8-12 diverse products
- **New Arrivals**: Latest 6-10 products added

### 4. **Product Selection Tips**
- Choose high-quality product images
- Mix different price points
- Include variety of colors and styles
- Update regularly to keep content fresh

### 5. **Ordering Strategy**
- Place best-performing products first
- Consider visual balance (colors, styles)
- Test different arrangements and monitor performance

## Workflow Examples

### Example 1: Setting Up Homepage Bestsellers
1. Navigate to Placements page
2. Select "Homepage - Bestsellers Section"
3. Add 6 top-selling products
4. Arrange them with best-seller first
5. Verify all are set to Active

### Example 2: Launching New Collection
1. Select "Homepage - New Collection Carousel"
2. Add all new collection products (8-10 items)
3. Order them to create visual flow
4. Set all to Active
5. Preview on website

### Example 3: Seasonal Rotation
1. Go to relevant section (e.g., Women's Featured)
2. Toggle old season products to Inactive
3. Add new seasonal products
4. Reorder based on priority
5. Remove completely outdated items

## Technical Details

### Database Structure
- Products can appear in multiple sections simultaneously
- Each product can only appear once per section
- Display order determines arrangement on the website
- Changes are immediate (no caching delay)

### API Endpoints Used
- `GET /api/admin/placements?section={section}` - Get placements
- `POST /api/admin/placements` - Add placement
- `PUT /api/admin/placements/{id}` - Update placement
- `DELETE /api/admin/placements/{id}` - Remove placement

### Sections in Database
All sections are stored with these keys:
```
Homepage: bestsellers, new-collection, featured, hero-products
Women's: women-featured, women-trending
Men's: men-featured, men-trending
Shop: shop-featured, shop-new-arrivals
Collections: collections-featured
All Products: all-products-top
```

## Troubleshooting

### Products Not Showing in Dropdown
- Check if product already placed in current section
- Verify products exist in database
- Refresh the page

### Changes Not Appearing on Website
- Check if product is set to Active
- Verify product has valid image and data
- Clear browser cache
- Check if section is implemented on the target page

### Unable to Reorder Products
- Ensure you're not trying to move first item up or last item down
- Refresh the page if controls are unresponsive

## Future Enhancements
- Bulk actions (add/remove multiple products)
- Copy placements from one section to another
- Schedule placements (auto-activate/deactivate on dates)
- Performance analytics per placement
- A/B testing different arrangements

## Support
For issues or questions about the placements system:
- Check admin logs for errors
- Verify database connection
- Contact technical support with specific section and product details
