import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown, CreditCard, Receipt, User, Calendar, School } from "lucide-react";
import { Invoice } from "./InvoiceTypes";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface InvoiceDetailsDialogProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsPaid: () => void;
}

const InvoiceDetailsDialog = ({ invoice, isOpen, onClose, onMarkAsPaid }: InvoiceDetailsDialogProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Invoice Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 mt-4">
          {/* Invoice Header with Basic Info */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 sm:p-6 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{invoice.invoiceNumber}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-white">
                    {invoice.termName} {invoice.year}
                  </Badge>
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
              <div className="mt-0 md:mt-0 text-left md:text-right">
                <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-800">{formatCurrency(invoice.totalAmount)}</div>
              </div>
            </div>
          </div>
          
          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Parent Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <p className="font-medium text-sm sm:text-base">{invoice.parentName}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <p className="font-medium text-sm sm:text-base break-words">{invoice.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <p className="font-medium text-sm sm:text-base">{invoice.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <School className="w-3 h-3 sm:w-4 sm:h-4" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">School</Label>
                    <p className="font-medium text-sm sm:text-base">{invoice.schoolName}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Term</Label>
                    <p className="font-medium text-sm sm:text-base">{invoice.termName}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Year</Label>
                    <p className="font-medium text-sm sm:text-base">{invoice.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  Date Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Issue Date</Label>
                    <p className="font-medium text-sm sm:text-base">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Due Date</Label>
                    <p className="font-medium text-sm sm:text-base">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Invoice Items Table */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">Invoice Items</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Student</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Admission Number</TableHead>
                      <TableHead className="text-xs sm:text-sm">Type</TableHead>
                      <TableHead className="text-xs sm:text-sm">Trips</TableHead>
                      <TableHead className="text-xs sm:text-sm hidden md:table-cell">Unit Cost</TableHead>
                      <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-xs sm:text-sm">{item.studentName}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{item.admissionNumber}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.riderType}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{item.trips}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell className="text-xs sm:text-sm font-medium">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="flex flex-col items-end space-y-2 pt-4">
            <div className="flex justify-between w-full sm:max-w-xs">
              <span className="font-medium text-sm sm:text-base">Subtotal:</span>
              <span className="text-sm sm:text-base">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <Separator className="w-full sm:max-w-xs" />
            <div className="flex justify-between w-full sm:max-w-xs text-base sm:text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>

          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sm:space-x-0 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="text-blue-600 hover:bg-blue-50 border-blue-200 w-full sm:w-auto"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {invoice.status === "Unpaid" && (
              <Button
                onClick={onMarkAsPaid}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Mark as Paid
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDetailsDialog;
