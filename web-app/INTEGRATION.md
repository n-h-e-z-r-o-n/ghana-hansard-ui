# Frontend-Backend Integration Guide

This document explains how the frontend and backend are connected and how to set up the complete system.

## 🔗 Integration Overview

The frontend (Next.js) and backend (Node.js/Express) are fully integrated with:

- **API Client**: TypeScript-based API client for all backend communication
- **Authentication**: Complete auth flow with JWT tokens
- **Error Handling**: Comprehensive error handling and user feedback
- **Type Safety**: Full TypeScript integration between frontend and backend
- **Real-time Updates**: Ready for WebSocket integration

## 🏗️ Architecture

```
Frontend (Next.js)          Backend (Node.js/Express)
┌─────────────────┐         ┌──────────────────────┐
│   AuthContext   │◄────────┤   AuthController     │
│                 │         │                      │
│   API Client    │◄────────┤   AuthService        │
│                 │         │                      │
│   Components    │◄────────┤   AuthMiddleware     │
│                 │         │                      │
│   Pages         │◄────────┤   AuthRoutes         │
└─────────────────┘         └──────────────────────┘
```

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### 2. Start the Frontend

```bash
# In the root directory
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Test the Integration

```bash
node test-integration.js
```

## 📁 File Structure

### Frontend Integration Files

```
app/
├── lib/
│   └── api.ts                 # API client for backend communication
├── config/
│   └── api.ts                 # API configuration and endpoints
├── contexts/
│   └── AuthContext.tsx        # Updated auth context with backend integration
├── components/
│   ├── LoginPage.tsx          # Updated login component
│   ├── SignUpPage.tsx         # Updated signup component
│   └── ForgotPasswordPage.tsx # Updated forgot password component
└── reset-password/
    └── page.tsx               # Password reset page
```

### Backend Files

```
backend/src/
├── auth/
│   ├── controllers/
│   │   └── authController.js  # Auth business logic
│   ├── routes/
│   │   └── authRoutes.js      # Auth API endpoints
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification & validation
│   ├── models/
│   │   └── userData.js        # Dummy user data storage
│   └── services/
│       └── authService.js     # Auth operations
├── app.js                     # Express app configuration
└── server.js                  # Main server entry point
```

## 🔐 Authentication Flow

### 1. User Registration

```typescript
// Frontend
const result = await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'citizen'
});

// Backend Response
{
  success: true,
  message: 'User registered successfully',
  data: {
    user: { id: 1, email: 'john@example.com', ... }
  }
}
```

### 2. User Login

```typescript
// Frontend
const result = await login('john@example.com', 'password123');

// Backend Response
{
  success: true,
  message: 'Login successful',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: { id: 1, email: 'john@example.com', role: 'citizen', ... }
  }
}
```

### 3. Password Reset

```typescript
// Frontend - Request Reset
const result = await forgotPassword('john@example.com');

// Frontend - Reset Password
const result = await resetPassword(token, 'newpassword123');
```

## 🛠️ API Client Usage

### Basic Usage

```typescript
import { apiClient } from '../lib/api';

// Login
const response = await apiClient.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const user = await apiClient.getCurrentUser();

// Logout
await apiClient.logout();
```

### Error Handling

```typescript
try {
  const result = await apiClient.login(credentials);
  if (result.success) {
    // Handle success
  } else {
    // Handle API error
    console.error(result.message);
  }
} catch (error) {
  // Handle network error
  console.error('Network error:', error.message);
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Ghana Parliamentary Hub
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### API Configuration

The API configuration is centralized in `app/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000
  }
};
```

## 🧪 Testing

### Test Credentials

The backend includes pre-configured test users:

- **Admin**: `admin@parliament.gh` / `admin123`
- **Member**: `member@parliament.gh` / `member123`
- **Citizen**: `citizen@example.com` / `citizen123`

### Integration Tests

Run the integration test script:

```bash
node test-integration.js
```

This will test:
- Backend health check
- Frontend health check
- Auth endpoints
- Login functionality
- CORS configuration

### Manual Testing

1. **Login Test**:
   - Go to `http://localhost:3000/login`
   - Use test credentials
   - Verify successful login and redirect

2. **Registration Test**:
   - Go to `http://localhost:3000/register`
   - Fill out the form
   - Verify successful registration and auto-login

3. **Password Reset Test**:
   - Go to `http://localhost:3000/forgot-password`
   - Enter email address
   - Check console for reset token (development mode)
   - Use token in reset password page

## 🔒 Security Features

### Frontend Security

- **JWT Token Storage**: Secure token storage in localStorage
- **Automatic Token Refresh**: Token refresh on API calls
- **Input Validation**: Client-side validation for all forms
- **Error Handling**: Secure error messages without sensitive data

### Backend Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: Protection against XSS and injection
- **CORS Configuration**: Proper cross-origin resource sharing

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   ```
   Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
   ```
   **Solution**: Ensure backend CORS is configured for frontend URL

2. **Connection Refused**:
   ```
   Error: connect ECONNREFUSED 127.0.0.1:5000
   ```
   **Solution**: Start the backend server with `npm run dev`

3. **Token Expired**:
   ```
   Error: Token expired
   ```
   **Solution**: The API client automatically handles token refresh

4. **Invalid Credentials**:
   ```
   Error: Invalid email or password
   ```
   **Solution**: Use the provided test credentials

### Debug Mode

Enable debug mode by setting environment variables:

```bash
NODE_ENV=development
DEBUG=true
```

This will show detailed error messages and API responses.

## 📊 Monitoring

### Health Checks

- **Backend**: `http://localhost:5000/health`
- **Frontend**: `http://localhost:3000`

### API Status

Check API status with:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Ghana Parliamentary Hub API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes**:
   - Modify backend code
   - Restart backend server
   - Test with integration script

2. **Frontend Changes**:
   - Modify frontend code
   - Hot reload will update automatically
   - Test in browser

3. **API Changes**:
   - Update backend API
   - Update frontend API client
   - Update TypeScript types
   - Test integration

### Adding New Endpoints

1. **Backend**:
   ```javascript
   // Add route in authRoutes.js
   router.get('/new-endpoint', authController.newEndpoint);
   ```

2. **Frontend**:
   ```typescript
   // Add method in api.ts
   async newEndpoint(): Promise<ApiResponse> {
     return this.request('/auth/new-endpoint');
   }
   ```

## 🚀 Production Deployment

### Environment Setup

1. **Backend**:
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   PORT=5000
   ```

2. **Frontend**:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   NODE_ENV=production
   ```

### Security Checklist

- [ ] Change default JWT secret
- [ ] Enable HTTPS
- [ ] Configure production CORS
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Set up monitoring
- [ ] Configure logging

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Run the integration test script
3. Check browser console for errors
4. Check backend logs
5. Verify environment variables

---

**Integration Status**: ✅ Complete and Tested

The frontend and backend are fully integrated and ready for development and testing.
