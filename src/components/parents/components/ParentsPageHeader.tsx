import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { ParentImportDialog } from "./ParentImportDialog";

interface ParentsPageHeaderProps {
  onAddParent: () => void;
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
  onImportSuccess?: () => void;
}

export const ParentsPageHeader = ({
  onAddParent,
  isImportDialogOpen,
  setIsImportDialogOpen,
  onImportSuccess,
}: ParentsPageHeaderProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            Parents & Students
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage parents and their associated students
          </p>
        </div>
      </div>

      {/* Import Dialog */}
      <ParentImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImportSuccess={onImportSuccess}
      />
    </>
  );
};
