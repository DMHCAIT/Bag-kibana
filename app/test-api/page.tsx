"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    const tests: any = {};

    // Test 1: All Products
    try {
      const res1 = await fetch('/api/products');
      const data1 = await res1.json();
      tests.allProducts = {
        status: res1.status,
        success: res1.ok,
        count: data1.products?.length || 0,
        data: data1
      };
    } catch (e: any) {
      tests.allProducts = { error: e.message };
    }

    // Test 2: Single Product (first product)
    try {
      const res2 = await fetch('/api/products/vistara-tote-teal-blue');
      const data2 = await res2.json();
      tests.singleProduct = {
        status: res2.status,
        success: res2.ok,
        product: data2.product?.name || 'Not found',
        data: data2
      };
    } catch (e: any) {
      tests.singleProduct = { error: e.message };
    }

    // Test 3: Bestsellers Section
    try {
      const res3 = await fetch('/api/products/sections/bestsellers');
      const data3 = await res3.json();
      tests.bestsellers = {
        status: res3.status,
        success: res3.ok,
        count: data3.products?.length || 0,
        data: data3
      };
    } catch (e: any) {
      tests.bestsellers = { error: e.message };
    }

    // Test 4: New Arrivals Section
    try {
      const res4 = await fetch('/api/products/sections/new-arrivals');
      const data4 = await res4.json();
      tests.newArrivals = {
        status: res4.status,
        success: res4.ok,
        count: data4.products?.length || 0,
        data: data4
      };
    } catch (e: any) {
      tests.newArrivals = { error: e.message };
    }

    // Test 5: Admin Products
    try {
      const res5 = await fetch('/api/admin/products');
      const data5 = await res5.json();
      tests.adminProducts = {
        status: res5.status,
        success: res5.ok,
        count: data5.products?.length || 0,
        data: data5
      };
    } catch (e: any) {
      tests.adminProducts = { error: e.message };
    }

    // Test 6: Admin Orders
    try {
      const res6 = await fetch('/api/admin/orders');
      const data6 = await res6.json();
      tests.adminOrders = {
        status: res6.status,
        success: res6.ok,
        count: data6.orders?.length || 0,
        data: data6
      };
    } catch (e: any) {
      tests.adminOrders = { error: e.message };
    }

    // Test 7: Admin Customers
    try {
      const res7 = await fetch('/api/admin/customers');
      const data7 = await res7.json();
      tests.adminCustomers = {
        status: res7.status,
        success: res7.ok,
        count: data7.customers?.length || 0,
        data: data7
      };
    } catch (e: any) {
      tests.adminCustomers = { error: e.message };
    }

    // Test 8: Admin Reports
    try {
      const res8 = await fetch('/api/admin/reports?days=30');
      const data8 = await res8.json();
      tests.adminReports = {
        status: res8.status,
        success: res8.ok,
        hasData: !!data8.summary,
        data: data8
      };
    } catch (e: any) {
      tests.adminReports = { error: e.message };
    }

    setResults(tests);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl tracking-[0.15em] mb-8 text-center">
            API TESTING DASHBOARD
          </h1>

          <div className="mb-8 text-center">
            <Button
              onClick={testEndpoints}
              disabled={loading}
              className="uppercase tracking-wider bg-black text-white hover:bg-gray-800 px-8 py-6"
            >
              {loading ? "Testing..." : "Run All Tests"}
            </Button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              {Object.entries(results).map(([key, value]: [string, any]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="uppercase tracking-wide text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {value.success ? (
                        <span className="text-green-600 text-xl">✓</span>
                      ) : (
                        <span className="text-red-600 text-xl">✗</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {value.error && (
                        <div className="text-red-600">Error: {value.error}</div>
                      )}
                      {value.status && (
                        <div>Status: <span className={value.status === 200 ? 'text-green-600' : 'text-red-600'}>{value.status}</span></div>
                      )}
                      {value.count !== undefined && (
                        <div>Count: {value.count}</div>
                      )}
                      {value.product && (
                        <div>Product: {value.product}</div>
                      )}
                      {value.hasData !== undefined && (
                        <div>Has Data: {value.hasData ? 'Yes' : 'No'}</div>
                      )}
                      <details className="mt-4">
                        <summary className="cursor-pointer text-blue-600 hover:underline">
                          View Full Response
                        </summary>
                        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                          {JSON.stringify(value.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {Object.keys(results).length === 0 && !loading && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Click "Run All Tests" to test all API endpoints
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

