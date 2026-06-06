🚀 Lead Management CRM (MERN Stack)

A full-stack CRM (Customer Relationship Management) web application built using React, Node.js, Express, and MongoDB.
It helps manage leads with features like create, update, delete, search, and status tracking.

✨ Features
📋 Add, edit, and delete leads
🔍 Search leads by name, email, or company
📊 Lead status tracking (New, Qualified, Contacted, Converted, Lost)
📅 Timestamp tracking for each lead
🎯 Dashboard with real-time statistics
🌐 REST API backend (Express + MongoDB)
⚡ Responsive modern UI (React + Tailwind)
🧱 Tech Stack


## Live Demo
https://crm-project-5.onrender.com/

## GitHub Repository
https://github.com/bhavyaraut421/crm-project

Frontend:

React (Vite)
TypeScript
Tailwind CSS
Framer Motion
Lucide Icons

Backend:

Node.js
Express.js
MongoDB (Mongoose)
CORS + dotenv
📁 Project Structure
crmassignment/
│
├── backend/
│   ├── database/
│   ├── routes/
│   ├── server.ts
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── Dashboard.tsx
│   └── vite.config.ts

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/bhavyaraut421/crm-project.git
cd crm-project

2️⃣ Backend Setup
cd backend
npm install
🔐 Create .env file inside backend
MONGO_URI=your_mongodb_connection_string
PORT=3000

▶️ Run Backend
npm run dev

Backend will run on:

http://localhost:3000
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend will run on:

http://localhost:5173
🔗 API Endpoints
Method	Endpoint	    Description
GET	    /api/leads	    Get all leads
POST	/api/leads	     Create a lead
PUT	    /api/leads/:id	 Update a lead
DELETE	/api/leads/:id	  Delete a lead
GET	   /api/leads/stats	  Get lead statistics


⚠️ Important
Make sure MongoDB Atlas IP whitelist includes:
0.0.0.0/0
Ensure backend is running before frontend
👨‍💻 Author

Bhavya Raut

📌 Future Improvements
Pagination UI (page numbers)
Authentication (JWT login)
Role-based access
Export leads to CSV
Advanced analytics dashboard