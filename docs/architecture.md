# EnterpriseERP architecture

This document describes the foundation that exists in the repository and the design that is planned for later phases. Planned sections are not implemented.

## Implemented: Clean Architecture layers

The backend is a modular monolith. One API process hosts the application. Modules will be added inside these projects later, not as separate deployable services.

| Project | Responsibility now | Depends on |
| --- | --- | --- |
| `EnterpriseERP.Domain` | Business entities, enums, and rules. Empty until the first domain model. | Nothing |
| `EnterpriseERP.Application` | Use cases, application interfaces, and DTOs. Empty until the first use case. | Domain |
| `EnterpriseERP.Infrastructure` | PostgreSQL, Identity, and other external services. References the EF Core 10 Npgsql provider. No `DbContext` and no service registrations yet. | Application and Domain |
| `EnterpriseERP.Api` | HTTP endpoints, OpenAPI, CORS, and composition. Hosts `GET /api/health`. | Application and Infrastructure |
| `EnterpriseERP.Tests` | xUnit tests. Covers the health endpoint through `WebApplicationFactory`. | Api |

Dependency direction:

```text
Api -> Application -> Domain
Api -> Infrastructure -> Application -> Domain
Api -> Infrastructure -> Domain
Tests -> Api
```

Domain does not reference Application, Infrastructure, or Api. Application does not reference Infrastructure or Api. There is no dependency-injection extension yet, because Infrastructure has no services to register. Controllers do not contain persistence code.

The health controller returns a fixed payload and does not open a database connection. The API can start while PostgreSQL is absent.

## Implemented: React-to-API communication

The Vite development server runs at `http://localhost:5173`. The React page calls `GET {VITE_API_BASE_URL}/api/health`. The development value is `http://localhost:5080`.

In the Development environment only, the API applies a CORS policy whose allowed origin is `http://localhost:5173`, from `appsettings.Development.json`. The policy uses explicit origins. It does not use `AllowAnyOrigin`.

Outside Development, that policy is not registered. HTTPS redirection is enabled outside Development. OpenAPI is mapped only in Development, at `/openapi/v1.json`.

`VITE_API_BASE_URL` is a public base address. Secrets do not belong in frontend environment variables. No production host is stored in the repository.

## Implemented: PostgreSQL preparation

`Npgsql.EntityFrameworkCore.PostgreSQL` 10.0.3 is referenced by Infrastructure. NuGet resolves it against Entity Framework Core 10.0.4 and Npgsql 10.0.3, so the provider matches EF Core 10. The package is not used at runtime yet.

Planned database name: `EnterpriseERPDb`.

Planned configuration key: `ConnectionStrings:EnterpriseERPDb`.

Required connection settings, supplied later through user secrets or the host environment:

| Setting | Local development |
| --- | --- |
| Host | The PostgreSQL server address. Use `localhost` when the server is on this computer. |
| Port | The port chosen at installation. The PostgreSQL default is `5432`. |
| Database | `EnterpriseERPDb` |
| Username | A PostgreSQL role allowed to use that database |
| Password | The password for that role |

There is no SQL Server instance name to discover. PostgreSQL identifies the server by host and port. Do not put the password in `appsettings.json` or in git. The API project `UserSecretsId` is `a7e3c1d4-6b28-4f90-9c15-2e8d4a6b0f31`.

No business tables, tenant tables, Identity tables, or migrations exist.

## Planned: multi-tenant database model

The product will serve many independent companies from one modular monolith. The intended model is a shared PostgreSQL database and a shared schema, with a `TenantId` on every tenant-owned business row. Platform tables that are not owned by one company, such as the company registry itself, are separate from tenant-owned records.

Planned concepts:

- Platform administrators operate the SaaS service and are not confined to one company.
- A company is the tenant. Company administrators manage that company.
- A user may belong to more than one company through a membership.
- Membership carries the company-specific roles and permissions.
- Tenant-owned business data stores the company id as `TenantId`.

This model is documentation only. No tenant tables, query filters, or role tables have been created.

## Planned: tenant isolation

The server chooses the active company after authentication. A company id sent by the browser is a request to use one of the caller's memberships. It is not trusted by itself.

Rules for the later implementation:

- Resolve the caller from the authenticated session or token.
- Load that caller's memberships on the server.
- Reject a company id the caller does not belong to.
- Set the active `TenantId` from the authorized membership.
- Apply that `TenantId` to every query and command for tenant-owned data.
- Deny cross-tenant reads and writes by default.
- Keep platform-administration operations on a separate authorization policy, not on a client-supplied tenant id.
- Add EF Core query filters for the active tenant, with PostgreSQL row-level security as a later defense in depth.

Company switching will be an explicit, authorized action. Navigation will eventually be built from the caller's permissions in the active company. Neither behavior exists yet.

## Planned: authentication and authorization

A later phase will use ASP.NET Core Identity stored in PostgreSQL. The API will authenticate the caller and authorize both platform actions and company-scoped actions. Company roles stay on the membership, so the same person can have different permissions in different companies.

The React application will send authenticated requests only after that phase exists. Step 1 has no accounts, passwords, tokens, or cookies.

## Explicitly not in this repository yet

- User registration and login
- Roles, permissions, and dynamic navigation
- Tenant or company tables
- Dashboards and sidebar navigation
- HR, finance, procurement, inventory, warehouses, sales, logistics, projects, and subscriptions
- Billing and cloud deployment
