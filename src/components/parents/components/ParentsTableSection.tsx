import { useState } from "react";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { Parent } from "../types";
import { createParentColumns } from "../table-configs/parentColumns";

interface ParentsTableSectionProps {
  parents: Parent[];
  loading?: boolean;
  onEditParent: (parent: Parent) => void;
  onDeleteParent: (parent: Parent) => void;
  onParentClick: (parentId: string) => void;
  onRowClick: (parent: Parent) => void;
}

export const ParentsTableSection = ({
  parents,
  loading = false,
  onEditParent,
  onDeleteParent,
  onParentClick,
  onRowClick,
}: ParentsTableSectionProps) => {
  const parentColumns = createParentColumns(
    onEditParent,
    onDeleteParent,
    onParentClick
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading parents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EnhancedTable
        data={parents}
        columns={parentColumns}
        onRowClick={onRowClick}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50],
          showPageSizeSelector: true,
        }}
      />
    </div>
  );
};
