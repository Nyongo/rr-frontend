import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Radio, Check, X, AlertCircle } from "lucide-react";
import { getStudentByRFIDTag } from "@/services/rfidApi";
import { updateStudent } from "@/services/studentsApi";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/services/studentsApi";

interface AssignRFIDTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess?: () => void;
}

// Mock RFID tags for testing
const generateMockRFIDTag = (): string => {
  const prefix = "RFID";
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                 String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                 String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${random}-${suffix}`;
};

const AssignRFIDTagDialog = ({
  open,
  onOpenChange,
  student,
  onSuccess,
}: AssignRFIDTagDialogProps) => {
  const [rfidTagId, setRfidTagId] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [tagStatus, setTagStatus] = useState<"available" | "taken" | "invalid" | null>(null);
  const [existingStudent, setExistingStudent] = useState<{ name: string; admissionNumber: string } | null>(null);

  useEffect(() => {
    if (open && student) {
      // Pre-fill with existing RFID tag if student has one
      setRfidTagId(student.rfidTagId || "");
      setTagStatus(null);
      setExistingStudent(null);
    } else if (!open) {
      // Reset on close
      setRfidTagId("");
      setTagStatus(null);
      setExistingStudent(null);
    }
  }, [open, student]);

  const checkRFIDTag = async () => {
    if (!rfidTagId.trim()) {
      setTagStatus("invalid");
      return;
    }

    setIsChecking(true);
    setTagStatus(null);
    setExistingStudent(null);

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock: Check if tag is already assigned
      // In production, this would call the actual API
      const mockAssignedTags: Record<string, { name: string; admissionNumber: string }> = {
        "RFID-123456-ABC": { name: "John Doe", admissionNumber: "STUD001" },
        "RFID-789012-DEF": { name: "Jane Smith", admissionNumber: "STUD002" },
      };

      if (mockAssignedTags[rfidTagId.toUpperCase()]) {
        const assigned = mockAssignedTags[rfidTagId.toUpperCase()];
        // If it's assigned to the same student, it's available for update
        if (student && assigned.admissionNumber === student.admissionNumber) {
          setTagStatus("available");
        } else {
          setTagStatus("taken");
          setExistingStudent(assigned);
        }
      } else {
        setTagStatus("available");
      }
    } catch (error) {
      console.error("Error checking RFID tag:", error);
      setTagStatus("invalid");
      toast({
        title: "Error",
        description: "Failed to check RFID tag availability",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleAssign = async () => {
    if (!student || !rfidTagId.trim() || tagStatus !== "available") {
      return;
    }

    setIsAssigning(true);

    try {
      // Update student with RFID tag via the student update API
      const updateResponse = await updateStudent(student.id, {
        rfidTagId: rfidTagId.trim(),
      });

      if (updateResponse.success) {
        toast({
          title: "Success",
          description: `RFID tag ${rfidTagId.trim()} has been ${student.rfidTagId ? 'updated' : 'assigned'} to ${student.name}`,
        });

        onSuccess?.();
        onOpenChange(false);
      } else {
        throw new Error("Failed to assign RFID tag");
      }
    } catch (error) {
      console.error("Error assigning RFID tag:", error);
      toast({
        title: "Error",
        description: "Failed to assign RFID tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleGenerateTag = () => {
    const newTag = generateMockRFIDTag();
    setRfidTagId(newTag);
    setTagStatus(null);
    setExistingStudent(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Radio className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span>Assign RFID Tag</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            {student ? (
              <>
                Assign an RFID tag to <strong>{student.name}</strong> ({student.admissionNumber})
              </>
            ) : (
              "Select a student to assign an RFID tag"
            )}
          </DialogDescription>
        </DialogHeader>

        {student && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rfidTag">RFID Tag ID</Label>
              <div className="flex gap-2">
                <Input
                  id="rfidTag"
                  placeholder="Enter RFID tag ID (e.g., RFID-123456-ABC)"
                  value={rfidTagId}
                  onChange={(e) => {
                    setRfidTagId(e.target.value);
                    setTagStatus(null);
                    setExistingStudent(null);
                  }}
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateTag}
                  title="Generate mock RFID tag"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Scan the RFID tag or enter the tag ID manually
              </p>
            </div>

            {rfidTagId && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={checkRFIDTag}
                  disabled={isChecking}
                  className="flex-1"
                >
                  {isChecking ? "Checking..." : "Check Availability"}
                </Button>
              </div>
            )}

            {/* Tag Status Display */}
            {tagStatus && (
              <div
                className={`p-3 rounded-lg border ${
                  tagStatus === "available"
                    ? "bg-green-50 border-green-200"
                    : tagStatus === "taken"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {tagStatus === "available" && (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Tag Available
                        </p>
                        <p className="text-xs text-green-600">
                          This RFID tag is available for assignment
                        </p>
                      </div>
                    </>
                  )}
                  {tagStatus === "taken" && existingStudent && (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">
                          Tag Already Assigned
                        </p>
                        <p className="text-xs text-red-600">
                          This tag is assigned to{" "}
                          <strong>{existingStudent.name}</strong> (
                          {existingStudent.admissionNumber})
                        </p>
                      </div>
                    </>
                  )}
                  {tagStatus === "invalid" && (
                    <>
                      <X className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Invalid Tag ID
                        </p>
                        <p className="text-xs text-yellow-600">
                          Please enter a valid RFID tag ID
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Current Tag Display */}
            {student.rfidTagId && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Current RFID Tag:</p>
                <Badge variant="outline" className="font-mono">
                  {student.rfidTagId}
                </Badge>
                {student.rfidTagAssignedAt && (
                  <p className="text-xs text-blue-600 mt-1">
                    Assigned: {new Date(student.rfidTagAssignedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {student && (
            <Button
              onClick={handleAssign}
              disabled={!rfidTagId.trim() || tagStatus !== "available" || isAssigning}
            >
              {isAssigning ? "Assigning..." : student.rfidTagId ? "Update Tag" : "Assign Tag"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRFIDTagDialog;

