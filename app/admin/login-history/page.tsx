"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Activity, Monitor, Smartphone, Tablet, Globe, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface LoginHistory {
  id: string;
  user_id: string | null;
  phone: string | null;
  email: string | null;
  login_method: string;
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  location_country: string | null;
  location_city: string | null;
  status: string;
  failure_reason: string | null;
  created_at: string;
}

export default function LoginHistoryPage() {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const fetchLoginHistory = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/admin/login-history");
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if it's a migration issue
        if (errorData.needsMigration) {
          throw new Error(`⚠️ DATABASE MIGRATION REQUIRED\n\n${errorData.error}\n\nSteps to fix:\n1. Open Supabase Dashboard\n2. Go to SQL Editor\n3. Create a new query\n4. Copy and paste contents from: supabase/add-user-tracking.sql\n5. Run the query\n6. Refresh this page`);
        }
        
        throw new Error(errorData.error || `Failed to fetch login history: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setLoginHistory(data.loginHistory || []);
    } catch (error) {
      console.error("Failed to fetch login history:", error);
      setError(error instanceof Error ? error.message : "Failed to load login history");
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const filteredHistory = loginHistory.filter((entry) => {
    const matchesSearch = 
      (entry.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (entry.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (entry.ip_address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: loginHistory.length,
    successful: loginHistory.filter(l => l.status === 'success').length,
    failed: loginHistory.filter(l => l.status === 'failed').length,
    mobileLogins: loginHistory.filter(l => l.device_type === 'mobile').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-800 mb-3">
                Error Loading Login History
              </h2>
              <div className="bg-white border border-red-300 rounded-md p-4 mb-4">
                <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                  {error}
                </pre>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchLoginHistory}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Retry
                </button>
                {error.includes('MIGRATION REQUIRED') && (
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Open Supabase Dashboard
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Login History</h1>
          <p className="text-gray-600 mt-1">
            Track all login attempts and user sessions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logins</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.successful}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mobile Logins</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.mobileLogins}</p>
            </div>
            <Smartphone className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by phone, email, or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="all">All Status</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Login History Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' ? "No login history matches your filters" : "No login history yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entry.status)}
                        <span className={`text-sm font-medium capitalize ${
                          entry.status === 'success' ? 'text-green-600' :
                          entry.status === 'failed' ? 'text-red-600' :
                          'text-orange-600'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {entry.phone && (
                          <p className="text-sm font-medium text-gray-900">{entry.phone}</p>
                        )}
                        {entry.email && (
                          <p className="text-sm text-gray-500">{entry.email}</p>
                        )}
                        {entry.ip_address && (
                          <p className="text-xs text-gray-400">IP: {entry.ip_address}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {entry.login_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          {getDeviceIcon(entry.device_type)}
                          <span className="capitalize">{entry.device_type || 'Unknown'}</span>
                        </div>
                        {entry.browser && (
                          <p className="text-xs text-gray-500">{entry.browser} • {entry.os}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span>
                          {entry.location_city && entry.location_country
                            ? `${entry.location_city}, ${entry.location_country}`
                            : entry.location_country || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(entry.created_at), "MMM dd, yyyy HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
