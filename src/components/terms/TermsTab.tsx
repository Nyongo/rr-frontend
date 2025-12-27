import { useState } from "react";
import TermsTable from "./TermsTable";
import { TermData } from "./TermForm";

// Sample data for initial terms
const initialTerms: TermData[] = [
  {
    id: 1,
    schoolId: 1,
    schoolName: "Nairobi Primary School",
    year: "2025",
    term: "Term 1",
    startDate: new Date("2025-01-06"),
    endDate: new Date("2025-04-04"),
  },
  {
    id: 2,
    schoolId: 1,
    schoolName: "Nairobi Primary School",
    year: "2025",
    term: "Term 2",
    startDate: new Date("2025-05-05"),
    endDate: new Date("2025-07-25"),
  },
  {
    id: 3,
    schoolId: 1,
    schoolName: "Nairobi Primary School",
    year: "2025",
    term: "Term 3",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-11-14"),
  },
  {
    id: 4,
    schoolId: 2,
    schoolName: "Moi Educational Centre",
    year: "2025",
    term: "Term 1",
    startDate: new Date("2025-01-13"),
    endDate: new Date("2025-04-11"),
  },
];

const TermsTab = () => {
  const [terms, setTerms] = useState<TermData[]>(initialTerms);

  const handleAddTerm = (term: TermData) => {
    setTerms([...terms, term]);
  };

  const handleUpdateTerm = (updatedTerm: TermData) => {
    setTerms(terms.map(term => term.id === updatedTerm.id ? updatedTerm : term));
  };

  const handleDeleteTerm = (termId: number) => {
    setTerms(terms.filter(term => term.id !== termId));
  };

  return (
    <div className="space-y-4">
      <TermsTable 
        terms={terms}
        onAddTerm={handleAddTerm}
        onUpdateTerm={handleUpdateTerm}
        onDeleteTerm={handleDeleteTerm}
      />
    </div>
  );
};

export default TermsTab;