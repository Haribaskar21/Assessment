Project Overview

This project consists of:

A reusable React table component with filtering and sorting.

A RESTful Express.js API for managing products.

MySQL database with soft delete and restore functionality.

Database trigger to prevent restoring records deleted more than 30 days ago.

Tech Stack

Frontend:

React (Vite)

Backend:

Node.js

Express.js

MySQL

mysql2

Project Structure
client/   -> React frontend
server/   -> Express backend

Setup Instructions
1. Clone Repository
git clone <repo-url>
cd assessment-fullstack

2. Setup Database

Login to MySQL:

mysql -u root -p


Create database:

CREATE DATABASE assessment_db;
USE assessment_db;


Run migration script:

Copy and execute:

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL
);


Create trigger:

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

3. Backend Setup
cd server
npm install


Create .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=assessment_db


Start server:

node server.js

4. Frontend Setup
cd client
npm install
npm run dev

API Endpoints
Method	Endpoint	Description
GET	/api/products	Fetch active products
POST	/api/products	Create product
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Soft delete
PUT	/api/products/:id/restore	Restore product
Soft Delete Logic

Products are not physically deleted. Instead, the deleted_at column is updated with the current timestamp. Active products are filtered using:

WHERE deleted_at IS NULL


Restore functionality sets deleted_at back to NULL unless the product was deleted more than 30 days ago.
