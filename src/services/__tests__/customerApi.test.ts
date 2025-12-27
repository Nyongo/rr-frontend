import { createCustomer, getCustomers, updateCustomer } from "../customerApi";

// Mock fetch
global.fetch = jest.fn();

describe("Customer API", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("should create a customer successfully", async () => {
    const mockResponse = {
      success: true,
      data: {
        id: 2,
        companyLogo:
          "/uploads/jf/customer-logos/customer_logo_Alliance_High_School_Group_1757700281248.png",
        companyName: "Alliance High School Group",
        contactPerson: "Njuguna Nyongo",
        phoneNumber: "+254703568132",
        emailAddress: "njugush85@gmail.com",
        numberOfSchools: 4,
        status: "ACTIVE",
        userId: 2,
        createdAt: "2025-09-12T18:04:41.349Z",
        updatedAt: "2025-09-12T18:04:41.349Z",
      },
      message: "Customer created successfully",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const customerData = {
      companyName: "Alliance High School Group",
      contactPerson: "Njuguna Nyongo",
      phoneNumber: "+254703568132",
      emailAddress: "njugush85@gmail.com",
      numberOfSchools: 4,
      status: "ACTIVE" as const,
    };

    const result = await createCustomer(customerData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/academic-suite/customers",
      {
        method: "POST",
        body: expect.any(FormData),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle API errors", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: "Validation error" }),
    });

    const customerData = {
      companyName: "",
      contactPerson: "Njuguna Nyongo",
      phoneNumber: "+254703568132",
      emailAddress: "njugush85@gmail.com",
      numberOfSchools: 4,
      status: "ACTIVE" as const,
    };

    await expect(createCustomer(customerData)).rejects.toThrow(
      "Validation error"
    );
  });

  it("should fetch customers successfully", async () => {
    const mockResponse = {
      success: true,
      count: 2,
      data: [
        {
          id: 2,
          companyLogo: null,
          companyName: "Alliance High School Group",
          contactPerson: "Njuguna Nyongo",
          phoneNumber: "+254703568132",
          emailAddress: "njugush85@gmail.com",
          numberOfSchools: 4,
          status: "ACTIVE",
          userId: 2,
          createdAt: "2025-09-12T18:04:41.349Z",
          updatedAt: "2025-09-12T18:04:41.349Z",
        },
        {
          id: 1,
          companyLogo: "",
          companyName: "Alliance High School Group",
          contactPerson: "Njuguna Nyongo",
          phoneNumber: "+254703568132",
          emailAddress: "njugush@gmail.com",
          numberOfSchools: 0,
          status: "ACTIVE",
          userId: 1,
          createdAt: "2025-09-12T17:37:13.897Z",
          updatedAt: "2025-09-12T17:37:13.897Z",
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getCustomers();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/academic-suite/customers"
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle fetch customers errors", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(getCustomers()).rejects.toThrow("HTTP error! status: 500");
  });

  it("should update a customer successfully", async () => {
    const mockResponse = {
      success: true,
      data: {
        id: 1,
        companyLogo:
          "/uploads/jf/customer-logos/customer_logo_Alliance_Group_1757700281248.png",
        companyName: "Alliance Group",
        contactPerson: "Njuguna Nyongo",
        phoneNumber: "+254703568132",
        emailAddress: "njugunad85@gmail.com",
        numberOfSchools: 4,
        status: "ACTIVE",
        userId: 1,
        createdAt: "2025-09-12T18:04:41.349Z",
        updatedAt: "2025-09-12T18:04:41.349Z",
      },
      message: "Customer updated successfully",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const customerData = {
      companyName: "Alliance Group",
      contactPerson: "Njuguna Nyongo",
      phoneNumber: "+254703568132",
      emailAddress: "njugunad85@gmail.com",
      numberOfSchools: 4,
      status: "ACTIVE" as const,
    };

    const result = await updateCustomer(1, customerData);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/academic-suite/customers/1",
      {
        method: "PUT",
        body: expect.any(FormData),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle update customer errors", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Customer not found" }),
    });

    const customerData = {
      companyName: "Alliance Group",
      contactPerson: "Njuguna Nyongo",
      phoneNumber: "+254703568132",
      emailAddress: "njugunad85@gmail.com",
      numberOfSchools: 4,
      status: "ACTIVE" as const,
    };

    await expect(updateCustomer(999, customerData)).rejects.toThrow(
      "Customer not found"
    );
  });
});
