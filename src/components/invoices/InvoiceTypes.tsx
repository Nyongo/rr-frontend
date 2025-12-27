export interface Student {
  id: number;
  name: string;
  admissionNumber: string;
  schoolName: string;
  status: string;
}

export interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export interface InvoiceItem {
  id: number;
  studentId: number;
  studentName: string;
  admissionNumber: string;
  riderType: "Daily Rider" | "Occasional Rider";
  trips: number;
  unitCost: number;  // Cost per student (e.g. KES 600)
  amount: number;    // Same as unitCost
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  parentId: number;
  parentName: string;
  email: string;
  phone: string;
  termId: number;
  schoolName: string;
  termName: string;
  year: string;
  status: "Paid" | "Unpaid";
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
}