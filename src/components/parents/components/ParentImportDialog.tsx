import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, X, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSchools } from "@/hooks/useSchools";
import { createParent, CreateParentRequest } from "@/services/parentsApi";
import { formatPhoneNumberForAPI } from "@/lib/utils";

interface ParentImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

interface CSVRow {
  name: string;
  parentType: string;
  email?: string;
  phone: string;
  schoolName: string;
  status: string;
}

interface ImportError {
  row: number;
  message: string;
}

export const ParentImportDialog = ({
  isOpen,
  onClose,
  onImportSuccess,
}: ParentImportDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { schools } = useSchools();

  const handleDownloadTemplate = () => {
    const content = `Name,Parent Type,Email,Phone,School Name,Status
John Doe,Father,john.doe@email.com,+254 712 345 678,Example School,Active
Jane Smith,Mother,jane.smith@email.com,+254 723 456 789,Example School,Active
Robert Johnson,Guardian,,+254 734 567 890,Example School,Active`;

    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parent_import_template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Template Downloaded!",
      description: "Parent CSV template has been downloaded.",
    });
  };

  // Simple CSV parser that handles quoted fields
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    // Add the last field
    result.push(current.trim());
    return result;
  };

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    if (lines.length < 2) {
      throw new Error(
        "CSV file must have at least a header row and one data row"
      );
    }

    const headers = parseCSVLine(lines[0]);
    const requiredHeaders = [
      "Name",
      "Parent Type",
      "Phone",
      "School Name",
      "Status",
    ];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`);
    }

    const nameIndex = headers.indexOf("Name");
    const parentTypeIndex = headers.indexOf("Parent Type");
    const emailIndex = headers.indexOf("Email");
    const phoneIndex = headers.indexOf("Phone");
    const schoolNameIndex = headers.indexOf("School Name");
    const statusIndex = headers.indexOf("Status");

    const rows: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length < headers.length) {
        continue; // Skip incomplete rows
      }
      rows.push({
        name: values[nameIndex] || "",
        parentType: values[parentTypeIndex] || "",
        email: emailIndex >= 0 ? values[emailIndex] || undefined : undefined,
        phone: values[phoneIndex] || "",
        schoolName: values[schoolNameIndex] || "",
        status: values[statusIndex] || "",
      });
    }

    return rows;
  };

  const validateRow = (row: CSVRow, rowNumber: number): ImportError[] => {
    const errors: ImportError[] = [];

    if (!row.name || row.name.trim() === "") {
      errors.push({ row: rowNumber, message: "Name is required" });
    }

    if (
      !row.parentType ||
      !["Mother", "Father", "Guardian"].includes(row.parentType)
    ) {
      errors.push({
        row: rowNumber,
        message: "Parent Type must be Mother, Father, or Guardian",
      });
    }

    if (!row.phone || row.phone.trim() === "") {
      errors.push({ row: rowNumber, message: "Phone number is required" });
    }

    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ row: rowNumber, message: "Invalid email format" });
    }

    if (!row.schoolName || row.schoolName.trim() === "") {
      errors.push({ row: rowNumber, message: "School Name is required" });
    }

    if (!row.status || !["Active", "Inactive"].includes(row.status)) {
      errors.push({
        row: rowNumber,
        message: "Status must be Active or Inactive",
      });
    }

    return errors;
  };

  const findSchoolIdByName = (schoolName: string): string | null => {
    const school = schools.find(
      (s) => s.name.toLowerCase() === schoolName.toLowerCase()
    );
    return school?.id || null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setImportErrors([]);
      setImportSuccess(false);
      setImportedCount(0);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      setImportErrors([]);
      setImportSuccess(false);
      setImportedCount(0);
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportErrors([]);
    setImportSuccess(false);
    setImportedCount(0);

    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        throw new Error("No data rows found in CSV file");
      }

      // Validate all rows
      const allErrors: ImportError[] = [];
      rows.forEach((row, index) => {
        const errors = validateRow(row, index + 2); // +2 because row 1 is header, index is 0-based
        allErrors.push(...errors);
      });

      if (allErrors.length > 0) {
        setImportErrors(allErrors);
        toast({
          title: "Validation Errors",
          description: `Found ${allErrors.length} error(s) in the CSV file. Please review and fix them.`,
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }

      // Import parents
      let successCount = 0;
      const importErrors: ImportError[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const schoolId = findSchoolIdByName(row.schoolName);

        if (!schoolId) {
          importErrors.push({
            row: i + 2,
            message: `School "${row.schoolName}" not found`,
          });
          continue;
        }

        try {
          const parentData: CreateParentRequest = {
            name: row.name.trim(),
            parentType: row.parentType as "Mother" | "Father" | "Guardian",
            phoneNumber: formatPhoneNumberForAPI(row.phone),
            email: row.email?.trim() || undefined,
            schoolId: schoolId,
            status: row.status,
            isActive: row.status === "Active",
          };

          await createParent(parentData);
          successCount++;
        } catch (error) {
          importErrors.push({
            row: i + 2,
            message:
              error instanceof Error
                ? error.message
                : "Failed to import parent",
          });
        }
      }

      setImportedCount(successCount);
      setImportErrors(importErrors);

      if (successCount > 0) {
        setImportSuccess(true);
        toast({
          title: "Import Completed!",
          description: `Successfully imported ${successCount} parent(s).${
            importErrors.length > 0
              ? ` ${importErrors.length} error(s) occurred.`
              : ""
          }`,
          variant: importErrors.length > 0 ? "default" : "default",
        });
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        toast({
          title: "Import Failed",
          description:
            "No parents were imported. Please check the errors and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description:
          error instanceof Error ? error.message : "Failed to import parents",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportErrors([]);
    setImportSuccess(false);
    setImportedCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Parent Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing parent information. All required fields
            must be included.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
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

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <p className="text-gray-700 font-medium">{selectedFile.name}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove File
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose File
                </Button>
              </>
            )}
          </div>

          {/* CSV Format Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">
              CSV should include the following columns:
            </p>
            <p>
              Name, Parent Type (Mother/Father/Guardian), Email (optional),
              Phone, School Name, Status (Active/Inactive)
            </p>
          </div>

          {/* Import Errors */}
          {importErrors.length > 0 && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-800">
                  {importErrors.length} Error(s) Found
                </h4>
              </div>
              <ul className="space-y-1 text-sm text-red-700">
                {importErrors.map((error, index) => (
                  <li key={index}>
                    Row {error.row}: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Import Success */}
          {importSuccess && importedCount > 0 && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">
                  Successfully imported {importedCount} parent(s)!
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isImporting}
            >
              {importSuccess ? "Close" : "Cancel"}
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
