
import { Button } from "@/components/ui/button";
import { Users, Plus, Import } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Upload, Download } from "lucide-react";

interface ParentsPageHeaderProps {
  onAddParent: () => void;
  isImportDialogOpen: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
  onImport: () => void;
}

export const ParentsPageHeader = ({ 
  onAddParent, 
  isImportDialogOpen, 
  setIsImportDialogOpen, 
  onImport 
}: ParentsPageHeaderProps) => {
  const handleDownloadTemplate = () => {
    // Generate parent CSV template content
    const content = 'Name,Parent Type,Email,Phone,Status\n';
    const filename = 'parent_template.csv';
    
    // Create and download the file
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Template Downloaded!",
      description: "Parent CSV template has been downloaded.",
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            Parents & Students
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage parents and their associated students</p>
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Parent Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file containing parent information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Need a template?</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop your CSV file here or click to browse</p>
              <Button variant="outline">Choose File</Button>
            </div>
            <div className="text-xs text-gray-500">
              <p>CSV should include: Name, Parent Type, Email, Phone, Status</p>
            </div>
            <Button onClick={onImport} className="w-full bg-gradient-to-r from-green-500 to-blue-600">
              Import Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
