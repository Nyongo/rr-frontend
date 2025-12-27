import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Mail, Phone, User } from "lucide-react";
import { Column } from "@/components/ui/enhanced-table";
import { Parent } from "../types";

export const createParentColumns = (
  onEdit: (parent: Parent) => void,
  onDelete: (parent: Parent) => void,
  onView: (parentId: string) => void
): Column<Parent>[] => [
  {
    key: "name",
    label: "Parent Name",
    sortable: true,
    render: (value: string) => (
      <div className="font-medium text-gray-900">{value}</div>
    ),
  },
  {
    key: "parentType",
    label: "Parent Type",
    sortable: true,
    render: (value: string) => <span className="text-gray-700">{value}</span>,
  },
  {
    key: "phoneNumber",
    label: "Phone",
    render: (value: string, row: Parent) => (
      <span className="text-gray-700">
        {row.phoneNumber || row.phone || "Not provided"}
      </span>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (value: string, row: Parent) => (
      <span className="text-gray-700">{row.email || "Not provided"}</span>
    ),
  },
  {
    key: "school.name",
    label: "School",
    sortable: true,
    render: (value: string, row: Parent) => (
      <span className="text-gray-700">
        {row.school?.name || "Not assigned"}
      </span>
    ),
  },
  {
    key: "studentsCount",
    label: "Students",
    sortable: true,
    render: (value: number, row: Parent) => (
      <Badge variant="outline">
        {row.studentsCount || 0} student
        {(row.studentsCount || 0) !== 1 ? "s" : ""}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: string) => {
      const variant = value === "Active" ? "success" : "destructive";
      return <Badge variant={variant}>{value}</Badge>;
    },
  },
  {
    key: "actions",
    label: "Actions",
    render: (value: any, row: Parent) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onView(row.id);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
