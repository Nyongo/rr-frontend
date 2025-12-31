import { Column } from "@/components/ui/enhanced-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, User } from "lucide-react";
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
import { Driver } from "../types";
import { getStatusBadge } from "../utils/badges";

export const createDriverColumns = (
  handleEditItem: (item: Driver) => void,
  handleDeleteItem: (item: Driver) => void
): Column<Driver>[] => [
  {
    key: "name",
    label: "Driver Name",
    sortable: true,
    className: "min-w-[150px]",
    render: (value, row) => (
      <div className="flex items-center gap-2 sm:gap-3">
        {row.photo ? (
          <img
            src={row.photo}
            alt="Driver"
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-md object-cover border border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          </div>
        )}
        <span className="font-medium text-gray-900 truncate">{value}</span>
      </div>
    ),
  },
  {
    key: "phoneNumber",
    label: "Phone",
    sortable: true,
    className: "hidden sm:table-cell min-w-[120px]",
    render: (value) => <span className="text-sm text-gray-700 truncate block">{value}</span>,
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
    key: "pin",
    label: "Pin",
    sortable: false,
    className: "hidden md:table-cell",
    render: (value) => (
      <span className="text-sm text-gray-500">{value || "••••"}</span>
    ),
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
                driver from the system.
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
