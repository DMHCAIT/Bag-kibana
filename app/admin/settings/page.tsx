"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Globe, Database, Mail, Shield, Bell } from "lucide-react";

interface SettingSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

const settingSections: SettingSection[] = [
  {
    id: "general",
    title: "General Settings",
    icon: Globe,
    description: "Basic site configuration and preferences"
  },
  {
    id: "database",
    title: "Database",
    icon: Database,
    description: "Database connection and synchronization"
  },
  {
    id: "email",
    title: "Email Configuration",
    icon: Mail,
    description: "SMTP settings and email templates"
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    description: "Authentication and access control"
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "System alerts and notification preferences"
  }
];

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    siteName: "KIBANA",
    siteDescription: "Premium luxury handbag collection",
    adminEmail: "admin@kibana.in",
    supportEmail: "support@kibana.in",
    currency: "INR",
    timezone: "Asia/Kolkata",
    enableNotifications: true,
    enableAnalytics: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    // In a real app, this would save to your backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Site Name</label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => handleInputChange("siteName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Site Description</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleInputChange("siteDescription", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Currency</label>
        <select
          value={settings.currency}
          onChange={(e) => handleInputChange("currency", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Timezone</label>
        <select
          value={settings.timezone}
          onChange={(e) => handleInputChange("timezone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
          <option value="America/New_York">America/New_York (EST)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={settings.maintenanceMode}
          onChange={(e) => handleInputChange("maintenanceMode", e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="maintenanceMode" className="text-sm font-medium">
          Enable Maintenance Mode
        </label>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Admin Email</label>
        <input
          type="email"
          value={settings.adminEmail}
          onChange={(e) => handleInputChange("adminEmail", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Support Email</label>
        <input
          type="email"
          value={settings.supportEmail}
          onChange={(e) => handleInputChange("supportEmail", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">SMTP Configuration</h4>
        <p className="text-sm text-gray-600 mb-4">Configure email server settings (requires backend implementation)</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SMTP Host</label>
            <input
              type="text"
              placeholder="smtp.gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Port</label>
              <input
                type="number"
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Encryption</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                disabled
              >
                <option>TLS</option>
                <option>SSL</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enableNotifications"
          checked={settings.enableNotifications}
          onChange={(e) => handleInputChange("enableNotifications", e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="enableNotifications" className="text-sm font-medium">
          Enable System Notifications
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="enableAnalytics"
          checked={settings.enableAnalytics}
          onChange={(e) => handleInputChange("enableAnalytics", e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="enableAnalytics" className="text-sm font-medium">
          Enable Analytics Tracking
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Notification Types</h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm">New order notifications</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm">Low stock alerts</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
            <span className="text-sm">Customer support messages</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm">Marketing campaign updates</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Database Status</h4>
        <p className="text-sm text-green-700">Connected to Supabase • All systems operational</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Database Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span>Supabase</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Region:</span>
            <span>Auto-selected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Sync:</span>
            <span>Just now</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start">
            <Database className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
          <Button variant="outline" className="justify-start">
            <Database className="w-4 h-4 mr-2" />
            Sync Products
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Security Status</h4>
        <p className="text-sm text-blue-700">Authentication disabled for admin access • All APIs accessible</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Current Configuration</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Admin Authentication:</span>
            <span className="text-orange-600">Disabled</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">API Protection:</span>
            <span className="text-orange-600">Public Access</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Session Management:</span>
            <span className="text-green-600">Active</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Security Notice</h4>
        <p className="text-sm text-yellow-700">
          Admin authentication has been disabled for easy access. Consider enabling authentication 
          for production environments to secure admin functionality.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSettings();
      case "email":
        return renderEmailSettings();
      case "notifications":
        return renderNotificationSettings();
      case "database":
        return renderDatabaseSettings();
      case "security":
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your application configuration and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-black hover:bg-gray-800">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 ${
                        activeSection === section.id
                          ? "bg-gray-100 border-r-2 border-black font-medium"
                          : ""
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {settingSections.find(s => s.id === activeSection)?.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {settingSections.find(s => s.id === activeSection)?.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}