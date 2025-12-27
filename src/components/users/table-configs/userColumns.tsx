
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User } from "../types";
import { Column } from "@/components/ui/enhanced-table";

export const createUserColumns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): Column<User>[] => [
  {
    key: "fullName",
    label: "Full Name",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "phone",
    label: "Phone",
    sortable: true,
  },
  {
    key: "pin",
    label: "Password",
    render: (value: string) => (
      <span className="font-mono text-sm">••••</span>
    ),
  },
  {
    key: "schoolName",
    label: "School Name",
    sortable: true,
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (value: string) => (
      <Badge 
        variant={value === "Admin" ? "default" : "outline"}
        className={
          value === "Admin" 
            ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: string) => (
      <Badge 
        variant={value === "Active" ? "default" : "secondary"}
        className={
          value === "Active" 
            ? "bg-green-100 text-green-800 hover:bg-green-100" 
            : "bg-red-100 text-red-800 hover:bg-red-100"
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_, user: User) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
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
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{user.fullName}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(user)}
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
