const API_BASE_URL = "http://localhost:3000/academic-suite";

export interface CreateCustomerRequest {
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  emailAddress: string;
  numberOfSchools: number;
  isActive: boolean;
  companyLogo?: File;
}

export interface CreateCustomerResponse {
  success: boolean;
  data: {
    id: number;
    companyLogo: string;
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
    emailAddress: string;
    numberOfSchools: number;
    isActive: boolean;
    userId: number;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export const createCustomer = async (
  customerData: CreateCustomerRequest
): Promise<CreateCustomerResponse> => {
  const formData = new FormData();

  // Add all form fields
  formData.append("companyName", customerData.companyName);
  formData.append("contactPerson", customerData.contactPerson);
  formData.append("phoneNumber", customerData.phoneNumber);
  formData.append("emailAddress", customerData.emailAddress);
  formData.append("numberOfSchools", customerData.numberOfSchools.toString());
  formData.append("isActive", customerData.isActive.toString());

  // Add logo file if provided
  if (customerData.companyLogo) {
    formData.append("companyLogo", customerData.companyLogo);
  }

  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  // Check the response code instead of HTTP status
  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetCustomersResponse {
  success: boolean;
  count: number;
  data: CreateCustomerResponse["data"][];
  pagination: Pagination;
}

export const getCustomers = async (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<GetCustomersResponse> => {
  const searchParam =
    search && search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
  const response = await fetch(
    `${API_BASE_URL}/customers?page=${page}&pageSize=${pageSize}${searchParam}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const updateCustomer = async (
  customerId: number,
  customerData: CreateCustomerRequest
): Promise<CreateCustomerResponse> => {
  const formData = new FormData();

  // Add form fields (excluding emailAddress as it cannot be changed)
  formData.append("companyName", customerData.companyName);
  formData.append("contactPerson", customerData.contactPerson);
  formData.append("phoneNumber", customerData.phoneNumber);
  // Note: emailAddress is excluded from updates as it cannot be changed
  formData.append("numberOfSchools", customerData.numberOfSchools.toString());
  formData.append("isActive", customerData.isActive.toString());

  // Add logo file if provided
  if (customerData.companyLogo) {
    formData.append("companyLogo", customerData.companyLogo);
  }

  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: "PUT",
    body: formData,
  });

  const result = await response.json();

  // Check the response code instead of HTTP status
  if (result.response?.code && result.response.code !== 200) {
    const errorMessage = result.response.message || "API request failed";
    throw new Error(errorMessage);
  }

  return result;
};
