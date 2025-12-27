
import { useState } from "react";
import { User, UserFormItem } from "../types";
import { initialUsersData } from "../data/usersData";
import { toast } from "@/hooks/use-toast";

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>(initialUsersData);

  const addUser = (newItem: UserFormItem) => {
    const newUser: User = {
      id: users.length + 1,
      fullName: newItem.fullName,
      email: newItem.email,
      phone: newItem.phone,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      schoolName: newItem.schoolName,
      role: newItem.role,
      status: newItem.status,
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (editingItem: User, newItem: UserFormItem) => {
    const updatedUsers = users.map(user => 
      user.id === editingItem.id
        ? {
            ...user,
            fullName: newItem.fullName,
            email: newItem.email,
            phone: newItem.phone,
            schoolName: newItem.schoolName,
            role: newItem.role,
            status: newItem.status,
            pin: user.pin,
          }
        : user
    );
    setUsers(updatedUsers);
  };

  const deleteUser = (item: User) => {
    const updatedUsers = users.filter(user => user.id !== item.id);
    setUsers(updatedUsers);
    toast({
      title: "User Deleted!",
      description: "Successfully removed from the system.",
    });
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  };
};
