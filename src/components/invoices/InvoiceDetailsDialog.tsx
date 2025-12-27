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
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Invoice Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Invoice Header with Basic Info */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{invoice.invoiceNumber}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-white">
                    {invoice.termName} {invoice.year}
                  </Badge>
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-3xl font-bold text-gray-800">{formatCurrency(invoice.totalAmount)}</div>
              </div>
            </div>
          </div>
          
          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Parent Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <p className="font-medium">{invoice.parentName}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <p className="font-medium">{invoice.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <p className="font-medium">{invoice.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <School className="w-4 h-4" />
                  School Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">School</Label>
                    <p className="font-medium">{invoice.schoolName}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Term</Label>
                    <p className="font-medium">{invoice.termName}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Year</Label>
                    <p className="font-medium">{invoice.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Issue Date</Label>
                    <p className="font-medium">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Due Date</Label>
                    <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Invoice Items Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Admission Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.studentName}</TableCell>
                      <TableCell>{item.admissionNumber}</TableCell>
                      <TableCell>{item.riderType}</TableCell>
                      <TableCell>{item.trips}</TableCell>
                      <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Summary */}
          <div className="flex flex-col items-end space-y-2 pt-4">
            <div className="flex justify-between w-full max-w-xs">
              <span className="font-medium">Subtotal:</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <Separator className="w-full max-w-xs" />
            <div className="flex justify-between w-full max-w-xs text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>

          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="text-blue-600 hover:bg-blue-50 border-blue-200"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {invoice.status === "Unpaid" && (
              <Button
                onClick={onMarkAsPaid}
                className="bg-green-600 hover:bg-green-700"
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
