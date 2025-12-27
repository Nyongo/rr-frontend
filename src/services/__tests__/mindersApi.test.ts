import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMinders,
  createMinder,
  updateMinder,
  deleteMinder,
  toggleMinderStatus,
} from "../mindersApi";

// Mock fetch globally
global.fetch = vi.fn();

describe("Minders API", () => {
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

  describe("getMinders", () => {
    it("should fetch minders successfully", async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: "da300640-97be-4fe2-944c-55c6a39c9080",
            name: "Grace Minder",
            phoneNumber: "+254700111222",
            schoolId: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
            photo: null,
            pin: "9353",
            status: "Active",
            isActive: true,
            createdAt: "2025-10-06T15:37:19.497Z",
            updatedAt: "2025-10-06T15:37:19.497Z",
            createdById: null,
            lastUpdatedById: null,
            school: {
              id: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
              name: "Justino Academy",
              customerId: 2,
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

      const result = await getMinders(1, 10);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/minders?page=1&pageSize=10",
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

      await expect(getMinders()).rejects.toThrow("Internal server error");
    });
  });

  describe("createMinder", () => {
    it("should create a minder successfully", async () => {
      const minderData = {
        name: "John Doe",
        phoneNumber: "+254700111222",
        schoolId: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
        status: "Active",
        isActive: true,
        pin: "1234",
      };

      const mockResponse = {
        success: true,
        data: {
          id: "new-minder-id",
          ...minderData,
          photo: null,
          status: "Active",
          isActive: true,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
            name: "Test School",
            customerId: 1,
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await createMinder(minderData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/minders",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(minderData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateMinder", () => {
    it("should update a minder successfully", async () => {
      const minderId = "minder-id";
      const updateData = {
        name: "Updated Name",
        phoneNumber: "+254700222333",
        status: "Active",
        isActive: true,
      };

      const mockResponse = {
        success: true,
        data: {
          id: minderId,
          ...updateData,
          schoolId: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
          photo: null,
          pin: "1234",
          status: "Active",
          isActive: true,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
            name: "Test School",
            customerId: 1,
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updateMinder(minderId, updateData);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/minders/${minderId}`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updateData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deleteMinder", () => {
    it("should delete a minder successfully", async () => {
      const minderId = "minder-id";

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteMinder(minderId);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/minders/${minderId}`,
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("toggleMinderStatus", () => {
    it("should toggle minder status successfully", async () => {
      const minderId = "minder-id";
      const isActive = false;

      const mockResponse = {
        success: true,
        data: {
          id: minderId,
          name: "Test Minder",
          phoneNumber: "+254700111222",
          schoolId: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
          photo: null,
          pin: "1234",
          status: "Inactive",
          isActive: false,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          lastUpdatedById: null,
          school: {
            id: "95c63f56-f21e-4f84-96ed-1a7ed7c347d8",
            name: "Test School",
            customerId: 1,
          },
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await toggleMinderStatus(minderId, isActive);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3000/academic-suite/minders/${minderId}`,
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
