
import * as React from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto -mx-2 sm:mx-0 rounded-lg border border-gray-200 shadow-sm">
    {/* Scroll indicator for mobile */}
    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden z-10" />
    <div className="inline-block min-w-full align-middle">
    <table
      ref={ref}
        className={cn("w-full caption-bottom text-xs sm:text-sm bg-white min-w-[640px] sm:min-w-0", className)}
      {...props}
    />
    </div>
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-gray-50 [&_tr]:border-b border-gray-200", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-100 [&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-gray-100 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-blue-50",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  resizable?: boolean;
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(({ className, sortable, sortDirection, onSort, resizable, children, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 sm:h-12 px-2 sm:px-4 text-left align-middle font-semibold text-gray-700 bg-gray-50 [&:has([role=checkbox])]:pr-0 text-xs sm:text-sm",
      sortable && "cursor-pointer hover:bg-gray-100 select-none",
      resizable && "resize-x overflow-hidden",
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center space-x-1 sm:space-x-2">
      <span className="truncate">{children}</span>
      {sortable && (
        <div className="flex flex-col flex-shrink-0">
          {sortDirection === null && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
          {sortDirection === 'asc' && <ChevronUp className="w-3 h-3 text-blue-600" />}
          {sortDirection === 'desc' && <ChevronDown className="w-3 h-3 text-blue-600" />}
        </div>
      )}
    </div>
  </th>
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-2 sm:px-4 py-2 sm:py-4 align-middle text-gray-600 [&:has([role=checkbox])]:pr-0 text-xs sm:text-sm", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
