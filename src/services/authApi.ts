const API_BASE_URL = "http://localhost:3000";

export interface User {
  id: number;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
    createdAt: string;
    createdById: number | null;
    isActive: boolean;
    lastUpdatedAt: string | null;
    lastUpdatedById: number | null;
    permissions: any[];
  };
  sspUser: any | null;
  farmerUser: any | null;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  response: {
    code: number;
    message: string;
  };
  data: User;
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getStoredAuthData = (): User | null => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return null;
  }
};

export const storeAuthData = (userData: User): void => {
  try {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  } catch (error) {
    console.error("Error storing auth data:", error);
  }
};

export const isTokenValid = (): boolean => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp > currentTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

