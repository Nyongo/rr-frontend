const API_BASE_URL = "http://localhost:3000/academic-suite";

export interface CreateSchoolRequest {
  name: string;
  customerId: number;
  url: string;
  address: string;
  longitude: string;
  latitude: string;
  principalName: string;
  principalEmail: string;
  principalPhone: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  logo?: File;
}

export interface CreateSchoolResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    schoolId: string;
    email: string | null;
    phoneNumber: string | null;
    address: string | null;
    postalAddress: string | null;
    county: string | null;
    region: string | null;
    schoolType: string | null;
    status: string;
    principalName: string | null;
    principalPhone: string | null;
    principalEmail: string | null;
    totalStudents: number | null;
    totalTeachers: number | null;
    registrationNumber: string | null;
    establishmentDate: string | null;
    isActive: boolean;
    createdAt: string;
    lastUpdatedAt: string;
    createdById: string | null;
    lastUpdatedById: string | null;
    locationPin: string | null;
    sslId: string | null;
    customerId: number;
    logo: string | null;
    latitude: string | null;
    longitude: string | null;
    url: string | null;
  };
}

export interface School {
  id: string;
  name: string;
  schoolId: string;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  postalAddress: string | null;
  county: string | null;
  region: string | null;
  schoolType: string | null;
  status: string;
  principalName: string | null;
  principalPhone: string | null;
  principalEmail: string | null;
  totalStudents: number | null;
  totalTeachers: number | null;
  registrationNumber: string | null;
  establishmentDate: string | null;
  isActive: boolean;
  createdAt: string;
  lastUpdatedAt: string;
  createdById: string | null;
  lastUpdatedById: string | null;
  locationPin: string | null;
  sslId: string | null;
  customerId: number;
  logo: string | null;
  latitude: string | null;
  longitude: string | null;
  url: string | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetSchoolsResponse {
  success: boolean;
  data: School[];
  pagination: Pagination;
}

export const createSchool = async (
  schoolData: CreateSchoolRequest
): Promise<CreateSchoolResponse> => {
  const formData = new FormData();

  // Add all form fields
  formData.append("name", schoolData.name);
  formData.append("customerId", schoolData.customerId.toString());
  formData.append("url", schoolData.url);
  formData.append("address", schoolData.address);
  formData.append("longitude", schoolData.longitude);
  formData.append("latitude", schoolData.latitude);
  formData.append("principalName", schoolData.principalName);
  formData.append("principalEmail", schoolData.principalEmail);
  formData.append("principalPhone", schoolData.principalPhone);
  formData.append("phoneNumber", schoolData.phoneNumber);
  formData.append("email", schoolData.email);
  formData.append("isActive", schoolData.isActive ? "true" : "false");

  // Add logo file if provided
  if (schoolData.logo) {
    formData.append("logo", schoolData.logo);
  }

  const response = await fetch(`${API_BASE_URL}/schools`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const getSchools = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<GetSchoolsResponse> => {
  const searchParam =
    search && search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
  const response = await fetch(
    `${API_BASE_URL}/schools?page=${page}&pageSize=${pageSize}${searchParam}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const updateSchool = async (
  schoolId: string,
  schoolData: CreateSchoolRequest
): Promise<CreateSchoolResponse> => {
  const formData = new FormData();

  // Add form fields
  formData.append("name", schoolData.name);
  formData.append("customerId", schoolData.customerId.toString());
  formData.append("url", schoolData.url);
  formData.append("address", schoolData.address);
  formData.append("longitude", schoolData.longitude);
  formData.append("latitude", schoolData.latitude);
  formData.append("principalName", schoolData.principalName);
  formData.append("principalEmail", schoolData.principalEmail);
  formData.append("principalPhone", schoolData.principalPhone);
  formData.append("phoneNumber", schoolData.phoneNumber);
  formData.append("email", schoolData.email);
  formData.append("isActive", schoolData.isActive ? "true" : "false");

  // Add logo file if provided
  if (schoolData.logo) {
    formData.append("logo", schoolData.logo);
  }

  const response = await fetch(`${API_BASE_URL}/schools/${schoolId}`, {
    method: "PUT",
    body: formData,
  });

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export const deleteSchool = async (schoolId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/schools/${schoolId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }
};
