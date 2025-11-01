# Mini Banking Platform

A **double-entry banking system** with **USD & EUR wallets**, built for the **48-hour assessment**.  
Uses **NestJS + TypeORM + PostgreSQL** on the backend.

---

## Status: **Core Banking Engine Complete**

| Milestone                     | Status   |
|-------------------------------|----------|
| NestJS server (`/api/v1`)     | Done     |
| Swagger UI (`/api/docs`)      | Done     |
| Folder & file structure       | Done     |
| `.env`, `.gitignore`, README  | Done     |
| Git initialized & pushed      | Done     |
| `AuthModule` with JWT login   | Done     |
| `AccountsModule` with balances| Done     |
| **404 routing issues fixed**  | Done     |
| Double-entry ledger           | Done     |
| Transfer (same currency)      | Done     |
| Frontend (Next.js)            | Done.    |

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Backend     | **NestJS** (v11)                        |
| Database    | **PostgreSQL** + **TypeORM**            |
| Auth        | **JWT** + `bcrypt`                      |
| Validation  | `class-validator` + `zod`               |
| API Docs    | **Swagger/OpenAPI**                     |
| Rate Limit  | `@nestjs/throttler`                     |
| Config      | `@nestjs/config` (`.env`)               |

---

## Project Structure
