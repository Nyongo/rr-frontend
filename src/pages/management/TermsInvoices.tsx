import { useState } from "react";
import Layout from "@/components/Layout";
import { EnhancedTabs, EnhancedTabsContent, EnhancedTabsList, EnhancedTabsTrigger } from "@/components/ui/enhanced-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt } from "lucide-react";
import TermsTab from "@/components/terms/TermsTab";
import InvoicesTab from "@/components/invoices/InvoicesTab";

const TermsInvoices = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              Terms & Invoices
            </h1>
            <p className="text-gray-600 mt-1">Manage terms and invoices</p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <EnhancedTabs defaultValue="terms" className="w-full">
          <EnhancedTabsList className="grid-cols-2">
            <EnhancedTabsTrigger 
              value="terms"
              useCustomGreen={true}
            >
              <FileText className="w-4 h-4 mr-2" />
              Terms
            </EnhancedTabsTrigger>
            <EnhancedTabsTrigger 
              value="invoices"
              useCustomGreen={true}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Invoices
            </EnhancedTabsTrigger>
          </EnhancedTabsList>
          
          <EnhancedTabsContent value="terms" className="space-y-6">
            <TermsTab />
          </EnhancedTabsContent>
          
          <EnhancedTabsContent value="invoices" className="space-y-6">
            <InvoicesTab />
          </EnhancedTabsContent>
        </EnhancedTabs>
      </div>
    </Layout>
  );
};

export default TermsInvoices;