# Mini Banking Platform

A **double-entry banking system** with **USD & EUR wallets**, built for the **48-hour assessment**.  
Uses **NestJS + TypeORM + PostgreSQL** on the backend, **Next.js** (planned) on the frontend.

---

## Status: **Scaffold Complete**

| Milestone                     | Status   |
|-------------------------------|----------|
| NestJS server (`/api`)        | Done     |
| Swagger UI (`/api/docs`)      | Done     |
| Folder & file structure       | Done     |
| `.env`, `.gitignore`, README  | Done     |
| Git initialized & first commit| Done     |
| `AuthModule` (in progress)    | Done     |
| Double-entry ledger           | In Progress   |
| Transfer & Exchange           | Not Started   |
| Frontend (Next.js)            | Not Started   |

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Backend     | **NestJS** (v10)                        |
| Database    | **PostgreSQL** + **TypeORM**            |
| Auth        | **JWT** + `bcrypt`                      |
| Validation  | `class-validator` + `zod`               |
| API Docs    | **Swagger/OpenAPI**                     |
| Rate Limit  | `@nestjs/throttler`                     |
| Config      | `@nestjs/config` (`.env`)               |
| Frontend    | **Next.js 14+** (planned)               |

---

## Project Structure
