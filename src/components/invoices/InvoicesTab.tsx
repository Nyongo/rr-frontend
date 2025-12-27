import { useState } from "react";
import InvoicesTable from "./InvoicesTable";
import { Invoice } from "./InvoiceTypes";
import { sampleInvoices } from "./SampleInvoiceData";

const InvoicesTab = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    ));
  };

  return (
    <div className="space-y-4">
      <InvoicesTable 
        invoices={invoices}
        onUpdateInvoice={handleUpdateInvoice}
      />
    </div>
  );
};

export default InvoicesTab;