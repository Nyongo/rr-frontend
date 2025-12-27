export interface Customer {
  id: number;
  companyLogo?: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  numberOfSchools: number;
  isActive: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormItem {
  companyLogo?: File | null;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  numberOfSchools: number;
  isActive: boolean;
}
