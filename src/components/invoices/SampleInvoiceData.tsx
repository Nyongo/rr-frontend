import { Invoice } from "./InvoiceTypes";

// Sample invoice data
export const sampleInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2025-001",
    parentId: 1,
    parentName: "Grace Wanjiku Kamau",
    email: "grace.kamau@gmail.com",
    phone: "+254 722 123 456",
    termId: 1,
    schoolName: "Nairobi Primary School",
    termName: "Term 1",
    year: "2025",
    status: "Paid",
    issueDate: "2025-01-10",
    dueDate: "2025-01-31",
    items: [
      {
        id: 1,
        studentId: 1,
        studentName: "Amina Kamau",
        admissionNumber: "STU2024001",
        riderType: "Daily Rider",
        trips: 60,
        unitCost: 600,
        amount: 600
      },
      {
        id: 2,
        studentId: 2,
        studentName: "David Kamau",
        admissionNumber: "STU2024002",
        riderType: "Occasional Rider",
        trips: 8,
        unitCost: 600,
        amount: 600
      }
    ],
    totalAmount: 1200,
    paidAmount: 1200
  },
  {
    id: 2,
    invoiceNumber: "INV-2025-002",
    parentId: 2,
    parentName: "John Mwangi",
    email: "john.mwangi@gmail.com",
    phone: "+254 733 456 789",
    termId: 1,
    schoolName: "Nairobi Primary School",
    termName: "Term 1",
    year: "2025",
    status: "Unpaid",
    issueDate: "2025-01-10",
    dueDate: "2025-01-31",
    items: [
      {
        id: 3,
        studentId: 3,
        studentName: "Sarah Mwangi",
        admissionNumber: "STU2024003",
        riderType: "Daily Rider",
        trips: 60,
        unitCost: 600,
        amount: 600
      }
    ],
    totalAmount: 600,
    paidAmount: 0
  },
  {
    id: 3,
    invoiceNumber: "INV-2025-003",
    parentId: 3,
    parentName: "James Ochieng",
    email: "james.ochieng@gmail.com",
    phone: "+254 755 987 123",
    termId: 1,
    schoolName: "Braeburn School",
    termName: "Term 1",
    year: "2025",
    status: "Unpaid",
    issueDate: "2025-01-12",
    dueDate: "2025-01-31",
    items: [
      {
        id: 4,
        studentId: 4,
        studentName: "Emma Ochieng",
        admissionNumber: "STU2024004",
        riderType: "Daily Rider",
        trips: 60,
        unitCost: 600,
        amount: 600
      },
      {
        id: 5,
        studentId: 5,
        studentName: "Michael Ochieng",
        admissionNumber: "STU2024005",
        riderType: "Occasional Rider",
        trips: 8,
        unitCost: 600,
        amount: 600
      }
    ],
    totalAmount: 1200,
    paidAmount: 0
  },
  {
    id: 4,
    invoiceNumber: "INV-2025-004",
    parentId: 4,
    parentName: "Rose Njeri",
    email: "rose.njeri@gmail.com",
    phone: "+254 722 789 012",
    termId: 2,
    schoolName: "Brookhouse School",
    termName: "Term 1",
    year: "2025",
    status: "Unpaid",
    issueDate: "2025-01-15",
    dueDate: "2025-02-15",
    items: [
      {
        id: 6,
        studentId: 6,
        studentName: "Jacob Njeri",
        admissionNumber: "STU2024006",
        riderType: "Daily Rider",
        trips: 60,
        unitCost: 600,
        amount: 600
      }
    ],
    totalAmount: 600,
    paidAmount: 0
  },
  {
    id: 5,
    invoiceNumber: "INV-2025-005",
    parentId: 5,
    parentName: "Daniel Kipchoge",
    email: "daniel.kipchoge@gmail.com",
    phone: "+254 733 012 345",
    termId: 3,
    schoolName: "Moi Educational Centre",
    termName: "Term 1",
    year: "2025",
    status: "Paid",
    issueDate: "2025-01-18",
    dueDate: "2025-02-18",
    items: [
      {
        id: 7,
        studentId: 7,
        studentName: "Ethan Kipchoge",
        admissionNumber: "STU2024007",
        riderType: "Occasional Rider",
        trips: 8,
        unitCost: 600,
        amount: 600
      },
      {
        id: 8,
        studentId: 8,
        studentName: "Olivia Kipchoge",
        admissionNumber: "STU2024008",
        riderType: "Daily Rider",
        trips: 60,
        unitCost: 600,
        amount: 600
      }
    ],
    totalAmount: 1200,
    paidAmount: 1200
  }
];