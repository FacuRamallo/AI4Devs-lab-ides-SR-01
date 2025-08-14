# GitHub Copilot Instructions

## Project Overview
This project is a full-stack application designed to track talent management. It consists of a React-based frontend and an Express backend written in TypeScript. Prisma is used as the ORM for database interactions, and Docker is used to manage the PostgreSQL database.

## Folder Structure
- `backend/`: Contains the server-side code written in TypeScript.
  - `src/`: Source code for the backend.
  - `prisma/`: Prisma schema for ORM.
  - `tsconfig.json`: TypeScript configuration file.
- `frontend/`: Contains the client-side code written in React.
  - `src/`: Source code for the frontend.
  - `public/`: Static assets like HTML and images.
  - `build/`: Production-ready build of the frontend.
- `docker-compose.yml`: Configuration for Docker Compose to manage services.
- `.env`: Environment variables for the project.

## Code Generation Guidelines
1. **TypeScript Best Practices**:
   - Use strict typing for all variables, functions, and return types.
   - Prefer `interface` over `type` for defining object shapes.
   - Avoid using `any` type; use specific types or `unknown` when necessary.
   - Follow camelCase for variables and PascalCase for classes and interfaces.
   - Use utility types like `Partial`, `Pick`, and `Omit` when applicable.

2. **Testing with Jest**:
   - Use Jest as the testing library for both frontend and backend.
   - Write isolated and maintainable test cases.
   - Mock external dependencies to ensure tests are independent.
   - Use descriptive test names and organize tests in the `tests/` folder.
   - Ensure 100% test coverage for critical components and functions.

## Terminal Command Execution
- Always check the current directory before executing terminal commands.
- Use relative paths to ensure commands are executed in the correct context.
- For example, when running commands for the backend, ensure you are in the `backend/` directory, and for the frontend, ensure you are in the `frontend/` directory.