import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getParents,
  createParent,
  updateParent,
  deleteParent,
  toggleParentStatus,
} from "../parentsApi";

// Mock fetch globally
global.fetch = vi.fn();

describe("Parents API", () => {
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

  describe("getParents", () => {
    it("should fetch parents successfully", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
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

      const result = await getParents(1, 10);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/parents?page=1&pageSize=10",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer mock-token",
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Internal server error" }),
      });

      await expect(getParents()).rejects.toThrow("Internal server error");
    });
  });

  describe("createParent", () => {
    it("should create a parent successfully", async () => {
      const parentData = {
        name: "John Doe",
        parentType: "Father" as const,
        phoneNumber: "+254700222333",
        email: "john@example.com",
        schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
      };

      const mockResponse = {
        success: true,
        data: {
          id: "new-parent-id",
          ...parentData,
          status: "Active",
          isActive: true,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            name: "Test School",
            customerId: 1,
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createParent(parentData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/parents",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(parentData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateParent", () => {
    it("should update a parent successfully", async () => {
      const parentId = "parent-id";
      const updateData = {
        name: "Updated Name",
        phoneNumber: "+254700333444",
        status: "Active",
        isActive: true,
      };

      const mockResponse = {
        success: true,
        data: {
          id: parentId,
          ...updateData,
          parentType: "Mother",
          email: "updated@example.com",
          schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            name: "Test School",
            customerId: 1,
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updateParent(parentId, updateData);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/parents/${parentId}`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updateData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteParent", () => {
    it("should delete a parent successfully", async () => {
      const parentId = "parent-id";

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteParent(parentId);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/parents/${parentId}`,
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("toggleParentStatus", () => {
    it("should toggle parent status successfully", async () => {
      const parentId = "parent-id";
      const isActive = false;

      const mockResponse = {
        success: true,
        data: {
          id: parentId,
          name: "Test Parent",
          parentType: "Mother",
          phoneNumber: "+254700111222",
          email: "test@example.com",
          schoolId: "567431ac-cab3-41e5-b0ca-ee4de0953661",
          status: "Inactive",
          isActive: false,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "567431ac-cab3-41e5-b0ca-ee4de0953661",
            name: "Test School",
            customerId: 1,
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await toggleParentStatus(parentId, isActive);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/parents/${parentId}`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            isActive: false,
            status: "Inactive",
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
