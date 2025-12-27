import {
  createSchool,
  getSchools,
  updateSchool,
  deleteSchool,
} from "../schoolApi";

// Mock fetch globally
global.fetch = jest.fn();

describe("School API", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe("createSchool", () => {
    it("should create a school successfully", async () => {
      const mockResponse = {
        success: true,
        data: {
          id: "test-id-123",
          name: "Test School",
          schoolId: "SCH-1234567890",
          email: "info@test.com",
          phoneNumber: "+1234567890",
          address: "123 Test St",
          postalAddress: null,
          county: null,
          region: null,
          schoolType: null,
          status: "Active",
          principalName: "John Doe",
          principalPhone: "+1234567890",
          principalEmail: "john@test.com",
          totalStudents: null,
          totalTeachers: null,
          registrationNumber: null,
          establishmentDate: null,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          lastUpdatedAt: "2024-01-01T00:00:00Z",
          createdById: null,
          lastUpdatedById: null,
          locationPin: null,
          sslId: null,
          customerId: 1,
          logo: null,
          latitude: "0",
          longitude: "0",
          url: "test.rocketroll.solutions",
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });

      const schoolData = {
        name: "Test School",
        customerId: 1,
        url: "test.rocketroll.solutions",
        address: "123 Test St",
        longitude: "0",
        latitude: "0",
        principalName: "John Doe",
        principalEmail: "john@test.com",
        principalPhone: "+1234567890",
        phoneNumber: "+1234567890",
        email: "info@test.com",
        isActive: true,
      };

      const result = await createSchool(schoolData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/schools",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const mockErrorResponse = {
        success: false,
        message: "Validation error",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve(mockErrorResponse),
      });

      const schoolData = {
        name: "Test School",
        customerId: 1,
        url: "test.rocketroll.solutions",
        address: "123 Test St",
        longitude: "0",
        latitude: "0",
        principalName: "John Doe",
        principalEmail: "john@test.com",
        principalPhone: "+1234567890",
        phoneNumber: "+1234567890",
        email: "info@test.com",
        isActive: true,
      };

      await expect(createSchool(schoolData)).rejects.toThrow(
        "Validation error"
      );
    });
  });

  describe("getSchools", () => {
    it("should fetch schools successfully", async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 1,
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getSchools();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/academic-suite/schools?page=1&pageSize=10"
      );

      expect(result).toEqual(mockResponse);
    });
  });
});
