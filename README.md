# SyncUp.

**SyncUp** is a comprehensive **Freelance Availability & Portfolio Hub** designed to bridge the gap between creative professionals and clients. It visualizes your schedule, showcases your best work, and streamlines communication.

![SyncUp Banner](https://via.placeholder.com/1200x600?text=SyncUp+Banner)

> **Deployment**: [Live Demo](https://se-project-ashy.vercel.app/)

## 🚀 Services & Features

### 1. **Availability Dashboard**
- **Timeline View**: Visual representation of "Planning", "In-Progress", and "Completed" projects.
- **Schedule Management**: Drag-and-drop or modal-based project scheduling.
- **Status Tracking**: Keep track of your workload to prevent burnout and overbooking.

### 2. **Dynamic Portfolio**
- **Showcase Work**: specialized grid layout for design/dev portfolios.
- **AI Description**: Integrated **Google Gemini AI** to auto-generate compelling project descriptions.
- **Validation**: Ensure all portfolio items are presented perfectly.

### 3. **Smart Communication (Inquiry System)**
- **Real-time Inquiries**: Receive client messages instantly with auto-polling (every 15s).
- **Email Integration**: Reply directly from the dashboard using **Nodemailer** (sends real emails to clients).
- **AI Reply Assistant**: Generate professional or friendly reply drafts with one click.

### 4. **Public Profile & Sharing**
- **Public View**: A clean, accessible page for clients to view your schedule and portfolio without logging in.
- **QR Code Sharing**: Instantly generate a QR code to share your profile in meetings or on business cards.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Custom Design System)
- **State/Routing**: React Router, Content API
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Services**: Nodemailer (SMTP), Google Gemini AI
- **Deployment**: Render

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/honeykwak/SE_project.git
   cd SE_project
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Environment Variables (.env)**
   Create `.env` file in `server/` and `client/`:
   
   **Server (.env)**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   SMTP_EMAIL=your_gmail_address
   SMTP_PASSWORD=your_app_password
   ```

   **Client (.env.local)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Run Locally**
   ```bash
   # Terminal 1 (Backend)
   cd server
   npm run dev

   # Terminal 2 (Frontend)
   cd client
   npm run dev
   ```

---

## 🔒 License
This project is for educational purposes.
© 2025 SyncUp. All rights reserved.
