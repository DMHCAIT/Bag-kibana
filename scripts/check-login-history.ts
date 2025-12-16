/**
 * Test script to check login history table status
 * Run this file to diagnose login history issues
 */

import { supabaseAdmin } from '../lib/supabase';

async function checkLoginHistorySetup() {
  console.log('🔍 Checking login history setup...\n');

  try {
    // 1. Check if login_history table exists
    console.log('1️⃣ Checking if login_history table exists...');
    const { data: tableCheck, error: tableError } = await supabaseAdmin
      .from('login_history')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table does not exist or has permission issues:');
      console.error('   Error:', tableError.message);
      console.error('   Code:', tableError.code);
      console.error('\n📝 SOLUTION: Run the SQL migration file:');
      console.error('   File: supabase/add-user-tracking.sql');
      console.error('   Location: Supabase Dashboard → SQL Editor → New Query → Paste and Run\n');
      return;
    }

    console.log('✅ Table exists!\n');

    // 2. Count total entries
    console.log('2️⃣ Counting login history entries...');
    const { count, error: countError } = await supabaseAdmin
      .from('login_history')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error counting entries:', countError.message);
      return;
    }

    console.log(`   Total entries: ${count || 0}\n`);

    if (count === 0) {
      console.log('ℹ️  No login history entries found.');
      console.log('   This is normal if:');
      console.log('   - Users haven\'t logged in yet');
      console.log('   - The table was just created');
      console.log('\n📝 To populate data:');
      console.log('   1. Go to login page');
      console.log('   2. Enter phone number and verify OTP');
      console.log('   3. Check this page again\n');
      return;
    }

    // 3. Fetch sample entries
    console.log('3️⃣ Fetching sample entries...');
    const { data: sampleData, error: sampleError } = await supabaseAdmin
      .from('login_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (sampleError) {
      console.error('❌ Error fetching entries:', sampleError.message);
      return;
    }

    console.log(`   Found ${sampleData?.length || 0} recent entries:`);
    sampleData?.forEach((entry: any, idx: number) => {
      console.log(`\n   Entry ${idx + 1}:`);
      console.log(`   - Phone: ${entry.phone || 'N/A'}`);
      console.log(`   - Email: ${entry.email || 'N/A'}`);
      console.log(`   - Method: ${entry.login_method}`);
      console.log(`   - Status: ${entry.status}`);
      console.log(`   - Device: ${entry.device_type || 'N/A'}`);
      console.log(`   - IP: ${entry.ip_address || 'N/A'}`);
      console.log(`   - Time: ${new Date(entry.created_at).toLocaleString()}`);
    });

    console.log('\n✅ Login history is working correctly!\n');

    // 4. Check API endpoint
    console.log('4️⃣ Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/admin/login-history');
    
    if (!response.ok) {
      console.error(`❌ API returned error: ${response.status}`);
      const errorData = await response.json();
      console.error('   Error:', errorData);
      return;
    }

    const apiData = await response.json();
    console.log(`✅ API returned ${apiData.loginHistory?.length || 0} entries\n`);

  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check Supabase connection (lib/supabase.ts)');
    console.error('   2. Verify environment variables are set');
    console.error('   3. Ensure database migration was run');
    console.error('   4. Check Supabase dashboard for table existence\n');
  }
}

// Run the check
checkLoginHistorySetup();
