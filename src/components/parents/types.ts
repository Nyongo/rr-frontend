export interface Parent {
  id: string;
  name: string;
  parentType: "Mother" | "Father" | "Guardian";
  phoneNumber: string;
  email?: string;
  schoolId: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  school: {
    id: string;
    name: string;
    customerId: number;
  };
  // Legacy fields for backward compatibility
  phone?: string;
  studentsCount?: number;
  lastLogin?: string;
}

export interface ParentFormItem {
  name: string;
  parentType: "Mother" | "Father" | "Guardian";
  phoneNumber: string;
  email?: string;
  schoolId?: string;
  status: string;
  // Legacy field for backward compatibility
  phone?: string;
}
