
import { User } from "../types";

export const initialUsersData: User[] = [
  {
    id: 1,
    fullName: "John Kamau",
    email: "john.kamau@starehe.ac.ke",
    phone: "+254 722 123 456",
    pin: "1234",
    schoolName: "Starehe Boys Centre",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    fullName: "Mary Wanjiku",
    email: "mary.wanjiku@alliance.ac.ke",
    phone: "+254 733 987 654",
    pin: "5678",
    schoolName: "Alliance High School",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    fullName: "Peter Ochieng",
    email: "peter.ochieng@kenya.ac.ke",
    phone: "+254 711 456 789",
    pin: "9012",
    schoolName: "Kenya High School",
    role: "Admin",
    status: "Inactive",
  },
];
