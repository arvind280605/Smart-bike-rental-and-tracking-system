🚲 Smart Bike Rental & Tracking System  
 Full-Stack Software Project | Node.js, Express, MongoDB | Deployed on Render

A complete **full-stack software application** for managing a bike rental system with multiple stations.  
Users can register, log in, view available bikes at each station, rent a bike, return it to any chosen station, and track their ride history.  
The backend is built using Node.js + Express, the frontend uses HTML/CSS/JavaScript, and all data is stored in MongoDB.  
The entire system is deployed on Render

🔗 Live Demo:  
https://smart-bike-rental-and-tracking-system.onrender.com



📘 About This Project

This project simulates a real-world bike rental system with 5 predefined stations.  
Instead of external APIs or GPS tracking, bike availability and station updates are handled through backend logic and MongoDB collections.

It demonstrates full-stack software engineering skills including:
- Backend routing  
- Authentication  
- Database CRUD operations  
- State management  
- UI design  
- Deployment workflow  

This is suitable as a Software Engineering, Full-Stack, or Backend Engineering portfolio project.



 ⭐ Features

👤 User Features
- User Registration & Login  
- Profile view and edit  
- Ride history tracking  

🚲 Rental Features
- View 5 predefined bike stations  
- Check bike availability per station  
- Rent a bike from any station  
- Return the bike to any selected station  
- Real-time bike count updates (via MongoDB)

💳 Dashboard & Payment
- Dashboard showing current rental details  
- Basic payment workflow simulation  
- User ride insights  

🗄 Database (MongoDB)
Collections include:
- users  
- bikes  
- stations  
- rentals  
- payments  

All operations update the database in real-time.



 🛠️ Tech Stack

🎨 Frontend
- HTML5  
- CSS3  
- JavaScript (Vanilla)

🧩 Backend
- Node.js  
- Express.js  

🗃️ Database
- MongoDB (Local / MongoDB Atlas)

🌐 Deployment
- Render (Cloud Hosting)  
- Node.js Runtime  



 📂 Folder Structure

Smart bike rental and tracking system/
│── server.js
│── package.json
│── package-lock.json
│── style.css
│── login.html
│── register.html
│── dashboard.html
│── stations.html
│── rent-bike.html
│── my-rides.html
│── payments.html
│── profile.html
│── bikerental.html
│── update-bikes.js
│── fix-database.js
│── testmongo.js
│── /node_modules



 🚀 Run Locally (Development Setup)

1️⃣ Clone the repository

git clone https://github.com/YOUR-USERNAME/Smart-Bike-Rental-System.git

cd Smart-Bike-Rental-System

2️⃣ Install dependencies

npm install

3️⃣ Configure MongoDB

Update your MongoDB connection string in server.js:

const uri = "your-mongodb-connection-string";

4️⃣ Start the server

node server.js

5️⃣ Open in browser

http://localhost:3000

🌐 Deployment (Render)

This application is live on Render.

🔗 Live URL:
https://smart-bike-rental-and-tracking-system.onrender.com

Render automatically:

Installs dependencies

Runs node server.js

Serves both backend and static frontend files



