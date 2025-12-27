import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnhancedTable, Column } from "@/components/ui/enhanced-table";
import { Search, FileText, Edit, Trash2, Calendar, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TermForm, { TermData } from "./TermForm";

interface TermsTableProps {
  terms: TermData[];
  onAddTerm: (term: TermData) => void;
  onUpdateTerm: (term: TermData) => void;
  onDeleteTerm: (termId: number) => void;
}

const TermsTable = ({
  terms: initialTerms,
  onAddTerm,
  onUpdateTerm,
  onDeleteTerm,
}: TermsTableProps) => {
  const [terms, setTerms] = useState(initialTerms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<TermData | null>(null);
  // Dialog state removed
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleRowClick = (term: TermData) => {
    // Row click disabled
  };

  const handleAddTerm = () => {
    setSelectedTerm(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (term: TermData, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTerm(term);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleSaveTerm = (term: TermData) => {
    if (isEditMode) {
      setTerms(terms.map((t) => (t.id === term.id ? term : t)));
      onUpdateTerm(term);
    } else {
      setTerms([...terms, term]);
      onAddTerm(term);
    }
  };

  const handleDelete = (termId: number) => {
    setTerms(terms.filter((term) => term.id !== termId));
    onDeleteTerm(termId);
  };

  // Format date to display in a readable format
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter terms based on search term
  const filteredTerms = terms.filter(
    (term) => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        term.schoolName.toLowerCase().includes(searchLower) ||
        term.year.toLowerCase().includes(searchLower) ||
        term.term.toLowerCase().includes(searchLower) ||
        (term.startDate && formatDate(term.startDate).toLowerCase().includes(searchLower)) ||
        (term.endDate && formatDate(term.endDate).toLowerCase().includes(searchLower))
      );
    }
  );

  // Term table columns
  const termColumns: Column<any>[] = [
    {
      key: "schoolName",
      label: "School Name",
      sortable: true,
    },
    {
      key: "year",
      label: "Year",
      sortable: true,
    },
    {
      key: "term",
      label: "Term",
      sortable: true,
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "endDate",
      label: "End Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, term) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleEdit(term, e)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  // Prevent row click event from firing
                  e.nativeEvent.stopImmediatePropagation();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  term {term.schoolName} - {term.year} {term.term}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(term.id);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Academic Terms</h2>
          <p className="text-gray-600">Manage school terms and academic calendar</p>
        </div>
        
        <Button
          onClick={handleAddTerm}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      </div>
      
      <div className="relative w-full mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search terms by school, year, term, start date, or end date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Table */}
      {filteredTerms.length > 0 ? (
        <EnhancedTable
          data={filteredTerms}
          columns={termColumns}
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
            showPageSizeSelector: true,
          }}
        />
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No terms found
          </h3>
          <p className="text-gray-600">
            No matching terms found for your search criteria
          </p>
        </div>
      )}

      {/* Term Details Dialog removed */}

      {/* Add/Edit Term Form */}
      <TermForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTerm}
        existingTerm={isEditMode ? selectedTerm : null}
      />
    </div>
  );
};

export default TermsTable;
