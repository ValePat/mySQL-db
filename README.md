# React Jobs Portal

A full-stack job management application built with React, Node.js, and MongoDB. The system features a microservices-inspired architecture with separate services for authentication and job management, all containerized with Docker.

## Project Structure

- **`ui/`**: Frontend application built with React, Vite, and Tailwind CSS.
- **`srv/`**: Backend source code containing:
  - **Auth Service**: Handles user registration, login, and token management.
  - **Jobs Service**: Manages job listings (CRUD operations).
- **`docker-compose.yml`**: Orchestrates the services, including an Nginx reverse proxy.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose.
- [Node.js](https://nodejs.org/) (for local development).
- [MongoDB](https://www.mongodb.com/) (Atlas or local instance).

## Getting Started

### 1. Environment Configuration

Create a `.env` file inside the `srv/` directory. You will need to define the following variables:

```env
PORT=3000
DB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

*Note: The `jobs-service` also reads from the same `.env` file in this setup.*

### 2. Running with Docker (Recommended)

From the root directory, run:

```bash
docker-compose up --build
```

The application will be available at `http://localhost`.

### 3. Local Development

If you wish to run the services manually:

**Backend:**
```bash
cd srv
npm install
node authSrv.js  # Starts Auth Service on port 3000
node jobsSrv.js  # Starts Jobs Service on port 8080
```

**Frontend:**
```bash
cd ui
npm install
npm run dev      # Starts Vite dev server
```

## JWT Authentication Logic

The system uses a robust authentication flow based on JSON Web Tokens (JWT) stored in **HttpOnly Cookies** for enhanced security.

### Token Types
1.  **Access Token**: A short-lived token (e.g., 15 minutes) used to authorize requests to protected routes.
2.  **Refresh Token**: A long-lived token used to obtain new access tokens when they expire.

### Authentication Flow
1.  **Login**: User submits credentials. The Auth Service verifies them against MongoDB (using `bcrypt` for password hashing).
2.  **Issuance**: Upon successful login, the server generates both an Access Token and a Refresh Token.
3.  **Storage**: Both tokens are sent to the client as `httpOnly`, `secure` cookies. This prevents XSS attacks from accessing the tokens.
4.  **Authorization**: For protected routes (like `addJob`), the `authenticateToken` middleware verifies the Access Token from the cookies.
5.  **Token Refresh**: 
    - The `authCheck` endpoint on the frontend checks if the user is still authenticated.
    - If the Access Token is expired but a valid Refresh Token exists, the server automatically issues a new Access Token.
6.  **Logout**: The Refresh Token is deleted from the database, and both cookies are cleared on the client side.

## Developer Guide

### Adding New Routes
- Define your route logic in `srv/src/routes/`.
- Register the route in `srv/src/app.js`.
- If the route requires authentication, use the `authenticateToken` middleware from `srv/src/services/authService.js`.

### Database Operations
- The application uses the official MongoDB driver.
- Connection logic is located in `srv/src/db/mongo-db.js`.
- Collections used: `users` (auth), `auth` (refresh tokens), and `jobs` (listings).

### Frontend Components
- Context API is used for global state management (`AuthContext`, `JobsContext`).
- `ProtectedRoute.jsx` is used to wrap routes that require the user to be logged in.
- Axios is configured to use `withCredentials: true` to ensure cookies are sent with every request.
