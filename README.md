# 📌 Complaint Management System

A full-stack **Complaint Management System** built using **Node.js, Express, PostgreSQL, HTML, CSS, and JavaScript**.

This system allows users to submit and track complaints, while admins manage complaints through a dedicated admin portal.

---

# 🚀 Features

## 👤 User Functionalities
- User Registration & Login  
- Submit complaints  
- View submitted complaints  
- Track complaint status  
- View admin remarks with **date & time**  
- Complaints displayed in **latest-first order**  

---

## 🛠️ Admin Functionalities
- Admin dashboard  
- View all complaints  
- Filter complaints by status:
  - Submitted  
  - Under Review  
  - Resolved  
  - Rejected  
- Update complaint status  
- Add / Update admin remarks  

---

## ⚙️ System Features
- Default complaint status → **submitted**  
- One complaint → **max one admin remark**  
- Timestamp tracking:
  - Complaint creation  
  - Admin remark time  
- Complaints sorted by **latest first**  
- Uses SQL JOINs to fetch combined data  

---

# 🗄️ Database Design

Tables used:
- `users`
- `complaint`
- `category`
- `complaint_status`
- `admin_remark`
- `login_history`

---

# 🧠 DBMS Concepts Used

- ER Diagram  
- Normalization  
- Primary Keys & Foreign Keys  
- Referential Integrity  
- JOIN Operations (INNER JOIN, LEFT JOIN)  
- Constraints (DEFAULT, UNIQUE, NOT NULL)  
- UPSERT using `ON CONFLICT`  

---

# 🏗️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  


---

# 🌐 Servers & Routes

## 🧑 User Server
- Entry File: `index.js`  
- Runs on: http://localhost:3000

👉 This is the **main user interface (homepage)**

---

## 👨‍💼 Admin Server
- Entry File: `admin.js`  
- Runs on: http://localhost:4000/admin

👉 This is the **admin dashboard**

---

# 🔐 Environment Variables

This project uses a `.env` file to store sensitive information like database credentials.

Create a `.env` file in the root directory and add the following:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name
```


⚠️ Make sure:
- `.env` is included in `.gitignore`
- Do NOT share your actual credentials on GitHub

---

# 🛠️ Note

Update these values according to your local PostgreSQL setup before running the project.


---

# 🗃️ Database Setup (queries.sql)

This project includes a `queries.sql` file which contains all the necessary SQL commands for initial database setup.


### ▶️ How to Use

Run the commands given in queries.sql on your PostgreSQL terminal:


### 📌 It includes:
- Dropping existing tables (for clean reset)
- Creating all required tables
- Inserting sample data
- Sample JOIN query for testing

---
# ▶️ How to Run

1. Install dependencies
```bash
 npm install
```
2. Setup PostgreSQL
- Create database
- Run table creation queries
- Insert sample data

3. Start user server
```bash
 node index.js
```
4. Start admin server (in another terminal)

```bash
 node admin.js
```

---

# 📊 Workflow

1. User registers/logs in

2. User submits complaint → status = submitted (default)

3. Admin views complaint

4. Admin updates status + adds remark

5. User checks updated status and remark

---

# 🎯 Future Improvements

- JWT Authentication

- Multiple admin roles

- Email notifications

- File/image upload support

- React-based frontend