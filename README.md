README.md
# Smart Campus Administration Portal

A modern web-based platform designed to digitize and streamline campus administrative processes. The system enables students to submit administrative requests, track their status in real time, and receive updates, while providing administrators with an efficient dashboard to manage and process requests.

## Overview

Campus administrative tasks are often handled manually, resulting in delays, lack of transparency, and inefficient communication between students and administration staff. This project addresses these challenges by providing a centralized portal for request management and status tracking.

## Features

### Student Features
- Secure authentication and authorization
- Submit administrative requests
- Track request status in real time
- View request history
- Receive status updates and notifications
- Dark Mode / Light Mode support

### Administrator Features
- Admin dashboard
- View and manage student requests
- Approve or reject requests
- Update request statuses
- Monitor request workflow

### System Features
- Role-based access control
- RESTful API architecture
- Secure JWT authentication
- File upload support
- Responsive user interface
- Scalable modular architecture

## Tech Stack

### Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### Security
- JWT Authentication
- bcryptjs
- Helmet

### Additional Tools
- Multer
- Morgan
- CORS
- Dotenv

## Project Structure

```text
CampusPortal/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── server/
│       ├── src/
│       │   ├── controllers/
│       │   ├── middleware/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── utils/
│       │   └── index.js
│       └── package.json
│
└── packages/

###Installation
##Clone Repository
git clone <repository-url>
cd CampusPortal
Install Dependencies
npm install
Backend Setup

Navigate to server:

cd apps/server

Create a .env file:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Install dependencies:

npm install

Run backend:

npm run dev
Frontend Setup

Navigate to frontend:

cd apps/web

Install dependencies:

npm install

Run frontend:

npm run dev
API Modules
Authentication
Register User
Login User
JWT Token Validation
Requests
Create Request
View Requests
Update Request Status
Delete Request
Admin
Manage Requests
View Analytics
User Management
Future Enhancements
Email Notifications
Real-time Updates using WebSockets
AI-powered Student Assistant
Analytics Dashboard
Multi-role Administration
Mobile Application
Advanced Reporting System
Automated Document Verification
Security Measures
Password Hashing with bcrypt
JWT-based Authentication
Secure HTTP Headers via Helmet
Input Validation
Environment Variable Protection
Contributing

Contributions are welcome. Feel free to fork the repository and submit pull requests.

License

This project is licensed under the MIT License.

Author

Prateek Rai


Prateek Rai
