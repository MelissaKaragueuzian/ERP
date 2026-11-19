# EnterpriseERP

EnterpriseERP is a multi-company ERP SaaS platform. Each subscribing company will manage its own people, finance, procurement, inventory, sales, and operations in isolated data.

This repository currently contains the Phase 1 foundation: a .NET 10 Web API, a React client, and the Clean Architecture project layout. Business modules, authentication, and the database schema are not implemented yet.

## Technology stack

| Area | Choice |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | ASP.NET Core 10 Web API, C# |
| Data access | Entity Framework Core 10 with Npgsql (package referenced, not yet used at runtime) |
| Database | PostgreSQL, code first, in a later phase |
| Architecture | Modular monolith, Clean Architecture, REST |

The frontend talks only to the ASP.NET Core API. There is no Node.js application server.

## Folder structure

```text
EnterpriseERP-SaaS/
  backend/
    EnterpriseERP.slnx
    src/
      EnterpriseERP.Api/
      EnterpriseERP.Application/
      EnterpriseERP.Domain/
      EnterpriseERP.Infrastructure/
    tests/
      EnterpriseERP.Tests/
  frontend/
    src/
      app/
      components/
      pages/
      services/
      types/
  docs/
    architecture.md
```

`docs/architecture.md` separates the structure that exists today from the multi-tenant design that is only planned.

## Requirements and prerequisites

Verified on this machine while creating the solution:

- .NET SDK 10.0.401, including the ASP.NET Core 10.0.12 shared framework
- Node.js 26.10.0 and npm 11.19.1
- Git 2.55

PostgreSQL is not installed, and it is not required to build or run this step. Docker is also not installed. When the database phase starts, install a current PostgreSQL release for Windows from [the official download page](https://www.postgresql.org/download/windows/). During setup, record:

- Host, usually `localhost` for a database on this computer
- Port, usually `5432`
- Database name: `EnterpriseERPDb`
- Username
- Password

PostgreSQL does not use a SQL Server instance name. A connection is host plus port.

Do not commit the password. The API project is prepared for development user secrets (`UserSecretsId` is already set). The connection is intentionally not read at startup yet. When persistence is added, set it from `backend/src/EnterpriseERP.Api`:

```powershell
dotnet user-secrets set "ConnectionStrings:EnterpriseERPDb" "Host=localhost;Port=5432;Database=EnterpriseERPDb;Username=YOUR_USER;Password=YOUR_PASSWORD"
```

Replace the host, port, username, and password with the values from your PostgreSQL installation. For a remote or hosted database, also set `SSL Mode` as required by that server.

## Backend startup

From `EnterpriseERP-SaaS`:

```powershell
dotnet run --project backend/src/EnterpriseERP.Api --launch-profile http
```

The development HTTP profile listens on `http://localhost:5080`. An HTTPS profile is also available on `https://localhost:7080`. HTTPS redirection is disabled in Development so the React app can call the HTTP address directly. Production enables HTTPS redirection and does not enable the development CORS policy.

OpenAPI is mapped only in Development: `http://localhost:5080/openapi/v1.json`.

## Frontend startup

From `EnterpriseERP-SaaS/frontend`:

```powershell
npm install
npm run dev
```

Vite serves the client at `http://localhost:5173`. The port is fixed because the API allows that origin only. The API address comes from `frontend/.env.development`:

```text
VITE_API_BASE_URL=http://localhost:5080
```

That file contains a local URL, not a secret. Do not put credentials in any `VITE_` variable. Production builds do not embed a server address; set `VITE_API_BASE_URL` in the deployment environment when a real host exists.

## API connection testing

1. Start the API with the HTTP profile.
2. Start the Vite dev server.
3. Open `http://localhost:5173`.
4. Click **Test API Connection**.

A successful call shows **Backend connected successfully.** You can also request the endpoint directly:

```powershell
curl http://localhost:5080/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "application": "EnterpriseERP"
}
```

## Future development roadmap

Implemented now: solution layout, health endpoint, development CORS, OpenAPI in development, and the landing page.

Not implemented, in the intended order:

1. PostgreSQL connection through user secrets, then an EF Core `DbContext`, still without business tables.
2. Company, membership, and tenant-isolation model.
3. Authentication, roles, and authorization.
4. Platform administration and the operational modules: HR, finance, procurement, inventory, sales, logistics, projects, and subscriptions.

See `docs/architecture.md` for the dependency rules and the planned tenancy model.
