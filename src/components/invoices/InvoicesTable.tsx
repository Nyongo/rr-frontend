import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { Search, Receipt, Edit, FileDown, Check, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Invoice } from "./InvoiceTypes";
import { formatCurrency } from "@/lib/utils";
import InvoiceDetailsDialog from "./InvoiceDetailsDialog";

interface InvoicesTableProps {
  invoices: Invoice[];
  onUpdateInvoice: (invoice: Invoice) => void;
}

const InvoicesTable = ({ invoices: initialInvoices, onUpdateInvoice }: InvoicesTableProps) => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isMarkAsPaidDialogOpen, setIsMarkAsPaidDialogOpen] = useState(false);

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsDialogOpen(true);
  };

  const handleMarkAsPaid = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoice(invoice);
    setIsMarkAsPaidDialogOpen(true);
  };

  const handleMarkAsPaidConfirm = () => {
    if (!selectedInvoice) return;

    const updatedInvoice: Invoice = {
      ...selectedInvoice,
      status: "Paid",
      paidAmount: selectedInvoice.totalAmount,
    };

    setInvoices(invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    ));
    onUpdateInvoice(updatedInvoice);
    setIsMarkAsPaidDialogOpen(false);
  };

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge based on invoice status
  const getStatusBadge = (status: string) => {
    let variant: "default" | "destructive" | "outline" | "secondary" | "success" | "danger" | "bustype" | "minibus" = "secondary";
    
    if (status === "Paid") {
      variant = "success";
    } else if (status === "Unpaid") {
      variant = "danger";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => {
    const searchLower = searchTerm.toLowerCase();
    // Check if search term is a number that could match the amount
    const searchAmount = parseInt(searchTerm.replace(/[^0-9]/g, ''));
    
    // Format dates for searching
    const issueDateFormatted = formatDate(invoice.issueDate).toLowerCase();
    const dueDateFormatted = formatDate(invoice.dueDate).toLowerCase();
    
    return invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.parentName.toLowerCase().includes(searchLower) ||
      invoice.schoolName.toLowerCase().includes(searchLower) ||
      invoice.termName.toLowerCase().includes(searchLower) ||
      invoice.year.toLowerCase().includes(searchLower) ||
      invoice.status.toLowerCase().includes(searchLower) ||
      // Check if formatted amount includes search term
      formatCurrency(invoice.totalAmount).toLowerCase().includes(searchLower) ||
      // Check if numeric amount matches
      (!isNaN(searchAmount) && invoice.totalAmount.toString().includes(searchAmount.toString())) ||
      // Check issue and due dates
      issueDateFormatted.includes(searchLower) ||
      dueDateFormatted.includes(searchLower);
  });

  // Invoice table columns
  const invoiceColumns: Column<Invoice>[] = [
    {
      key: "invoiceNumber",
      label: "Invoice #",
      sortable: true,
    },
    {
      key: "parentName",
      label: "Parent Name",
      sortable: true,
    },
    {
      key: "schoolName",
      label: "School",
      sortable: true,
    },
    {
      key: "termInfo",
      label: "Term",
      sortable: true,
      render: (_, invoice) => (
        <span>{invoice.termName} {invoice.year}</span>
      ),
    },
    {
      key: "issueDate",
      label: "Issue Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "totalAmount",
      label: "Amount",
      sortable: true,
      render: (value) => <span className="text-left">{formatCurrency(value)}</span>,
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
      render: (_, invoice) => (
        <div className="flex space-x-2">
          {invoice.status !== "Paid" && (
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 hover:bg-green-50"
              onClick={(e) => handleMarkAsPaid(invoice, e)}
            >
              <CreditCard className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Download invoice logic would go here
              alert(`Downloading invoice ${invoice.invoiceNumber}`);
            }}
          >
            <FileDown className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Invoices</h2>
          <p className="text-gray-600">Manage student transport invoices</p>
        </div>
      </div>
      
      <div className="relative w-full mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search invoices by number, parent, school, term, year, status, amount, issue date, or due date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      {/* Table */}
      {filteredInvoices.length > 0 ? (
        <EnhancedTable
          data={filteredInvoices}
          columns={invoiceColumns}
          onRowClick={handleRowClick}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
            showPageSizeSelector: true,
          }}
        />
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No invoices found
          </h3>
          <p className="text-gray-600">
            No matching invoices found for your search criteria
          </p>
        </div>
      )}

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <InvoiceDetailsDialog
          invoice={selectedInvoice}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onMarkAsPaid={() => {
            setIsDetailsDialogOpen(false);
            setIsMarkAsPaidDialogOpen(true);
          }}
        />
      )}

      {/* Mark as Paid Confirmation Dialog */}
      <AlertDialog open={isMarkAsPaidDialogOpen} onOpenChange={setIsMarkAsPaidDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Invoice as Paid?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedInvoice && (
                <>
                  This will mark invoice <strong>{selectedInvoice.invoiceNumber}</strong> for <strong>{selectedInvoice.parentName}</strong> as paid in full.
                  The amount of <strong>{formatCurrency(selectedInvoice.totalAmount)}</strong> will be recorded as received.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsPaidConfirm();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoicesTable;
