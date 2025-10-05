# Authentication Flow Test Guide

## Test Credentials

The following dummy credentials are available for testing:

### Admin User
- **Email:** admin@parliament.gh
- **Password:** admin123
- **Role:** admin
- **Access:** Full administrative access

### Parliament Member
- **Email:** member@parliament.gh
- **Password:** member123
- **Role:** member
- **Access:** Member-level access

### Citizen User
- **Email:** citizen@example.com
- **Password:** citizen123
- **Role:** citizen
- **Access:** Basic citizen access

### Test User
- **Email:** test@test.com
- **Password:** test123
- **Role:** citizen
- **Access:** Basic citizen access

## Testing Steps

1. **Login Test:**
   - Go to `/login` or `/auth`
   - Use any of the above credentials
   - Should successfully log in and redirect to `/dashboard`

2. **Registration Test:**
   - Go to `/register` or `/auth` (signup tab)
   - Use a new email (not in the existing list)
   - Should successfully register and auto-login

3. **Logout Test:**
   - After logging in, click logout
   - Should clear session and redirect to home page

4. **Forgot Password Test:**
   - Go to forgot password page
   - Enter any email
   - Should show success message

## Features Implemented

✅ **Login with dummy credentials**
✅ **Registration with validation**
✅ **Logout functionality**
✅ **Forgot password simulation**
✅ **User session management**
✅ **Role-based access control**
✅ **Token-based authentication**
✅ **Ghana flag color scheme**

## Notes

- All authentication is handled client-side with dummy data
- No real backend API calls are made
- Session data is stored in localStorage
- Users are automatically assigned "citizen" role on registration
- Password validation requires minimum 6 characters
