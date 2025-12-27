import {
  login,
  logout,
  getStoredAuthData,
  storeAuthData,
  isTokenValid,
} from "../authApi";

// Mock fetch
global.fetch = jest.fn();

describe("Auth API", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorage.clear();
  });

  it("should login successfully", async () => {
    const mockResponse = {
      response: {
        code: 200,
        message: "Succesfully logged in",
      },
      data: {
        id: 8,
        email: "njugunad85@gmail.com",
        name: "Njuguna Nyongo",
        role: {
          id: 2,
          name: "Customer",
          createdAt: "2025-09-12T21:28:18.134Z",
          createdById: null,
          isActive: false,
          lastUpdatedAt: null,
          lastUpdatedById: null,
          permissions: [],
        },
        sspUser: null,
        farmerUser: null,
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5qdWd1bmFkODVAZ21haWwuY29tIiwic3ViIjo4LCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiQ3VzdG9tZXIiLCJjcmVhdGVkQXQiOiIyMDI1LTA5LTEyVDIxOjI4OjE4LjEzNFoiLCJjcmVhdGVkQnlJZCI6bnVsbCwiaXNBY3RpdmUiOmZhbHNlLCJsYXN0VXBkYXRlZEF0IjpudWxsLCJsYXN0VXBkYXRlZEJ5SWQiOm51bGwsInBlcm1pc3Npb25zIjpbXX0sImlhdCI6MTc1NzcwNDIwMCwiZXhwIjoxNzU3NzA3ODAwfQ.gvtCLbC1Uf-7uME8opmqJNnqNgjWZ3vfIevsuN70QXI",
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const credentials = {
      email: "njugunad85@gmail.com",
      password: "lt06l9pd",
    };

    const result = await login(credentials);

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    expect(result).toEqual(mockResponse);
  });

  it("should handle login errors", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: "Invalid credentials" }),
    });

    const credentials = {
      email: "wrong@email.com",
      password: "wrongpassword",
    };

    await expect(login(credentials)).rejects.toThrow("Invalid credentials");
  });

  it("should store and retrieve auth data", () => {
    const userData = {
      id: 8,
      email: "njugunad85@gmail.com",
      name: "Njuguna Nyongo",
      role: {
        id: 2,
        name: "Customer",
        createdAt: "2025-09-12T21:28:18.134Z",
        createdById: null,
        isActive: false,
        lastUpdatedAt: null,
        lastUpdatedById: null,
        permissions: [],
      },
      sspUser: null,
      farmerUser: null,
      token: "test-token",
    };

    storeAuthData(userData);

    expect(getStoredAuthData()).toEqual(userData);
    expect(localStorage.getItem("token")).toBe("test-token");
  });

  it("should clear auth data on logout", () => {
    const userData = {
      id: 8,
      email: "njugunad85@gmail.com",
      name: "Njuguna Nyongo",
      role: {
        id: 2,
        name: "Customer",
        createdAt: "2025-09-12T21:28:18.134Z",
        createdById: null,
        isActive: false,
        lastUpdatedAt: null,
        lastUpdatedById: null,
        permissions: [],
      },
      sspUser: null,
      farmerUser: null,
      token: "test-token",
    };

    storeAuthData(userData);
    logout();

    expect(getStoredAuthData()).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should validate token correctly", () => {
    // Test with valid token (expires in future)
    const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const validToken = `header.${btoa(
      JSON.stringify({ exp: futureTime })
    )}.signature`;

    localStorage.setItem("token", validToken);
    expect(isTokenValid()).toBe(true);

    // Test with expired token
    const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const expiredToken = `header.${btoa(
      JSON.stringify({ exp: pastTime })
    )}.signature`;

    localStorage.setItem("token", expiredToken);
    expect(isTokenValid()).toBe(false);

    // Test with no token
    localStorage.removeItem("token");
    expect(isTokenValid()).toBe(false);
  });
});

