# DG Group of Hospitals — Hospital Management System

A hospital management system built around a **MySQL database layer that does the real work**: transactional stored procedures, triggers, role-based privileges and analytical queries. A Node.js/Express API exposes it, and a React dashboard sits on top.

## What's inside

### Database (`/database`) — the core of the project

| File | What it does |
|---|---|
| `1_schema.sql` | Six tables: `users`, `patients`, `doctors`, `appointments`, `prescriptions`, `billing`, with foreign keys between them |
| `2_roles.sql` | MySQL roles (`db_admin`, `db_doctor`, `db_receptionist`, `db_patient`) with granular privileges |
| `3_procedures.sql` | `schedule_appointment` — books an appointment and creates its pending bill in one transaction<br>`process_payment` — locks the bill row (`SELECT … FOR UPDATE`) before recording payment |
| `4_triggers.sql` | `trg_appointment_cancelled` — cancelling an appointment marks its pending bill as Refunded<br>`trg_doctor_status_audit` — logs every doctor status change to an audit table |
| `5_queries.sql` | Reporting queries: multi-table joins, aggregations, and doctor workload ranking with `RANK() OVER (...)` |
| `6_seed.sql` | Sample data |

### Backend API (`/backend`) — Node.js + Express + mysql2

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks the database connection |
| GET | `/api/patients` | Lists patients with computed age |
| GET | `/api/doctors` | Lists doctors with their appointment counts |
| GET | `/api/appointments` | Lists appointments joined with patient and doctor names |
| POST | `/api/appointments` | Schedules an appointment by calling the `schedule_appointment` stored procedure |

All queries use parameterized statements and a connection pool.

### Frontend (`/frontend`) — React + Vite

- **Dashboard:** patient, appointment and doctor counts, plus recent appointments
- **Doctor directory**
- **Schedule appointment** form that goes through the API and stored procedure

The Patients, Appointments and Billing tabs are placeholders for now (see Roadmap).

## Running it locally

**Prerequisites:** Node.js 18+ and MySQL 8.

### 1. Database

Run the scripts in order:

```bash
mysql -u root -p < database/1_schema.sql
mysql -u root -p < database/2_roles.sql
mysql -u root -p < database/3_procedures.sql
mysql -u root -p < database/4_triggers.sql
mysql -u root -p < database/6_seed.sql
```

`5_queries.sql` holds reporting queries; run them individually to explore the data.

### 2. Backend

```bash
cd backend
cp .env.example .env    # then put your MySQL password in .env
npm install
node server.js          # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

## Roadmap

- [ ] Patients tab: full list, search, add/edit
- [ ] Appointments tab: filter by status/date, cancel (fires the cancellation trigger)
- [ ] Billing tab: outstanding bills, pay via `process_payment`
- [ ] Authentication mapped to the MySQL roles
- [ ] Move the API base URL into a Vite env variable
