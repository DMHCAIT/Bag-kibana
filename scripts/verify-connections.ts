#!/usr/bin/env tsx
/**
 * Connection Verification Script
 * Tests all database and storage connections
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { supabaseAdmin } from '../lib/supabase';

async function verifyConnections() {
  console.log('🔍 Starting Connection Verification...\n');

  let allPassed = true;

  // 1. Test Database Connection
  console.log('1️⃣  Testing Database Connection...');
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✅ Database connection: OK');
    console.log(`   - Products table accessible`);
  } catch (error: any) {
    console.error('❌ Database connection: FAILED');
    console.error('   Error:', error.message);
    allPassed = false;
  }

  // 2. Test Storage Connection
  console.log('\n2️⃣  Testing Storage Connection...');
  try {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();

    if (error) throw error;
    
    const productImagesBucket = buckets?.find((b: any) => b.name === 'product-images');
    
    if (productImagesBucket) {
      console.log('✅ Storage connection: OK');
      console.log(`   - Bucket 'product-images' exists`);
      console.log(`   - Public: ${productImagesBucket.public}`);
      
      if (!productImagesBucket.public) {
        console.warn('⚠️  WARNING: product-images bucket is NOT public!');
        console.log('   Run this SQL to make it public:');
        console.log('   UPDATE storage.buckets SET public = true WHERE name = \'product-images\';');
      }
    } else {
      console.warn('⚠️  WARNING: product-images bucket does not exist!');
      console.log('   Create it in Supabase Dashboard > Storage');
      allPassed = false;
    }
  } catch (error: any) {
    console.error('❌ Storage connection: FAILED');
    console.error('   Error:', error.message);
    allPassed = false;
  }

  // 3. Test Products Table Schema
  console.log('\n3️⃣  Verifying Products Table Schema...');
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .limit(1);

    if (error) throw error;

    if (products && products.length > 0) {
      const product = products[0];
      const requiredFields = ['id', 'name', 'category', 'price', 'description', 'images'];
      const optionalFields = ['stock_quantity', 'low_stock_threshold', 'sku', 'color_image'];
      
      console.log('✅ Products table schema: OK');
      console.log('   Required fields present:');
      requiredFields.forEach(field => {
        const hasField = field in product;
        console.log(`   - ${field}: ${hasField ? '✓' : '✗'}`);
        if (!hasField) allPassed = false;
      });
      
      console.log('   Optional fields (new features):');
      optionalFields.forEach(field => {
        const hasField = field in product;
        console.log(`   - ${field}: ${hasField ? '✓' : 'not yet added'}`);
      });

      // Check if images are URLs
      if (product.images && Array.isArray(product.images)) {
        console.log(`   - Images field: array with ${product.images.length} items`);
        if (product.images.length > 0) {
          console.log(`   - Sample image: ${product.images[0].substring(0, 50)}...`);
        }
      }
    } else {
      console.warn('⚠️  Products table is empty');
      console.log('   Add products via Admin Panel or run migration');
    }
  } catch (error: any) {
    console.error('❌ Products table verification: FAILED');
    console.error('   Error:', error.message);
    allPassed = false;
  }

  // 4. Test Orders Table
  console.log('\n4️⃣  Verifying Orders Table...');
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✅ Orders table: OK');
    console.log(`   - ${data?.length || 0} orders in database`);
  } catch (error: any) {
    console.error('❌ Orders table verification: FAILED');
    console.error('   Error:', error.message);
    allPassed = false;
  }

  // 5. Test Users Table
  console.log('\n5️⃣  Verifying Users Table...');
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .limit(1);

    if (error) throw error;
    console.log('✅ Users table: OK');
    const adminCount = data?.filter((u: any) => u.role === 'admin').length || 0;
    console.log(`   - Admin users: ${adminCount}`);
  } catch (error: any) {
    console.error('❌ Users table verification: FAILED');
    console.error('   Error:', error.message);
    allPassed = false;
  }

  // 6. Test OTP Store Table
  console.log('\n6️⃣  Verifying OTP Store Table...');
  try {
    const { data, error } = await supabaseAdmin
      .from('otp_store')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✅ OTP Store table: OK');
  } catch (error: any) {
    console.warn('⚠️  OTP Store table: Not found or not accessible');
    console.log('   Run migration: supabase/create-otp-table.sql');
  }

  // 7. Test Rate Limits Table
  console.log('\n7️⃣  Verifying Rate Limits Table...');
  try {
    const { data, error } = await supabaseAdmin
      .from('rate_limits')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✅ Rate Limits table: OK');
  } catch (error: any) {
    console.warn('⚠️  Rate Limits table: Not found');
    console.log('   Run migration: supabase/add-rate-limiting-and-email-tables.sql');
  }

  // 8. Test Inventory Transactions Table
  console.log('\n8️⃣  Verifying Inventory Transactions Table...');
  try {
    const { data, error } = await supabaseAdmin
      .from('inventory_transactions')
      .select('id')
      .limit(1);

    if (error) throw error;
    console.log('✅ Inventory Transactions table: OK');
  } catch (error: any) {
    console.warn('⚠️  Inventory Transactions table: Not found');
    console.log('   Run migration: supabase/add-inventory-tracking.sql');
  }

  // 9. Test Upload Functionality
  console.log('\n9️⃣  Testing Upload Functionality...');
  try {
    // Create a small test file (1x1 pixel transparent PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    const testFilename = `test-${Date.now()}.png`;

    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(`tests/${testFilename}`, testImageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    console.log('✅ Upload functionality: OK');
    console.log(`   - Test file uploaded: ${testFilename}`);

    // Clean up test file
    await supabaseAdmin.storage
      .from('product-images')
      .remove([`tests/${testFilename}`]);

    console.log('   - Test file cleaned up');
  } catch (error: any) {
    console.error('❌ Upload functionality: FAILED');
    console.error('   Error:', error.message);
    console.log('\n   Troubleshooting:');
    console.log('   1. Check SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.log('   2. Verify product-images bucket exists in Supabase Storage');
    console.log('   3. Check bucket policies allow service role uploads');
    allPassed = false;
  }

  // 10. Test Environment Variables
  console.log('\n🔟  Verifying Environment Variables...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const optionalEnvVars = [
    'RAZORPAY_KEY_SECRET',
    'TWILIO_ACCOUNT_SID',
    'RESEND_API_KEY',
    'JWT_SECRET',
  ];

  console.log('   Required:');
  requiredEnvVars.forEach(varName => {
    const exists = !!process.env[varName];
    console.log(`   - ${varName}: ${exists ? '✓' : '✗ MISSING'}`);
    if (!exists) allPassed = false;
  });

  console.log('   Optional:');
  optionalEnvVars.forEach(varName => {
    const exists = !!process.env[varName];
    console.log(`   - ${varName}: ${exists ? '✓' : 'not set'}`);
  });

  // Final Summary
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ ALL CRITICAL CHECKS PASSED!');
    console.log('   Your system is properly configured.');
  } else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('   Please fix the errors above before deployment.');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

// Run verification
verifyConnections().catch(error => {
  console.error('\n💥 Verification script crashed:', error);
  process.exit(1);
});
