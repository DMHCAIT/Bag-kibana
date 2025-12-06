const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  console.log('🔍 Checking database for color and image data...\n');
  
  const { data, error } = await supabase
    .from('products')
    .select('name, color, images, color_image, colors')
    .ilike('name', '%SANDESH%')
    .limit(5);
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  data.forEach(product => {
    console.log(`📦 ${product.name} - ${product.color}`);
    console.log(`   Images array: ${product.images ? `[${product.images.length} images]` : 'NULL'}`);
    console.log(`   First image: ${product.images?.[0] || 'NONE'}`);
    console.log(`   color_image field: ${product.color_image || 'NULL'}`);
    console.log(`   colors array: ${product.colors ? JSON.stringify(product.colors) : 'NULL'}`);
    console.log('');
  });
})();
