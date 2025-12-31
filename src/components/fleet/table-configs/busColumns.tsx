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
    className: "min-w-[120px]",
    render: (value) => (
      <span className="font-medium text-gray-900 truncate block">{value}</span>
    ),
  },
  {
    key: "school",
    label: "School",
    sortable: true,
    className: "hidden lg:table-cell min-w-[140px]",
    render: (value) => (
      <span className="text-sm text-gray-700 truncate block">{value?.name || "N/A"}</span>
    ),
  },
  {
    key: "make",
    label: "Make",
    sortable: true,
    className: "hidden md:table-cell min-w-[100px]",
    render: (value) => (
      <span className="text-sm font-medium text-gray-800 truncate block">{value}</span>
    ),
  },
  {
    key: "model",
    label: "Model",
    sortable: true,
    className: "hidden md:table-cell min-w-[100px]",
    render: (value) => <span className="text-sm text-gray-600 truncate block">{value}</span>,
  },
  {
    key: "seatsCapacity",
    label: "Capacity",
    sortable: true,
    className: "hidden lg:table-cell",
    render: (value) => <span className="truncate block">{value} seats</span>,
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    className: "hidden sm:table-cell",
    render: (value) => getTypeBadge(value),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    className: "min-w-[80px]",
    render: (value) => getStatusBadge(value),
  },
  {
    key: "actions",
    label: "Actions",
    className: "min-w-[100px]",
    render: (_, row) => (
      <div className="flex space-x-1 sm:space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleEditItem(row)}
          className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
        >
          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline ml-1">Edit</span>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-1">Delete</span>
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
