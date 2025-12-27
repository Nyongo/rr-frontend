import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StudentDeleteWarningDialogProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const StudentDeleteWarningDialog = ({
  isOpen,
  studentName,
  onConfirm,
  onCancel,
}: StudentDeleteWarningDialogProps) => {
  React.useEffect(() => {
    console.log("StudentDeleteWarningDialog rendered, isOpen:", isOpen);
  }, [isOpen]);

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        console.log("Delete dialog open state changing to:", open);
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove Student from Route
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{studentName}</strong> from this route?
            <br /><br />
            <span className="text-red-600 font-medium">
              ⚠️ Warning: This student will be completely removed from this route and will need to be added again if needed in the future.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudentDeleteWarningDialog;