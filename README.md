<div align="center"> 
  <img src="https://i.imgur.com/J3yU7P9.png" alt="HRPay Nexus Logo" width="120" />
  <h1>HRPay Nexus 🚀</h1>
  <p><strong>Next-Generation Enterprise HR & Payroll Ecosystem</strong></p>
  <p>Designed and Developed by <b>Shakir Tech Solutions</b></p>

  <p>
    <a href="#-live-demo">Live Demo</a> •
    <a href="#-core-modules">Features</a> •
    <a href="#-user-guide--system-exploration">User Guide</a> •
    <a href="#-technology-stack">Tech Stack</a>
  </p>
</div>

---

## 🌟 Live Demo

Experience the complete enterprise capabilities of HRPay Nexus directly in your browser.

👉 **[Access the Live System Here](https://hr-payroll-system-bpcg.vercel.app/)**

### 🔐 Demo Credentials
- **Email:** `admin@hrpaynexus.com`
- **Password:** `Admin@123`

> [!WARNING]
> **Cold Start Notice:** The backend API is hosted on a free cloud tier. **Your first login attempt may take up to 30-50 seconds** as the server wakes up from sleep. Please click "Sign In" and wait patiently! Subsequent requests will be lightning fast.

---

## 📖 User Guide & System Exploration

Follow this guided tour to explore the full capabilities of HRPay Nexus.

### 1️⃣ The Dashboard (The Nexus Hub)
Upon logging in, you'll land on the main analytics dashboard.
- **Asymmetrical Grid UI:** Admins enjoy a custom 13-column enterprise grid that prevents data truncation for massive financial figures.
- **Real-Time Analytics:** View active employees, pending leave requests, and total monthly payroll expenditure at a glance.
- **Department Distribution:** Check the bottom section for a clean breakdown of headcount by department.

### 2️⃣ Employee Base
Navigate to **Employee Base** via the left sidebar.
- **Add New Employees:** Click the "+ Add Employee" button. The system automatically provisions a user account, password hash, and default leave quotas (12 days annual) upon creation.
- **Role Hierarchy:** You can assign strict roles (Admin, HR, Finance, Manager, Employee).
- **Responsive Tables:** The employee registry collapses beautifully onto mobile and tablet views.

### 3️⃣ Payroll Ops & PDF Payslips
Navigate to **Payroll Ops**.
- **Run Payroll:** Select an active employee and enter their allowances or specific deductions.
- **Compliance Engine:** The backend instantly calculates Gross Pay, Net Pay, and statutory deductions like EPF (8%/12%) and ETF (3%) based on strict Sri Lankan financial compliance rules.
- **One-Click Download:** Once calculated, click the **Download** icon to automatically generate and download a professional, structured PDF Payslip rendered via QuestPDF.

### 4️⃣ Leave Center
Navigate to the **Leave Center**.
- **Automated Quotas:** Employees start with strict leave balances. 
- **Approval Workflow:** Admins can Approve or Reject leaves. Approved leaves automatically deduct from the employee's balance.
- **Excess Leave Penalty:** If an employee exhausts their balance and takes unpaid leave, the Payroll engine seamlessly docks their next salary.

### 5️⃣ Intelligence Reports
Navigate to **Intelligence Reports** (Restricted to Admins/Finance).
- Generate a comprehensive, high-level **Monthly Payroll Digest**.
- Downloads as a fully structured PDF report containing department-wise spending, top earners, and total statutory compliance summaries.

---

## 🛡️ Role-Based Access Control (RBAC)

The system enforces strict UI and API-level security based on 5 distinct roles. Each role has a carefully tailored experience:

- **Admin**: Full superuser access. Can manage all employees, execute payroll, approve/reject leaves, generate intelligence reports, and view the 13-column master financial dashboard.
- **HR**: Focused on personnel. Can manage employee data, onboard new hires, and oversee leave requests. Excluded from sensitive financial/payroll execution.
- **Finance**: Focused on money. Can access Payroll Ops, calculate statutory deductions, generate payslips, and download Intelligence Reports. Excluded from raw HR tasks.
- **Manager**: Middle-tier access. Can view team structures and approve/reject leave requests for their respective departments.
- **Employee**: Self-service portal. Can view their personal Leave Balance, request time off, and instantly download their own generated PDF payslips from a personalized dashboard. They cannot access the core Employee Base or Payroll Ops.

---

## ⚡ Core Modules

- **Authentication Protocol:** JWT-based stateless auth with sliding HTTP-only refresh tokens.
- **Strict RBAC:** Deep UI and API-level protection restricting views based on Role (e.g., Employees can only see their *own* payslips, not the Payroll Ops tab).
- **UI/UX Excellence:** Complete styling via Tailwind CSS v4 featuring frosted glassmorphism, micro-animations (Framer Motion), and responsive breakpoint adaptation.

---

## 🛠️ Technology Stack

HRPay Nexus utilizes a highly scalable, modern architectural stack:

### Frontend
- **React 18 & TypeScript:** Strict typing for enterprise reliability.
- **Vite:** Next-generation fast bundler.
- **Tailwind CSS v4:** Utility-first styling with custom UI tokens.
- **Framer Motion:** Fluid, physical micro-animations.
- **Lucide Icons:** Crisp, consistent vector icon set.

### Backend
- **.NET 8 (C#):** High-performance ASP.NET Core Web API.
- **Entity Framework Core:** Advanced ORM with Code-First Migrations.
- **PostgreSQL (Neon.tech):** Serverless SQL cloud database.
- **QuestPDF:** Lightning-fast backend PDF generation engine.
- **Clean Architecture:** Strict separation of API, Application, Domain, and Infrastructure layers.

---

## 📂 Architecture & Folder Structure

HRPay Nexus follows a strict Clean Architecture pattern on the backend and a modular component structure on the frontend.

```text
HR-Pay-Nexus-New/
├── backend/
│   ├── HRPayNexus.API/             # Controllers, Middlewares, App Config
│   ├── HRPayNexus.Application/     # Business Logic, DTOs, Services
│   ├── HRPayNexus.Domain/          # Core Entities, Enums, Interfaces
│   └── HRPayNexus.Infrastructure/  # EF Core DbContext, Auth Providers, External Services
└── frontend/
    ├── src/
    │   ├── assets/                 # Images & branding
    │   ├── components/             # Reusable UI components & Layouts
    │   ├── pages/                  # Main views (Dashboard, Payroll, Leaves, etc.)
    │   ├── services/               # Axios API configuration & Interceptors
    │   └── store/                  # Zustand global state (Authentication)
    ├── package.json
    └── tailwind.css
```

---

## 💻 Installation & Local Setup

Follow these steps to get the system running on your local machine.

### 1. Database Setup
The system is configured to use PostgreSQL. By default, it connects to a cloud Neon.tech database. If you wish to use a local database, ensure PostgreSQL is running and update the connection string in `backend/HRPayNexus.API/appsettings.json`.

### 2. Backend Initialization
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
# Restore dependencies
dotnet restore
# Apply Entity Framework Core migrations (Optional if using the default Neon DB which is already seeded)
dotnet ef database update --project HRPayNexus.Infrastructure --startup-project HRPayNexus.API
# Run the API
dotnet run --project HRPayNexus.API/HRPayNexus.API.csproj
```
The backend API will start running (typically on `http://localhost:5000` or `https://localhost:5001`).

### 3. Frontend Initialization
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
# Create your local environment file
cp .env.example .env
# Open .env and set VITE_API_URL to your backend's URL (e.g., http://localhost:5000/api/v1)
# Install dependencies
npm install
# Start the Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

<div align="center">
  <p>Engineered for speed, compliance, and enterprise scale.</p>
  <p><b>Shakir Tech Solutions</b> © 2026</p>
</div>
