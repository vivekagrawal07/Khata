# 🧾 Invoice Generator Web App

A simple, visually appealing, and fully responsive web application for generating and managing invoices, built with **Vue.js**.

---

## ✨ Features

- Landing page with business logo, hero image, and intro text
- Create, edit, and view invoices
- Invoice list page with full details
- Invoice history page with modification timestamps
- Responsive design (desktop, tablet, mobile)
- Smooth transitions and animations
- Semantic and accessible HTML
- Easy navigation with a NavBar
- Local storage for invoice data (no backend required, but server structure is ready)
- Optional backend with user auth & database

---

## 🗂️ Project Structure

Khata/
├── public/ # Static assets (logo, hero image, etc.)
│ ├── logo.png
│ └── hero.jpg
├── src/
│ ├── assets/ # Images, fonts, etc.
│ ├── components/ # Vue components (NavBar, InvoiceForm, etc.)
│ ├── pages/ # Page views (Landing, Create, Edit, History)
│ ├── router/ # Vue Router config
│ ├── store/ # State management (Pinia/Vuex, optional)
│ ├── App.vue # Root component
│ └── main.js # App entry point
├── server/ # Optional backend
│ ├── server.js # Main server file
│ ├── config/
│ │ └── database.js
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── database/schema.sql
├── package.json # Dependencies & scripts
├── vite.config.js # Vite config
├── .gitignore
└── README.md # You’re reading it!

---

## 📄 Pages

- **Landing Page**: Welcome, hero image, intro text, CTA
- **Login Page**: User login form
- **Register Page**: User registration form
- **Create Invoice Page**: Dynamic invoice creation
- **Edit Invoice Page**: Edit existing invoice
- **Invoice List Page**: See all invoices at a glance
- **History Page**: Track changes to invoices

---

## 🧩 Components

- **NavBar.vue** – Responsive navigation bar
- **InvoiceForm.vue** – Dynamic form for invoices
- **InvoiceList.vue** – Table or cards for invoices
- **HistoryList.vue** – Track and display history logs

---

## 🚀 Getting Started

### ⚡ Clone the Repository

```bash
git clone https://github.com/vivekagrawal07/Khata.git
cd Khata
npm install
npm run dev
