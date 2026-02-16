# 🚀 Full Stack Product Management Assessment

A full-stack product management system built using **React, Express, and MySQL** with soft delete functionality and database-level restore protection.

---

## 📌 Overview

This project includes:

- ✅ Reusable React table component with sorting and filtering
- ✅ RESTful Express.js API
- ✅ MySQL database integration
- ✅ Soft delete functionality
- ✅ Restore protection using MySQL trigger (30-day limit)

---

## 🛠 Tech Stack

### Frontend
- React (Vite)

### Backend
- Node.js
- Express.js
- MySQL
- mysql2

---

## 📂 Project Structure

```
assessment-fullstack/
│
├── client/        # React frontend
└── server/        # Express backend
```

---

# ⚙️ Setup Instructions

---

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd assessment-fullstack
```

---

## 2️⃣ Database Setup

### Login to MySQL

```bash
mysql -u root -p
```

### Create Database

```sql
CREATE DATABASE assessment_db;
USE assessment_db;
```

### Create Products Table

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);
```

### Create Trigger (Prevent Restore After 30 Days)

```sql
DELIMITER $$

CREATE TRIGGER prevent_restore
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
  IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
    IF OLD.deleted_at < NOW() - INTERVAL 30 DAY THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot restore product deleted more than 30 days ago';
    END IF;
  END IF;
END$$

DELIMITER ;
```

🔒 This trigger ensures products deleted more than 30 days ago cannot be restored.

---

## 3️⃣ Backend Setup

```bash
cd server
npm install
```

### Create `.env` file inside `server/`

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=assessment_db
```

### Start Backend Server

```bash
node server.js
```

Backend runs at:

```
http://localhost:5000
```

---

## 4️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 📡 API Endpoints

| Method | Endpoint                       | Description                     |
|--------|--------------------------------|---------------------------------|
| GET    | `/api/products`                | Fetch active products           |
| POST   | `/api/products`                | Create new product              |
| PUT    | `/api/products/:id`            | Update product                  |
| DELETE | `/api/products/:id`            | Soft delete product             |
| PUT    | `/api/products/:id/restore`    | Restore soft-deleted product    |

---

# 🗑 Soft Delete Logic

Products are **not permanently deleted**.

Instead:
- `deleted_at` is set to current timestamp
- Active products are filtered using:

```sql
WHERE deleted_at IS NULL
```

---

# 🔄 Restore Logic

- Restore sets `deleted_at = NULL`
- Restore allowed only within **30 days**
- Database trigger blocks restore after 30 days

This enforces business rules directly at the database level.

---

# ⭐ Key Features

- Clean reusable React table component
- Proper RESTful API structure
- Soft delete implementation
- MySQL trigger for business rule enforcement
- Clear separation of frontend and backend

---

## 👨‍💻 Author

**Hari Baskar**

---

