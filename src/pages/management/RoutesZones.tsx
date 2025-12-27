
import { useState } from "react";
import Layout from "@/components/Layout";
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from "@/components/ui/enhanced-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Route } from "lucide-react";
import RoutesTab from "@/components/routes/RoutesTab";
import ZonesTab from "@/components/zones/ZonesTab";

const RoutesZones = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Route className="w-8 h-8 text-blue-600" />
              Routes & Zones
            </h1>
            <p className="text-gray-600 mt-1">Manage bus routes and pickup zones</p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <EnhancedTabs defaultValue="routes" className="w-full">
          <EnhancedTabsList className="grid-cols-2">
            <EnhancedTabsTrigger 
              value="routes"
              useCustomGreen={true}
            >
              <Route className="w-4 h-4 mr-2" />
              Routes
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger 
              value="zones"
              useCustomGreen={true}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Zones
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          
          <EnhancedTabsContent value="routes" className="space-y-6">
            <RoutesTab />
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="zones" className="space-y-6">
            <ZonesTab />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </div>
    </Layout>
  );
};

export default RoutesZones;
