import { Column } from "@/components/ui/enhanced-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bus } from "../types";
import { getStatusBadge, getTypeBadge } from "../utils/badges";

export const createBusColumns = (
  handleEditItem: (item: Bus) => void,
  handleDeleteItem: (item: Bus) => void
): Column<Bus>[] => [
  {
    key: "registrationNumber",
    label: "Registration No.",
    sortable: true,
    render: (value) => (
      <span className="font-medium text-gray-900">{value}</span>
    ),
  },
  {
    key: "school",
    label: "School",
    sortable: true,
    render: (value) => (
      <span className="text-sm text-gray-700">{value?.name || "N/A"}</span>
    ),
  },
  {
    key: "make",
    label: "Make",
    sortable: true,
    render: (value) => (
      <span className="text-sm font-medium text-gray-800">{value}</span>
    ),
  },
  {
    key: "model",
    label: "Model",
    sortable: true,
    render: (value) => <span className="text-sm text-gray-600">{value}</span>,
  },
  {
    key: "seatsCapacity",
    label: "Capacity",
    sortable: true,
    render: (value) => `${value} seats`,
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (value) => getTypeBadge(value),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value) => getStatusBadge(value),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_, row) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleEditItem(row)}>
          <Edit className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                bus from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteItem(row)}
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
