
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

interface StudentHideWarningDialogProps {
  isOpen: boolean;
  studentName: string;
  isHiding: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const StudentHideWarningDialog = ({
  isOpen,
  studentName,
  isHiding,
  onConfirm,
  onCancel,
}: StudentHideWarningDialogProps) => {
  React.useEffect(() => {
    console.log("StudentHideWarningDialog rendered, isOpen:", isOpen);
  }, [isOpen]);

  return (
    <AlertDialog 
      open={isOpen} 
      onOpenChange={(open) => {
        console.log("Dialog open state changing to:", open);
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isHiding ? "Hide Student from Route" : "Show Student on Route"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isHiding ? (
              <>
                Are you sure you want to hide <strong>{studentName}</strong> from this route?
                <br /><br />
                <span className="text-amber-600 font-medium">
                  ⚠️ Warning: This student will not be available for pickup or drop-off on upcoming trips.
                </span>
              </>
            ) : (
              <>
                Are you sure you want to show <strong>{studentName}</strong> on this route?
                <br /><br />
                This student will be available for pickup or drop-off on upcoming trips.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }} 
            className={isHiding ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {isHiding ? "Proceed" : "Proceed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudentHideWarningDialog;
