import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  resetUserPassword,
  changeUserPassword,
  deleteAdminUser,
} from "../usersApi";

// Mock fetch
global.fetch = jest.fn();

describe("Admin Users API", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("should fetch admin users successfully", async () => {
    const mockResponse = {
      response: {
        code: 200,
        message: "Fetched Users",
      },
      data: {
        data: [
          {
            id: 1,
            email: "admin@gmail.com",
            name: "Admin User",
            isActive: true,
            lastLoggedInOn: null,
            createdAt: "2025-01-01T00:00:00.000Z",
            requirePasswordReset: false,
            roleId: 1,
            role: {
              id: 1,
              name: "Admin",
              createdAt: "2025-01-01T00:00:00.000Z",
              createdById: null,
              isActive: true,
              lastUpdatedAt: null,
              lastUpdatedById: null,
            },
            sspUser: null,
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          pageSize: 10,
        },
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getAdminUsers(1, 10, "test-token");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/users?page=1&pageSize=10",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle fetch admin users errors", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Unauthorized" }),
    });

    await expect(getAdminUsers(1, 10, "invalid-token")).rejects.toThrow(
      "Unauthorized"
    );
  });

  it("should create an admin user successfully", async () => {
    const mockResponse = {
      response: {
        code: 200,
        message: "User created successfully. Password sent via email.",
      },
      data: {
        id: 2,
        email: "newuser@example.com",
        name: "New User",
        isActive: true,
        lastLoggedInOn: null,
        createdAt: "2025-01-01T00:00:00.000Z",
        requirePasswordReset: true,
        roleId: 2,
        role: {
          id: 2,
          name: "Customer",
          createdAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          isActive: true,
          lastUpdatedAt: null,
          lastUpdatedById: null,
        },
        sspUser: null,
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const userData = {
      name: "New User",
      email: "newuser@example.com",
      roleId: 2,
      isActive: true,
    };

    const result = await createAdminUser(userData, "test-token");

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/users", {
      method: "POST",
      headers: {
        Authorization: "Bearer test-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    expect(result).toEqual(mockResponse);
  });

  it("should update an admin user successfully", async () => {
    const mockResponse = {
      response: {
        code: 200,
        message: "User updated successfully",
      },
      data: {
        id: 1,
        email: "updated@example.com",
        name: "Updated User",
        isActive: true,
        lastLoggedInOn: null,
        createdAt: "2025-01-01T00:00:00.000Z",
        requirePasswordReset: false,
        roleId: 1,
        role: {
          id: 1,
          name: "Admin",
          createdAt: "2025-01-01T00:00:00.000Z",
          createdById: null,
          isActive: true,
          lastUpdatedAt: null,
          lastUpdatedById: null,
        },
        sspUser: null,
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const userData = {
      name: "Updated User",
      roleId: 1,
      isActive: true,
    };

    const result = await updateAdminUser(1, userData, "test-token");

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/users/1", {
      method: "PUT",
      headers: {
        Authorization: "Bearer test-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    expect(result).toEqual(mockResponse);
  });

  it("should reset user password successfully", async () => {
    const mockResponse = {
      response: {
        code: 200,
        message: "Password reset successfully. Password sent via email.",
      },
      data: {
        id: 1,
        email: "user@example.com",
        name: "Test User",
        roleId: 2,
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await resetUserPassword(1, "test-token");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/users/reset-password",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: 1 }),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should change user password successfully", async () => {
    const mockResponse = {
      response: {
        code: 200,
        message: "Password Changed Successfully.",
      },
      data: null,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const passwordData = {
      id: 1,
      currentPassword: "oldPassword123",
      newPassword: "newPassword123",
      repeatNewPassword: "newPassword123",
    };

    const result = await changeUserPassword(passwordData, "test-token");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/users/change-password",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle change password API errors with proper message extraction", async () => {
    const errorResponse = {
      response: {
        code: 400,
        message: "Current Password Is Incorrect.",
      },
      data: null,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => errorResponse,
    });

    const passwordData = {
      id: 1,
      currentPassword: "wrongPassword",
      newPassword: "newPassword123",
      repeatNewPassword: "newPassword123",
    };

    await expect(
      changeUserPassword(passwordData, "test-token")
    ).rejects.toThrow("Current Password Is Incorrect.");
  });

  it("should delete an admin user successfully", async () => {
    const mockResponse = {
      success: true,
      message: "User deleted successfully",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await deleteAdminUser(1, "test-token");

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/users/1", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer test-token",
        "Content-Type": "application/json",
      },
    });

    expect(result).toEqual(mockResponse);
  });
});
