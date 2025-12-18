#!/usr/bin/env tsx
/**
 * Test Image Upload Functionality
 * This script tests the complete image upload flow
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { supabaseAdmin } from '../lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function testImageUpload() {
  console.log('📸 Testing Image Upload Flow...\n');

  try {
    // 1. Create a test image buffer (1x1 red pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );

    const timestamp = Date.now();
    const filename = `test-product-${timestamp}.png`;

    console.log(`1️⃣  Uploading test image: ${filename}`);

    // 2. Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(`products/${filename}`, testImageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }

    console.log('✅ Upload successful!');
    console.log('   Path:', data.path);

    // 3. Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(`products/${filename}`);

    console.log('\n2️⃣  Public URL generated:');
    console.log('   ', publicUrl);

    // 4. Verify file exists
    console.log('\n3️⃣  Verifying file accessibility...');
    const response = await fetch(publicUrl);
    
    if (response.ok) {
      console.log('✅ File is publicly accessible!');
      console.log('   Status:', response.status);
      console.log('   Content-Type:', response.headers.get('content-type'));
    } else {
      console.error('❌ File not accessible:', response.status);
      throw new Error('File upload verification failed');
    }

    // 5. Test creating a product with this image
    console.log('\n4️⃣  Testing product creation with image...');
    
    const testProduct = {
      name: `Test Product ${timestamp}`,
      category: 'Tote',
      price: 999.99,
      description: 'This is a test product created by the image upload test script',
      color: 'Red',
      images: [publicUrl],
      stock: 10,
    };

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert(testProduct)
      .select()
      .single();

    if (productError) {
      console.error('❌ Product creation failed:', productError);
      throw productError;
    }

    console.log('✅ Product created successfully!');
    console.log('   Product ID:', product.id);
    console.log('   Product Name:', product.name);
    console.log('   Images:', product.images);

    // 6. Verify product can be retrieved
    console.log('\n5️⃣  Verifying product retrieval...');
    
    const { data: retrievedProduct, error: retrieveError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', product.id)
      .single();

    if (retrieveError) {
      console.error('❌ Product retrieval failed:', retrieveError);
      throw retrieveError;
    }

    console.log('✅ Product retrieved successfully!');
    console.log('   Images field type:', Array.isArray(retrievedProduct.images) ? 'Array' : typeof retrievedProduct.images);
    console.log('   Number of images:', retrievedProduct.images?.length || 0);

    // 7. Clean up - Delete test product
    console.log('\n6️⃣  Cleaning up test data...');
    
    const { error: deleteProductError } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', product.id);

    if (deleteProductError) {
      console.warn('⚠️  Failed to delete test product:', deleteProductError);
    } else {
      console.log('✅ Test product deleted');
    }

    // 8. Clean up - Delete test image
    const { error: deleteImageError } = await supabaseAdmin.storage
      .from('product-images')
      .remove([`products/${filename}`]);

    if (deleteImageError) {
      console.warn('⚠️  Failed to delete test image:', deleteImageError);
    } else {
      console.log('✅ Test image deleted');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ IMAGE UPLOAD TEST PASSED!');
    console.log('   All upload functionality is working correctly.');
    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.log('\n' + '='.repeat(60));
    console.error('❌ IMAGE UPLOAD TEST FAILED!');
    console.error('   Error:', error.message);
    console.log('\n   Troubleshooting:');
    console.log('   1. Verify SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.log('   2. Check product-images bucket exists and is public');
    console.log('   3. Verify RLS policies allow uploads');
    console.log('   4. Check Supabase logs for detailed errors');
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Run test
testImageUpload().catch(error => {
  console.error('\n💥 Test script crashed:', error);
  process.exit(1);
});
