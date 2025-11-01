# Mini Banking Platform

A **double-entry banking system** with **USD & EUR wallets**, built for the **48-hour assessment**.  
Uses **NestJS + TypeORM + PostgreSQL** on the backend.

---

## Status: **Authentication & Routing Stable**

| Milestone                     | Status   |
|-------------------------------|----------|
| NestJS server (`/api`)        | Done     |
| Swagger UI (`/api/docs`)      | Done     |
| Folder & file structure       | Done     |
| `.env`, `.gitignore`, README  | Done     |
| Git initialized & pushed      | Done     |
| `AuthModule` with JWT login   | Done     |
| `AccountsModule` with balances| Done     |
| **404 routing issues fixed**  | Done     |
| Double-entry ledger           | Done     |
| Transfer & Exchange           | Done     |
| Debugging                     | In Progress   |
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

---

## Project Structure
