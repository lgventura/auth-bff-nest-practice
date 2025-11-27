# Auth BFF - Authentication Backend For Frontend

## About the Project

A simple and practical **Backend For Frontend (BFF)** implementation focused on authentication flows, built to practice and demonstrate **NestJS** framework capabilities. This project provides a complete authentication system with JWT tokens, user profile management, and role-based access control.

The BFF pattern creates a specific backend service optimized for frontend applications, handling authentication, authorization, and data aggregation efficiently.

## Project Overview

This is a learning-focused project that implements:

- **JWT-based authentication** with token generation and validation
- **User profile management** with CRUD operations
- **Role-based access control** (admin/user permissions)
- **Modular architecture** following NestJS best practices
- **Local JSON storage** for simplicity (easily replaceable with database)

Perfect for developers learning NestJS or exploring BFF architecture patterns.

## Technologies

| Technology               | Purpose                                               |
| ------------------------ | ----------------------------------------------------- |
| **NestJS**               | Progressive Node.js framework with TypeScript support |
| **TypeScript**           | Type-safe code and better developer experience        |
| **JWT (JSON Web Token)** | Stateless authentication mechanism                    |
| **Passport**             | Authentication middleware for Node.js                 |
| **bcrypt**               | Secure password hashing                               |
| **class-validator**      | DTO validation with decorators                        |
| **class-transformer**    | Object transformation and serialization               |

## Features

### Authentication Module

- User login with credentials validation
- JWT token generation with configurable expiration
- Token validation endpoint
- Protected routes with authentication guards
- Health check endpoint

### Profile Module

- View authenticated user profile
- Detailed profile information with timestamps
- Update user profile data
- List all users (admin only)
- Role-based access control

## How It Works

### Architecture

The project follows a **modular architecture** with clear separation of concerns:

\`\`\`
Application Entry (main.ts)
↓
App Module
↓
├── Auth Module (Authentication & Authorization)
│ ├── Login & Token Generation
│ ├── Token Validation
│ └── JWT Strategy & Guards
│
└── Profile Module (User Management)
├── Profile CRUD Operations
├── Admin-only Features
└── User Data Management
\`\`\`

### Authentication Flow

1. **User Login**: Client sends credentials (username/password)
2. **Validation**: System validates credentials against stored users
3. **Token Generation**: If valid, JWT token is generated with user data
4. **Token Storage**: Client stores token (localStorage, cookies, etc.)
5. **Protected Requests**: Client includes token in Authorization header
6. **Token Verification**: Guards validate token on protected routes
7. **Access Granted**: User data is extracted from token and passed to route handler

### Data Storage

Users are stored in a JSON file (\`src/data/users.json\`) with the following structure:

\`\`\`json
{
"id": "1",
"username": "admin",
"password": "$2b$10$...",
"email": "admin@example.com",
"role": "admin"
}
\`\`\`

Passwords are hashed using bcrypt for security.

## Project Structure

\`\`\`
auth-bff/
├── src/
│ ├── modules/
│ │ ├── auth/ # Authentication Module
│ │ │ ├── dto/ # Data Transfer Objects
│ │ │ ├── guards/ # Authentication Guards
│ │ │ ├── strategies/ # Passport Strategies
│ │ │ ├── interfaces/ # TypeScript Interfaces
│ │ │ ├── auth.controller.ts # Route Handlers
│ │ │ ├── auth.service.ts # Business Logic
│ │ │ └── auth.module.ts # Module Configuration
│ │ │
│ │ └── profile/ # Profile Management Module
│ │ ├── dto/ # Data Transfer Objects
│ │ ├── interfaces/ # TypeScript Interfaces
│ │ ├── profile.controller.ts # Route Handlers
│ │ ├── profile.service.ts # Business Logic
│ │ └── profile.module.ts # Module Configuration
│ │
│ ├── data/
│ │ └── users.json # User Database (JSON)
│ ├── app.module.ts # Root Module
│ └── main.ts # Application Entry Point
│
├── scripts/
│ └── generate-hash.js # Password Hash Generator
├── .env # Environment Variables
├── nest-cli.json # NestJS CLI Configuration
├── tsconfig.json # TypeScript Configuration
└── package.json # Dependencies & Scripts
\`\`\`

## Available Routes

### Authentication Routes

| Method | Endpoint           | Description                     | Auth Required |
| ------ | ------------------ | ------------------------------- | ------------- |
| POST   | \`/auth/login\`    | User login and token generation | No            |
| POST   | \`/auth/validate\` | Validate JWT token              | No            |
| GET    | \`/auth/me\`       | Get authenticated user info     | Yes           |
| GET    | \`/auth/health\`   | Service health check            | No            |

### Profile Routes

| Method | Endpoint              | Description                          | Auth Required | Admin Only |
| ------ | --------------------- | ------------------------------------ | ------------- | ---------- |
| GET    | \`/profile\`          | Get user profile                     | Yes           | No         |
| GET    | \`/profile/detailed\` | Get detailed profile with timestamps | Yes           | No         |
| PUT    | \`/profile\`          | Update user profile                  | Yes           | No         |
| GET    | \`/profile/all\`      | List all users                       | Yes           | Yes        |

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to project directory**:
   \`\`\`bash
   cd auth-bff
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables**:

   Edit the \`.env\` file:
   \`\`\`env
   PORT=3000
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_EXPIRES_IN=1h
   \`\`\`

### Running the Application

**Development mode**:
\`\`\`bash
npm run start:dev
\`\`\`

**Production mode**:
\`\`\`bash
npm run build
npm run start:prod
\`\`\`

Application will be available at: \`http://localhost:3000\`

## Test Users

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | admin |
| user     | user123  | user  |

## API Usage Examples

### 1. Login

\`\`\`bash
curl -X POST http://localhost:3000/auth/login \\
-H "Content-Type: application/json" \\
-d '{"username":"admin","password":"admin123"}'
\`\`\`

**Response**:
\`\`\`json
{
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"token_type": "Bearer",
"expires_in": "1h",
"user": {
"id": "1",
"username": "admin",
"email": "admin@example.com",
"role": "admin"
}
}
\`\`\`

### 2. Get Profile

\`\`\`bash
curl -X GET http://localhost:3000/profile \\
-H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

**Response**:
\`\`\`json
{
"id": "1",
"username": "admin",
"email": "admin@example.com",
"role": "admin"
}
\`\`\`

### 3. Update Profile

\`\`\`bash
curl -X PUT http://localhost:3000/profile \\
-H "Authorization: Bearer YOUR_TOKEN" \\
-H "Content-Type: application/json" \\
-d '{"email":"newemail@example.com"}'
\`\`\`

### 4. List All Users (Admin Only)

\`\`\`bash
curl -X GET http://localhost:3000/profile/all \\
-H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens with configurable expiration
- Input validation on all endpoints
- Role-based access control (RBAC)
- Authentication guards on protected routes
- CORS enabled for frontend integration

## Project Scripts

\`\`\`bash
npm run start # Start application
npm run start:dev # Start in development mode with hot-reload
npm run start:prod # Start in production mode
npm run build # Build the project
npm run generate-hash # Generate bcrypt hash for new passwords
\`\`\`

## Learning Outcomes

This project demonstrates:

- NestJS module organization and dependency injection
- JWT authentication implementation with Passport
- Creating custom guards and strategies
- DTO validation with class-validator
- TypeScript interfaces and type safety
- RESTful API design principles
- Role-based authorization patterns
- Environment configuration management

## Next Steps

Potential improvements for learning:

- [ ] Add refresh token mechanism
- [ ] Implement rate limiting
- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] Create unit and e2e tests
- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Create Docker configuration
- [ ] Add logging with Winston/Pino
- [ ] Implement token blacklist

## License

MIT

---

**Built with NestJS for learning and practice purposes**
