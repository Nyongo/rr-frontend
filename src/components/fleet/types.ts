export interface Bus {
  id: string;
  registrationNumber: string;
  schoolId: string;
  make: string;
  model: string;
  seatsCapacity: number;
  type: string;
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
  busNumber?: string;
  licensePlate?: string;
  schoolName?: string;
  driver?: string;
  minder?: string;
}

export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  schoolId: string;
  photo: string | null;
  pin: string;
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
  fullName?: string;
  licenseNumber?: string;
  phone?: string;
  schoolName?: string;
}

export interface Minder {
  id: string;
  name: string;
  phoneNumber: string;
  schoolId: string;
  photo: string | null;
  pin: string;
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
  fullName?: string;
  phone?: string;
  schoolName?: string;
}

export interface FormItem {
  registrationNumber: string;
  schoolName: string;
  schoolId?: string;
  make: string;
  model: string;
  seatsCapacity: string;
  type: string;
  status: string;
  name: string;
  phone: string;
  photo?: string;
  pin?: string;
}
