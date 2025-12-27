import { useEffect, useState, useCallback } from "react";
import {
  getStudents,
  getStudentsByParentId,
  getStudentsBySchoolId,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentStatus,
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
} from "@/services/studentsApi";
import { toast } from "@/hooks/use-toast";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (
    page: number = 1,
    pageSize: number = 100,
    search?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents(page, pageSize, search);
      setStudents(response.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch students";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByParent = useCallback(
    async (parentId: string, page: number = 1, pageSize: number = 100) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentsByParentId(parentId, page, pageSize);
        setStudents(response.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch students";
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchStudentsBySchool = useCallback(
    async (
      schoolId: string,
      page: number = 1,
      pageSize: number = 100,
      search?: string
    ) => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentsBySchoolId(
          schoolId,
          page,
          pageSize,
          search
        );
        setStudents(response.data);
        return response.data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch students by school";
        setError(message);
        toast({ title: "Error", description: message, variant: "destructive" });
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addStudent = async (data: CreateStudentRequest) => {
    try {
      const response = await createStudent(data);
      setStudents((prev) => [...prev, response.data]);
      toast({
        title: "Student Added!",
        description: `${data.name} has been added.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add student";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const updateStudentData = async (
    studentId: string,
    data: UpdateStudentRequest
  ) => {
    try {
      const response = await updateStudent(studentId, data);
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? response.data : s))
      );
      toast({
        title: "Student Updated!",
        description: `${data.name || "Student"} has been updated.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update student";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const removeStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast({
        title: "Student Deleted!",
        description: `The student has been removed.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete student";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  const toggleStatus = async (studentId: string, isActive: boolean) => {
    try {
      const response = await toggleStudentStatus(studentId, isActive);
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? response.data : s))
      );
      toast({
        title: "Student Status Updated!",
        description: `Student has been ${
          isActive ? "activated" : "deactivated"
        }.`,
      });
      return response.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update student status";
      toast({ title: "Error", description: message, variant: "destructive" });
      throw err;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    fetchStudentsByParent,
    fetchStudentsBySchool,
    addStudent,
    updateStudent: updateStudentData,
    deleteStudent: removeStudent,
    toggleStudentStatus: toggleStatus,
    refetch: () => fetchStudents(),
  };
};
