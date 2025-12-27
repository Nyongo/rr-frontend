# Authentication Integration

This document describes the authentication system integration with the RocketRoll UI application.

## API Endpoint

- **URL**: `http://localhost:3000/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Request Format

```json
{
  "email": "njugunad85@gmail.com",
  "password": "lt06l9pd"
}
```

## Response Format

```json
{
  "response": {
    "code": 200,
    "message": "Succesfully logged in"
  },
  "data": {
    "id": 8,
    "email": "njugunad85@gmail.com",
    "name": "Njuguna Nyongo",
    "role": {
      "id": 2,
      "name": "Customer",
      "createdAt": "2025-09-12T21:28:18.134Z",
      "createdById": null,
      "isActive": false,
      "lastUpdatedAt": null,
      "lastUpdatedById": null,
      "permissions": []
    },
    "sspUser": null,
    "farmerUser": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Implementation Details

### Files Created/Modified

1. **`src/services/authApi.ts`** - Authentication API service
2. **`src/contexts/AuthContext.tsx`** - Authentication context provider
3. **`src/pages/authentication/SignIn.tsx`** - Updated login form
4. **`src/App.tsx`** - Updated routing and protection
5. **`src/components/AppSidebar.tsx`** - Updated sidebar with user info
6. **`src/components/LogoutButton.tsx`** - Logout component

### Key Features

1. **JWT Token Management**: Automatic token validation and storage
2. **Role-Based Access Control**: Different UI based on user roles (Admin, Customer, School)
3. **Persistent Authentication**: User stays logged in across browser sessions
4. **Automatic Logout**: Token expiration handling
5. **Loading States**: Proper loading indicators during authentication

### User Roles and Access

| Role     | Access Level                          | Default Redirect         |
| -------- | ------------------------------------- | ------------------------ |
| Admin    | Full admin access                     | `/admin/SystemTelemetry` |
| Customer | Limited admin access (Customers only) | `/admin/Customers`       |
| School   | School management access              | `/dashboard`             |

### Authentication Flow

1. **Login**: User enters credentials → API call → Store token & user data → Redirect based on role
2. **Token Validation**: Check token validity on app start → Auto-logout if expired
3. **Logout**: Clear stored data → Redirect to login page
4. **Route Protection**: Check authentication status → Redirect to appropriate page

### Security Features

- **JWT Token Validation**: Automatic token expiration checking
- **Secure Storage**: User data stored in localStorage with proper validation
- **Role-Based Routing**: Different access levels based on user role
- **Automatic Cleanup**: Invalid tokens are automatically cleared

## Usage

### Login Process

1. Navigate to the login page (`/`)
2. Enter email and password
3. Click "Sign In" button
4. System will:
   - Validate credentials with API
   - Store user data and token
   - Redirect to appropriate dashboard based on role

### Logout Process

1. Click on user profile in sidebar
2. Select "Logout" from dropdown
3. System will:
   - Clear stored authentication data
   - Redirect to login page
   - Show success message

### Token Management

- Tokens are automatically validated on app start
- Expired tokens trigger automatic logout
- New tokens are stored on successful login
- All tokens are cleared on logout

## Error Handling

- **Invalid Credentials**: Shows error message with retry option
- **Network Errors**: Displays user-friendly error messages
- **Token Expiration**: Automatic logout with redirect to login
- **API Errors**: Proper error messages with fallback options

## Testing

Run the authentication tests:

```bash
npm test src/services/__tests__/authApi.test.ts
```

## Future Enhancements

- Add password reset functionality
- Implement refresh token mechanism
- Add two-factor authentication
- Add session timeout warnings
- Implement remember me functionality

