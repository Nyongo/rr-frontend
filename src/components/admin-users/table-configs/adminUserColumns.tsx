import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, KeyRound } from "lucide-react";
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
import { AdminUser } from "../types";
import { Column } from "@/components/ui/enhanced-table";

export const createAdminUserColumns = (
  onEdit: (user: AdminUser) => void,
  onResetPassword: (user: AdminUser) => void
): Column<AdminUser>[] => [
  {
    key: "name",
    label: "Full Name",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    sortable: true,
    render: (value: string | undefined) => (
      <span className="text-sm text-gray-600">{value || "Not provided"}</span>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
    render: (value: string) => (
      <span className="text-sm text-gray-600">
        {new Date(value).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "lastLoggedInOn",
    label: "Last Login",
    sortable: true,
    render: (value: string | null) => (
      <span className="text-sm text-gray-600">
        {value ? new Date(value).toLocaleDateString() : "Never"}
      </span>
    ),
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (value: any) => (
      <Badge
        variant={value?.name === "Admin" ? "default" : "outline"}
        className={
          value?.name === "Admin"
            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
      >
        {value?.name || "No Role"}
      </Badge>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: true,
    render: (value: boolean) => (
      <Badge
        variant={value ? "default" : "secondary"}
        className={
          value
            ? "bg-green-100 text-green-800 hover:bg-green-100 flex items-center justify-center w-20"
            : "bg-red-100 text-red-800 hover:bg-red-100 flex items-center justify-center w-20"
        }
      >
        {value ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_, user: AdminUser) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
          <Edit className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
            >
              <KeyRound className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Password</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset the password for "{user.name}"? A
                new password will be generated and sent to their email address.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onResetPassword(user)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Reset Password
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
];
