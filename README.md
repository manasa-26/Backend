# Backend
# File Upload & Parsing Backend with Node.js + MongoDB

This is a simple backend built using **Node.js**, **Express**, and **MongoDB** that allows a user to:

✅ Log in using username/password  
📤 Upload a `.txt`, `.docx`, or `.pdf` file  
📝 Parse and extract content from the file  
🧾 Store it in MongoDB  
📡 Retrieve the extracted content by ID  
🌐 (Optional) Streamlit frontend to interact with the API

---

## 🚀 Features

- User authentication (basic login, no registration)
- File upload (via `multer`)
- Parsing using:
  - `.txt`: `fs`
  - `.docx`: `mammoth`
  - `.pdf`: `pdf-parse`
- Truncates content to 500 characters for preview
- Stores document info in MongoDB Atlas
- Easy API testing using Thunder Client or Postman

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Multer
- PDF-Parse, Mammoth (for file parsing)
- JWT (optional auth)
- Streamlit for frontend

MongoDB Schema Diagrams
👤 User Collection Schema

| Field      | Type   | Constraints      | Description                 |
| ---------- | ------ | ---------------- | --------------------------- |
| `username` | String | Unique, Required | Unique username of the user |
| `password` | String | Required         | Hashed user password        |



📄 Document Collection Schema
| Field        | Type   | Description                             |
| ------------ | ------ | --------------------------------------- |
| `filename`   | String | Name of the uploaded file               |
| `content`    | String | Parsed text content (truncated if long) |
| `uploadedAt` | Date   | Timestamp when the file was uploaded    |


🔍 Nested extracted Field
| Field       | Type   | Description                                |
| ----------- | ------ | ------------------------------------------ |
| `name`      | String | Extracted full name from document (if any) |
| `email`     | String | Extracted email address                    |
| `github`    | String | Extracted GitHub profile link              |
| `linkedin`  | String | Extracted LinkedIn profile link            |
| `education` | String | Extracted education details                |


 

---
## 📸 Screenshots
🔐 1. User Login Page
![image](https://github.com/user-attachments/assets/4ad19258-6e6e-4ee7-933c-70df408bcb6b)








