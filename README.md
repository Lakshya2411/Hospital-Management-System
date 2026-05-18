# DG Group of Hospitals

A highly professional, full-stack Hospital Management System designed to showcase advanced database concepts and premium frontend UI design.

## Features & Architecture

This project is divided into three key areas to demonstrate full-stack capabilities and deep technical knowledge:

### 1. Advanced Database (MySQL)
The `/database` folder contains highly optimized MySQL scripts demonstrating advanced database concepts:
- **Complex Joins & Analytics (`5_queries.sql`)**: Features multi-table joins, aggregations, and window functions to generate comprehensive patient histories, monthly revenue reports, and doctor workload analysis.
- **Stored Procedures (`3_procedures.sql`)**: Contains transactional procedures for complex business logic, such as `schedule_appointment` (which handles concurrency checks and auto-generates pending bills) and `process_payment`.
- **Triggers (`4_triggers.sql`)**: Automated database responses for cascading appointment cancellations to billing refunds, and maintaining a robust audit trail for doctor status changes.
- **Security Roles (`2_roles.sql`)**: Implements MySQL roles and granular privileges (Admin, Doctor, Receptionist, Patient) to ensure robust security structure.

### 2. Modern Frontend (React + Vite)
The `/frontend` folder contains a highly polished, responsive web application built with React and Vite.
- **Premium Aesthetics**: Utilizes a custom glassmorphism design system, vibrant accents, dark mode by default, and smooth micro-animations.
- **Dynamic Routing & State**: Demonstrates fluid transitions between Dashboard, Patient Management, and Doctor Directories.

### 3. Backend API (Node.js + Express)
The `/backend` folder contains the Express server setup ready to interface with the MySQL database using the `mysql2` driver.

## How to Run

### Frontend
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Backend
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`

### Database
Execute the SQL files located in the `/database` directory sequentially against your MySQL instance to create the schema, roles, procedures, and triggers. You can use tools like MySQL Workbench, phpMyAdmin, or the MySQL Command Line Client.
