import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";

interface SubscriptionsPageHeaderProps {
  onAddSubscription: () => void;
}

export const SubscriptionsPageHeader = ({ onAddSubscription }: SubscriptionsPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-purple-600" />
          Subscriptions
        </h1>
        <p className="text-gray-600 mt-1">Manage customer subscriptions and billing</p>
      </div>
      
      <div>
        <Button 
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white" 
          onClick={onAddSubscription}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>
    </div>
  );
};