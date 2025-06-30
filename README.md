# 📱 SmartStore - Mobilephone Project

## Table of Contents

- [I. Introduction](#i-introduction)
- [II. Project Description](#ii-project-description)
- [III. Technologies Used](#iii-technologies-used)
- [IV. Role-Based Access Control](#iv-role-based-access-control)
- [V. Conclusion](#v-conclusion)
- [VI. How to Run and Manage the Project](#vi-how-to-run-and-manage-the-project)
- [VII. Notes](#vii-notes)

---

## I. Introduction

In the 4.0 era, mobile phones have become essential in our daily lives. As demand increases and competition intensifies, many stores are transitioning to online sales to provide better customer service. Our team chose the topic **"Building an Online Mobile Phone Store Website"** to apply web development knowledge in creating a modern, convenient, and technology-driven e-commerce system.

### 1.1. Team Members (Group 14)

- Nguyen Hoai Nam (Team Leader)
- Pham Thi Khanh Nguyen (Team Member)
- Vo Tan Loi (Team Member)
- Pham Minh Quang (Team Member)

### 1.2. Instructor

- Lecturer: M.Sc Tran Thinh Manh Duc

### 1.3. Project Structure

```
Mobilephone-Store-main/
├── prisma/             # Prisma configuration and migration
├── public/             # Static assets (images, CSS, JS)
├── src/                # Source code
│   ├── config/         # App configuration
│   ├── controllers/    # Request handling logic
│   ├── middleware/     # Middleware functions
│   ├── models/         # TypeScript data models
│   ├── routes/         # Route definitions
│   ├── schemas/        # Data validation schemas
│   ├── services/       # Business logic
│   ├── type/           # Shared TypeScript types/interfaces
│   └── views/          # EJS templates (UI)
├── .env                # Environment variables
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript configuration
├── app.ts              # Express entry point
└── note.txt            # Notes
```

---

## II. Project Description

### 2.1. Idea

The website allows users to browse and buy mobile phones online with the following main features:

- Display product list (Homepage)
- View product details
- Search and filter products by criteria (price, brand, quantity, etc.)
- Shopping cart
- Order confirmation notification
- Online customer support

### 2.2. Objectives

#### 2.2.1. General Objective

- Build a simple, user-friendly online shopping system with role-based access control and smooth performance across devices.

#### 2.2.2. Specific Objectives

- Learn and apply technologies such as HTML, CSS, JavaScript, Node.js, Express, MySQL, and Passport.js.
- Design a clean, intuitive interface for general users.
- Effectively manage products, orders, and user accounts.
- Integrate essential features like search, filtering, cart, and quick checkout.

---

## III. Technologies Used

### 3.1. Frontend (FE)

- **CSS**: For customizing UI layout, colors, sizing, and effects.
- **Bootstrap 5**: Responsive UI framework with grid system, forms, buttons, and more.
- **EJS**: Server-side template engine for rendering dynamic HTML.

### 3.2. Backend (BE)

- **Node.js**: JavaScript runtime for server-side applications.
- **Express.js**: Web framework for routing and HTTP handling.

### 3.3. Libraries

**Authentication & Session Management**:

- `passport`, `passport-local`: For user login via username/password.
- `express-session`: Manages sessions.
- `@quixo3/prisma-session-store`: Stores session data using Prisma.

**Security & Data Handling**:

- `bcrypt`: Hashes user passwords.
- `dotenv`: Loads `.env` variables.
- `zod`: Validates request input.

**Uploads & Utilities**:

- `multer`: Handles file uploads.
- `uuid`: Generates unique IDs.
- `bootstrap-icons`: Icon set for UI.

### 3.4. Database & ORM

- **MySQL**: Relational database system.
- **Prisma ORM**:
  - `@prisma/client`: Type-safe database queries.
  - `prisma`: CLI for migrations and generation.
  - `@quixo3/prisma-session-store`: Session integration with Prisma.

### 3.5. Development Tools

- `nodemon`: Auto-reloads server on file changes.
- `typescript`: Superset of JavaScript with static types.
- `ts-node`, `tsconfig-paths`: Runs TypeScript directly.
- `@types/...`: Type definitions for libraries.

---

## IV. Role-Based Access Control

- **Admin**: Manage users, products, and orders.
- **User**: View products, place orders, manage profile.
- **Guest**: Browse and register/login to use full features.

---

## V. Conclusion

This project is our first step into full-stack web development. Building both frontend and backend helped us understand how different parts of a web application work together. We improved our programming skills, teamwork, and ability to turn theory into real-world solutions.

---

## VI. How to Run and Manage the Project

### 🌐 Tidio Chat Integration

- Dashboard: [Tidio Panel](https://www.tidio.com/panel/inbox/conversations/unassigned/37c4192609d4451e8a148676c9a4b811)

### 🚀 Run Project Locally

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo-folder>
```

#### 2️⃣ Configure `.env`

```env
DATABASE_URL="mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>"
```

Example:

```env
DATABASE_URL="mysql://root:123456@localhost:3306/userdashboard"
```

#### 3️⃣ (Optional) Update DB password in `src/config/database.ts`

#### 4️⃣ Create Database

```sql
mysql -u root -p
CREATE DATABASE userdashboard;
EXIT;
```

#### 5️⃣ Import Data

```bash
mysql -u root -p userdashboard < database/backup.sql
```

#### 6️⃣ Install Dependencies & Run

```bash
npm install
npx prisma generate
npm run dev
```

---

## VII. 📌 Notes

- Ensure Node.js, MySQL, and Prisma CLI are installed.
- Ensure MySQL credentials in `.env` match `schema.prisma`.
- Do not open or edit `backup.sql` unless necessary.

---
