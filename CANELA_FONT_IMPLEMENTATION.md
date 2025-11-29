# 🎨 CANELA FONT IMPLEMENTATION GUIDE

## Overview
The KIBANA logo header now uses the **Canela font** for an elegant, luxury brand appearance. This implementation includes proper fallbacks and font loading optimization.

## 📋 Implementation Details

### 1. **Font Configuration** (layout.tsx)
```typescript
const canela = localFont({
  src: [
    {
      path: '../public/fonts/canela-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/canela-medium.woff2', 
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/canela-bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-canela',
  display: 'swap',
  fallback: ['serif'],
});
```

### 2. **Header Implementation** (Header.tsx)
```tsx
<h1 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-black font-canela">
  KIBANA
</h1>
```

### 3. **CSS Utilities** (globals.css)
```css
.font-canela {
  font-family: var(--font-canela), 'Playfair Display', serif;
}

.font-canela-display {
  font-family: var(--font-canela), 'Playfair Display', serif;
  font-weight: 500;
  letter-spacing: 0.2em;
}

.font-canela-heading {
  font-family: var(--font-canela), 'Playfair Display', serif;
  font-weight: 700;
  letter-spacing: 0.15em;
}
```

## 🔧 **Font Files Required**

To complete the implementation, you'll need to add the actual Canela font files to:
```
/public/fonts/
├── canela-regular.woff2
├── canela-medium.woff2
└── canela-bold.woff2
```

## 📄 **Font Licensing**

⚠️ **IMPORTANT**: Canela is a premium commercial font by Klim Type Foundry. You must:

1. **Purchase a license** from [Klim Type Foundry](https://klim.co.nz/retail-fonts/canela/)
2. **Download the web font files** (WOFF2 format recommended)
3. **Place the font files** in `/public/fonts/` directory
4. **Verify license compliance** for web usage

### **License Types Needed:**
- **Web License**: For website usage
- **Desktop License**: For design work (optional)

## 🎯 **Fallback Strategy**

The implementation includes smart fallbacks:
1. **Primary**: Canela (when files are available)
2. **Fallback**: Playfair Display (Google Font)
3. **System**: Generic serif fonts

This ensures the site works even before Canela fonts are added.

## 🚀 **Current Status**

✅ **Code Implementation**: Complete  
✅ **CSS Configuration**: Ready  
✅ **Header Updated**: Using font-canela class  
⏳ **Font Files**: Need to be added with proper license  

## 📱 **Visual Impact**

**Before**: KIBANA (using Abhaya Libre)  
**After**: KIBANA (using Canela for luxury aesthetic)

The Canela font will provide:
- ✨ More elegant, luxury appearance
- 📐 Better brand consistency
- 🎨 Enhanced visual hierarchy
- 💎 Premium feel matching the brand positioning

## 🔄 **Next Steps**

1. **Purchase Canela font license**
2. **Download WOFF2 font files**
3. **Add files to `/public/fonts/` directory**
4. **Test font loading and fallbacks**
5. **Optimize font loading performance**

Once the font files are added, the KIBANA logo will automatically use the elegant Canela typeface! ✨