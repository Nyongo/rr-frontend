
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  pin: string;
  schoolName: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}

export interface UserFormItem {
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}
