import React from "react";
import { Card, CardContent } from "./card";
import { Column } from "./table-header";
import { cn } from "@/lib/utils";

interface TableCardsProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export function TableCards<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
}: TableCardsProps<T>) {
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((value, key) => value?.[key], obj);
  };

  // Filter out columns that are hidden on mobile (those with className containing 'hidden')
  // Also separate actions column
  const visibleColumns = columns.filter(
    (col) => !col.className?.includes("hidden") && col.key !== "actions"
  );
  const actionsColumn = columns.find((col) => col.key === "actions");

  // Get primary columns (first 2-3 that should be shown prominently)
  const primaryColumns = visibleColumns.slice(0, 2);
  const secondaryColumns = visibleColumns.slice(2);

  return (
    <div className="space-y-3">
      {data.map((row, index) => {
        const isInactive =
          row.status && row.status.toLowerCase() === "inactive";

        const handleCardClick = (e: React.MouseEvent) => {
          // Don't trigger row click if clicking on action buttons
          if ((e.target as HTMLElement).closest('button, [role="button"]')) {
            return;
          }
          onRowClick && onRowClick(row);
        };

        return (
          <Card
            key={index}
            className={cn(
              "transition-shadow hover:shadow-md",
              isInactive && "opacity-60 bg-gray-50",
              onRowClick && "cursor-pointer"
            )}
            onClick={handleCardClick}
          >
            <CardContent className="p-4">
              {/* Primary information - larger, at the top */}
              <div className="space-y-3">
                {primaryColumns.map((column) => {
                  const value = getNestedValue(row, column.key as string);
                  const renderedValue = column.render
                    ? column.render(value, row)
                    : value || "—";

                  // Check if rendered value is a React element (badge, button, etc.)
                  const isReactElement = React.isValidElement(renderedValue);

                  return (
                    <div key={column.key as string} className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          {column.label}
                        </div>
                        <div className={cn(
                          "text-sm",
                          !isReactElement && "font-medium text-gray-900",
                          isInactive && !isReactElement && "text-gray-500"
                        )}>
                          {renderedValue}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Secondary information - smaller, grouped */}
                {secondaryColumns.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                      {secondaryColumns.map((column) => {
                        const value = getNestedValue(row, column.key as string);
                        const renderedValue = column.render
                          ? column.render(value, row)
                          : value || "—";

                        return (
                          <div key={column.key as string} className="min-w-0">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              {column.label}
                            </div>
                            <div className={cn(
                              "text-sm text-gray-700",
                              isInactive && "text-gray-500",
                              typeof renderedValue === 'string' && "truncate"
                            )}>
                              {renderedValue}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions - at the bottom */}
                {actionsColumn && (
                  <div className="pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                    {actionsColumn.render?.(
                      getNestedValue(row, "actions"),
                      row
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
