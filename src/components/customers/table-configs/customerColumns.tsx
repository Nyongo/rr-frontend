import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, KeyRound, CheckCircle, XCircle } from "lucide-react";
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
import { Customer } from "../types";
import { Column } from "@/components/ui/enhanced-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const createCustomerColumns = (
  onEdit: (customer: Customer) => void,
  onResetPassword: (customer: Customer) => void
): Column<Customer>[] => [
  {
    key: "company",
    label: "Company",
    sortable: true,
    render: (_, customer: Customer) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {customer.companyLogo ? (
            <AvatarImage
              src={customer.companyLogo}
              alt={customer.companyName}
            />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary">
            {customer.companyName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{customer.companyName}</p>
        </div>
      </div>
    ),
  },
  {
    key: "contactPerson",
    label: "Contact Person",
    sortable: true,
  },
  {
    key: "phoneNumber",
    label: "Phone",
    sortable: true,
  },
  {
    key: "emailAddress",
    label: "Email",
    sortable: true,
  },
  {
    key: "numberOfSchools",
    label: "Schools",
    sortable: true,
    render: (value: number) => <div className="text-center">{value}</div>,
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
            ? "bg-green-100 text-green-800 hover:bg-green-100 flex items-center justify-center"
            : "bg-red-100 text-red-800 hover:bg-red-100 flex items-center justify-center"
        }
      >
        {value ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_, customer: Customer) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
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
                Are you sure you want to reset the password for "
                {customer.companyName}"? A new password will be sent to their
                email address.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onResetPassword(customer)}
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
