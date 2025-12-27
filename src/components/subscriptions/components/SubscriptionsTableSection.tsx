import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Search } from "lucide-react";
import { Subscription } from "../types";
import { createSubscriptionColumns } from "../table-configs/subscriptionColumns";

interface SubscriptionsTableSectionProps {
  subscriptions: Subscription[];
  onEditSubscription: (subscription: Subscription) => void;
  onDeleteSubscription: (subscription: Subscription) => void;
}

export const SubscriptionsTableSection = ({ 
  subscriptions, 
  onEditSubscription, 
  onDeleteSubscription 
}: SubscriptionsTableSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubscriptions = subscriptions.filter(subscription => 
    subscription.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    subscription.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${subscription.fromStudents} - ${subscription.toStudents}`.includes(searchTerm) ||
    subscription.pricePerTerm.toString().includes(searchTerm)
  );

  const subscriptionColumns = createSubscriptionColumns(onEditSubscription, onDeleteSubscription);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input 
          placeholder="Search subscriptions by company, status, student range, or price..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="pl-10" 
        />
      </div>

      {/* Subscriptions Table */}
      <EnhancedTable 
        data={filteredSubscriptions} 
        columns={subscriptionColumns}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showPageSizeSelector: true
        }}
      />
    </div>
  );
};