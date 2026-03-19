🏥 Doctor Appointment Booking System (MERN)

A full-stack MERN application that allows patients to book doctor appointments easily with a dedicated Admin Panel for management.

📁 Project Structure
doctor-appointment/
│
├── admin/        # Admin Dashboard
├── backend/      # Node.js + Express API
├── frontend/     # React User Interface
│
├── docker-compose.yml
├── .gitignore
└── README.md

🚀 Features

-----------------------------------------------👨‍⚕️ User-------------------------------------------------------------------------

Register & Login

View doctors

Book appointments

Appointment history

---------------------------------------------🛠 Admin---------------------------------------------------------------------------

Secure admin login

Manage doctors

View all appointments

Update appointment status

🧰 Tech Stack
Layer	Technology
Frontend	React, Tailwind CSS
Backend	Node.js, Express.js
Database	MongoDB
Auth	JWT
DevOps	Docker, Docker Compose
⚙️ Environment Setup

Create .env file in root:

MONGODB_URI= 
CLOUDINARY_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_SECRET_KEY = 
ADMIN_EMAIL = 
ADMIN_PASSWORD = 
JWT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

🐳 Run Using Docker
docker compose up --build


Access:

Frontend → http://localhost:5173

Backend → http://localhost:4000

Admin → http://localhost:5174

▶ Run Manually
Backend
cd backend
npm install
npm start

Frontend
cd frontend
npm install
npm run dev

Admin
cd admin
npm install
npm run dev

📸 Screenshots
User Panel 
<img width="1908" height="875" alt="image" src="https://github.com/user-attachments/assets/f7218063-d895-455f-8fb2-72f6bf4e16d6" />
<img width="1890" height="869" alt="image-1" src="https://github.com/user-attachments/assets/4e07b2d3-996e-4daf-b5f6-08133c121317" />
<img width="1896" height="858" alt="image-2" src="https://github.com/user-attachments/assets/130634dd-0ef4-4560-a5cf-13ddec654a4c" />
<img width="1852" height="843" alt="image-3" src="https://github.com/user-attachments/assets/3d02ac7c-a93d-41ed-b5ad-aee940268a81" />
<img width="1821" height="855" alt="image-4" src="https://github.com/user-attachments/assets/ebcf021d-5e9a-4f61-9bf9-80dff61be334" />


Admin Panel
<img width="1900" height="873" alt="image-5" src="https://github.com/user-attachments/assets/316cdd1c-a1b7-49c3-b5fb-8d4d6f231c26" />
<img width="1890" height="858" alt="image-6" src="https://github.com/user-attachments/assets/477cbf13-97ba-45e4-bfe0-4a57efc5a68b" />

Doctor Panel

<img width="1903" height="868" alt="image" src="https://github.com/user-attachments/assets/ea7a70a0-c7bb-4341-8053-15d918c49638" />
<img width="1883" height="857" alt="image" src="https://github.com/user-attachments/assets/4f888dd8-d23f-4ef0-bbcf-76ac738d4896" />




🔐 Security

JWT Authentication

Protected Routes

Environment Variables

📦 Future Enhancements

Email notifications

Video consultation

Doctor rating system

👨‍💻 Author

Yash Parmar
DevOps & MERN Developer

⭐ Support

If you like this project
👉 Give it a ⭐ on GitHub!
