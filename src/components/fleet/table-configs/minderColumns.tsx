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
import { Minder } from "../types";
import { getStatusBadge } from "../utils/badges";

export const createMinderColumns = (
  handleEditItem: (item: Minder) => void,
  handleDeleteItem: (item: Minder) => void
): Column<Minder>[] => [
  {
    key: "name",
    label: "Minder Name",
    sortable: true,
    render: (value, row) => (
      <div className="flex items-center gap-3">
        {row.photo ? (
          <img
            src={row.photo}
            alt="Minder"
            className="w-8 h-8 rounded-md object-cover border border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <span className="font-medium text-gray-900">{value}</span>
      </div>
    ),
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    sortable: true,
    render: (value) => <span className="text-sm text-gray-700">{value}</span>,
  },
  {
    key: "school.name",
    label: "School Name",
    sortable: true,
    render: (_, row) => (
      <span className="text-sm text-gray-700">{row.school?.name || "N/A"}</span>
    ),
  },
  {
    key: "pin",
    label: "Pin",
    sortable: false,
    render: () => <span className="text-sm text-gray-500">••••</span>,
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
                minder from the system.
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
