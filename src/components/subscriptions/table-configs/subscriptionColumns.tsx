import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Subscription } from "../types";
import { Column } from "@/components/ui/enhanced-table";
import { formatCurrency } from "@/lib/utils";

export const createSubscriptionColumns = (
  onEdit: (subscription: Subscription) => void,
  onDelete: (subscription: Subscription) => void
): Column<Subscription>[] => [
  {
    key: "customerName",
    label: "Company Name",
    sortable: true,
  },
  {
    key: "studentRange",
    label: "Student Range",
    sortable: true,
    render: (_, subscription: Subscription) => (
      <span>{subscription.fromStudents.toLocaleString()} - {subscription.toStudents.toLocaleString()}</span>
    ),
  },
  {
    key: "pricePerTerm",
    label: "Price per Term",
    sortable: true,
    render: (value: number) => (
      <span>KES {formatCurrency(value)}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: string) => (
      <Badge 
        variant={value === "active" ? "default" : "secondary"}
        className={
          value === "active" 
            ? "bg-green-100 text-green-800 hover:bg-green-100 flex items-center justify-center w-20"
            : "bg-red-100 text-red-800 hover:bg-red-100 flex items-center justify-center w-20"
        }
      >
        {value === "active" ? "Active" : "Cancelled"}
      </Badge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_, subscription: Subscription) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(subscription)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the subscription for "{subscription.customerName}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(subscription)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
];