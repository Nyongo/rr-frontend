# Customer API Integration

This document describes the integration of the customer creation API with the RocketRoll UI application.

## API Endpoints

### Create Customer

- **URL**: `http://localhost:3000/academic-suite/customers`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### List Customers

- **URL**: `http://localhost:3000/academic-suite/customers`
- **Method**: `GET`
- **Content-Type**: `application/json`

### Update Customer

- **URL**: `http://localhost:3000/academic-suite/customers/{id}`
- **Method**: `PUT`
- **Content-Type**: `multipart/form-data`

## Request Format

The API expects the following form fields:

| Field             | Type   | Required | Description                      |
| ----------------- | ------ | -------- | -------------------------------- |
| `companyName`     | string | Yes      | Name of the company/school group |
| `contactPerson`   | string | Yes      | Name of the contact person       |
| `phoneNumber`     | string | Yes      | Phone number with country code   |
| `emailAddress`    | string | Yes      | Email address                    |
| `numberOfSchools` | number | Yes      | Number of schools in the group   |
| `status`          | string | Yes      | Status: "ACTIVE" or "INACTIVE"   |
| `companyLogo`     | File   | No       | Company logo image file          |

## Response Formats

### Create Customer Response

```json
{
  "success": true,
  "data": {
    "id": 2,
    "companyLogo": "/uploads/jf/customer-logos/customer_logo_Alliance_High_School_Group_1757700281248.png",
    "companyName": "Alliance High School Group",
    "contactPerson": "Njuguna Nyongo",
    "phoneNumber": "+254703568132",
    "emailAddress": "njugush85@gmail.com",
    "numberOfSchools": 4,
    "status": "ACTIVE",
    "userId": 2,
    "createdAt": "2025-09-12T18:04:41.349Z",
    "updatedAt": "2025-09-12T18:04:41.349Z"
  },
  "message": "Customer created successfully"
}
```

### List Customers Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 2,
      "companyLogo": null,
      "companyName": "Alliance High School Group",
      "contactPerson": "Njuguna Nyongo",
      "phoneNumber": "+254703568132",
      "emailAddress": "njugush85@gmail.com",
      "numberOfSchools": 4,
      "status": "ACTIVE",
      "userId": 2,
      "createdAt": "2025-09-12T18:04:41.349Z",
      "updatedAt": "2025-09-12T18:04:41.349Z"
    },
    {
      "id": 1,
      "companyLogo": "",
      "companyName": "Alliance High School Group",
      "contactPerson": "Njuguna Nyongo",
      "phoneNumber": "+254703568132",
      "emailAddress": "njugush@gmail.com",
      "numberOfSchools": 0,
      "status": "ACTIVE",
      "userId": 1,
      "createdAt": "2025-09-12T17:37:13.897Z",
      "updatedAt": "2025-09-12T17:37:13.897Z"
    }
  ]
}
```

### Update Customer Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "companyLogo": "/uploads/jf/customer-logos/customer_logo_Alliance_Group_1757700281248.png",
    "companyName": "Alliance Group",
    "contactPerson": "Njuguna Nyongo",
    "phoneNumber": "+254703568132",
    "emailAddress": "njugunad85@gmail.com",
    "numberOfSchools": 4,
    "status": "ACTIVE",
    "userId": 1,
    "createdAt": "2025-09-12T18:04:41.349Z",
    "updatedAt": "2025-09-12T18:04:41.349Z"
  },
  "message": "Customer updated successfully"
}
```

## Implementation Details

### Files Modified

1. **`src/services/customerApi.ts`** - API service file with create, list, and update functions
2. **`src/components/customers/types/index.ts`** - Updated type definitions
3. **`src/components/customers/forms/CustomerForm.tsx`** - Updated form fields
4. **`src/components/customers/hooks/useCustomersData.ts`** - Integrated API calls with count tracking and update functionality
5. **`src/pages/admin/Customers.tsx`** - Updated form handling
6. **`src/components/customers/table-configs/customerColumns.tsx`** - Updated table columns
7. **`src/components/customers/components/CustomersPageHeader.tsx`** - Added customer count display

### Key Changes

1. **Field Name Updates**: Updated all field names to match the API specification:

   - `name` → `companyName`
   - `phone` → `phoneNumber`
   - `email` → `emailAddress`
   - `schoolsCount` → `numberOfSchools`
   - `logo` → `companyLogo`
   - `status` values: `"active"/"inactive"` → `"ACTIVE"/"INACTIVE"`

2. **File Upload Support**: Added proper file upload handling for company logos

3. **Error Handling**: Implemented proper error handling with user-friendly toast notifications

4. **Type Safety**: Updated TypeScript interfaces to match API response structure
5. **Customer Count Display**: Added total customer count display in the page header
6. **List Customers API**: Integrated GET endpoint to fetch all customers with proper response handling
7. **Update Customer API**: Integrated PUT endpoint to update existing customers with file upload support

## Usage

### Creating a Customer

1. Navigate to the Customers page in the admin section
2. Click "Add Customer" button
3. Fill in the form with the required information
4. Optionally upload a company logo
5. Click "Add Customer" to submit

### Updating a Customer

1. Navigate to the Customers page in the admin section
2. Click the edit button (pencil icon) next to the customer you want to update
3. Modify the form fields as needed
4. Optionally upload a new company logo
5. Click "Update Customer" to submit

The form will automatically handle file uploads and API communication. Success and error messages will be displayed via toast notifications.

## Testing

Run the test suite to verify the API integration:

```bash
npm test src/services/__tests__/customerApi.test.ts
```

## Error Handling

The integration includes comprehensive error handling:

- Network errors are caught and displayed to the user
- API validation errors are shown with specific error messages
- Fallback to mock data if the API is unavailable
- Form validation ensures required fields are filled

## Future Enhancements

- Add support for customer updates via API
- Implement customer deletion via API
- Add pagination for large customer lists
- Add search and filtering capabilities
