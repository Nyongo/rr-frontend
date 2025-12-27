import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getStudents,
  getStudentsByParentId,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentStatus,
} from "../studentsApi";

// Mock fetch globally
global.fetch = vi.fn();

describe("Students API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "mock-token"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  describe("getStudents", () => {
    it("should fetch students successfully", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: "d51d5920-9229-41b9-882f-5b0029649490",
            name: "Student One",
            admissionNumber: "STU2024001",
            dateOfBirth: "2012-05-10",
            gender: "Male",
            status: "Active",
            isActive: true,
            specialNeeds: ["ADHD"],
            medicalInfo: "None",
            schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            parentId: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
            createdAt: "2025-10-06T16:51:02.007Z",
            updatedAt: "2025-10-06T16:51:02.007Z",
            createdById: null,
            lastUpdatedById: null,
            school: {
              id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
              name: "Thawabu",
              customerId: 1,
            },
            parent: {
              id: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
              name: "Jane Doe",
              parentType: "Mother",
              phoneNumber: "+254700222333",
              email: "jane@example.com",
              schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
              status: "Active",
              isActive: true,
              createdAt: "2025-10-06T16:19:01.217Z",
              updatedAt: "2025-10-06T16:19:01.217Z",
              createdById: null,
              lastUpdatedById: null,
              school: {
                id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
                name: "Thawabu",
                customerId: 1,
              },
            },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 1,
          totalPages: 1,
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getStudents();
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/students?page=1&pageSize=10",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token",
          }),
        })
      );
    });

    it("should handle API errors", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal server error" }),
      });

      await expect(getStudents()).rejects.toThrow("Internal server error");
    });
  });

  describe("createStudent", () => {
    it("should create a student successfully", async () => {
      const studentData = {
        name: "Student One",
        admissionNumber: "STU2024001",
        dateOfBirth: "2012-05-10",
        gender: "Male" as const,
        status: "Active",
        isActive: true,
        specialNeeds: ["ADHD"],
        medicalInfo: "None",
        schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
        parentId: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
      };

      const mockResponse = {
        success: true,
        data: {
          id: "new-student-id",
          ...studentData,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            name: "Thawabu",
            customerId: 1,
          },
          parent: {
            id: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
            name: "Jane Doe",
            parentType: "Mother",
            phoneNumber: "+254700222333",
            email: "jane@example.com",
            schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            status: "Active",
            isActive: true,
            createdAt: "2025-10-06T16:19:01.217Z",
            updatedAt: "2025-10-06T16:19:01.217Z",
            createdById: null,
            lastUpdatedById: null,
            school: {
              id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
              name: "Thawabu",
              customerId: 1,
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createStudent(studentData);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/students",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(studentData),
        })
      );
    });
  });

  describe("updateStudent", () => {
    it("should update a student successfully", async () => {
      const studentId = "student-id";
      const updateData = {
        name: "Updated Student Name",
        specialNeeds: ["ADHD", "Learning Disability"],
        status: "Active",
        isActive: true,
      };

      const mockResponse = {
        success: true,
        data: {
          id: studentId,
          ...updateData,
          admissionNumber: "STU2024001",
          dateOfBirth: "2012-05-10",
          gender: "Male" as const,
          medicalInfo: "None",
          schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
          parentId: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            name: "Thawabu",
            customerId: 1,
          },
          parent: {
            id: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
            name: "Jane Doe",
            parentType: "Mother",
            phoneNumber: "+254700222333",
            email: "jane@example.com",
            schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            status: "Active",
            isActive: true,
            createdAt: "2025-10-06T16:19:01.217Z",
            updatedAt: "2025-10-06T16:19:01.217Z",
            createdById: null,
            lastUpdatedById: null,
            school: {
              id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
              name: "Thawabu",
              customerId: 1,
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updateStudent(studentId, updateData);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/students/${studentId}`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updateData),
        })
      );
    });
  });

  describe("deleteStudent", () => {
    it("should delete a student successfully", async () => {
      const studentId = "student-id";

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204, // No Content
        json: async () => ({}),
      });

      await deleteStudent(studentId);
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/students/${studentId}`,
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("toggleStudentStatus", () => {
    it("should toggle student status successfully", async () => {
      const studentId = "student-id";
      const isActive = false;

      const mockResponse = {
        success: true,
        data: {
          id: studentId,
          name: "Test Student",
          admissionNumber: "STU2024001",
          dateOfBirth: "2012-05-10",
          gender: "Male" as const,
          status: "Inactive",
          isActive: false,
          specialNeeds: ["ADHD"],
          medicalInfo: "None",
          schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
          parentId: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            name: "Thawabu",
            customerId: 1,
          },
          parent: {
            id: "b0e52e90-70b0-4607-ac8c-9c2630af58af",
            name: "Jane Doe",
            parentType: "Mother",
            phoneNumber: "+254700222333",
            email: "jane@example.com",
            schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            status: "Active",
            isActive: true,
            createdAt: "2025-10-06T16:19:01.217Z",
            updatedAt: "2025-10-06T16:19:01.217Z",
            createdById: null,
            lastUpdatedById: null,
            school: {
              id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
              name: "Thawabu",
              customerId: 1,
            },
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await toggleStudentStatus(studentId, isActive);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/students/${studentId}`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            isActive: false,
            status: "Inactive",
          }),
        })
      );
    });
  });
});
