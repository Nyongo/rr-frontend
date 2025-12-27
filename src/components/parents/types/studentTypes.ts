// Student types for API integration
export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  status: string;
  isActive: boolean;
  specialNeeds: string[];
  medicalInfo: string;
  schoolId: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  school: {
    id: string;
    name: string;
    customerId: number;
  };
  parent: {
    id: string;
    name: string;
    parentType: string;
    phoneNumber: string;
    email?: string;
  };
  // Legacy fields for backward compatibility
  photo?: string;
  schoolName?: string;
  medicalInformation?: string;
  fingerprint?: string;
}

export interface StudentFormData {
  name: string;
  admissionNumber: string;
  dateOfBirth: Date | null;
  gender: "Male" | "Female";
  specialNeeds: string[];
  medicalInfo: string;
  schoolId?: string;
  parentId?: string;
  status: "Active" | "Inactive";
  // Legacy fields for backward compatibility
  schoolName?: string;
  medicalInformation?: string;
}

export interface CreateStudentRequest {
  name: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  status?: string;
  isActive?: boolean;
  specialNeeds: string[];
  medicalInfo: string;
  schoolId: string;
  parentId: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  status?: string;
  isActive?: boolean;
}
