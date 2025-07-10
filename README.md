# Invoice Generator Web App

A simple, visually appealing, and fully responsive web application for generating and managing invoices, built with Vue.js.

## Features

- Landing page with business logo, hero image, and introduction
- Create, edit, and view invoices
- Invoice list page with full invoice details
- Invoice history page with modification timestamps
- Responsive design (desktop, tablet, mobile)
- Smooth transitions and animations
- Accessible and semantic HTML
- Easy navigation with a navigation bar
- Local storage for invoice data (no backend required)

## Project Structure

```
invoice-generator/
├── public/                 # Static assets (favicon, hero image, etc.)
│   └── logo.png
│   └── hero.jpg
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable Vue components (NavBar, InvoiceForm, etc.)
│   ├── pages/              # Page components (Landing, Create, Edit, History)
│   ├── router/             # Vue Router setup
│   ├── store/              # State management (optional, e.g., Pinia/Vuex)
│   ├── App.vue             # Root Vue component
│   └── main.js             # App entry point
├── server/                 # Backend server (optional)
│   ├── package.json        # Server dependencies
│   ├── server.js           # Main server file
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── models/
│   │   ├── Invoice.js      # Invoice model
│   │   ├── InvoiceItem.js  # Invoice item model
│   │   └── User.js         # User model
│   ├── routes/
│   │   ├── invoices.js     # Invoice routes
│   │   ├── users.js        # User routes
│   │   └── auth.js         # Authentication routes
│   ├── middleware/
│   │   ├── auth.js         # Authentication middleware
│   │   └── validation.js   # Request validation
│   └── database/
│       └── schema.sql      # Database schema
├── package.json            # Project metadata and dependencies
├── README.md               # Project documentation
└── ...                     # Other config files (e.g., .gitignore, vite.config.js)
```

## Pages

- **Landing Page**: `src/pages/LandingPage.vue`
- **Login Page**: `src/pages/LoginPage.vue`
- **Register Page**: `src/pages/RegisterPage.vue`
- **Create Invoice Page**: `src/pages/CreateInvoicePage.vue`
- **Edit Invoice Page**: `src/pages/EditInvoicePage.vue`
- **Invoice List Page**: `src/pages/InvoiceListPage.vue`
- **History Page**: `src/pages/HistoryPage.vue`

## Components

- **NavBar**: `src/components/NavBar.vue`
- **InvoiceForm**: `src/components/InvoiceForm.vue`
- **InvoiceList**: `src/components/InvoiceList.vue`
- **HistoryList**: `src/components/HistoryList.vue`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173` (or the port shown in your terminal).

## Page Structures

### 1. Landing Page
- **Header**: Business logo, navigation bar
- **Hero Section**: Large hero image, introductory text, call-to-action button (e.g., "Create Invoice")
- **About/Intro**: Brief description of the business or app
- **Footer**: Contact info, copyright

### 2. Login Page
- **Header**: Navigation bar
- **Login Form**:
  - Email Address (input)
  - Password (input)
  - Remember Me (checkbox)
  - Sign In button
- **Footer**: Links to register and forgot password

### 3. Register Page
- **Header**: Navigation bar
- **Registration Form**:
  - First Name (input)
  - Last Name (input)
  - Email Address (input)
  - Company Name (input, optional)
  - Phone Number (input, optional)
  - Password (input)
  - Confirm Password (input)
  - Terms Agreement (checkbox)
  - Create Account button
- **Footer**: Link to login page

### 4. Create Invoice Page
- **Header**: Navigation bar
- **Invoice Form**:
  - Client Name (input)
  - Invoice Date (date picker)
  - Item List (dynamic rows):
    - Item Description (input)
    - Quantity (input)
    - Price (input)
    - Add/Remove item buttons
  - Total Amount (auto-calculated)
  - Notes (textarea, optional)
  - Save/Submit button
- **Footer**: Navigation or quick links

### 5. Edit Invoice Page
- **Header**: Navigation bar
- **Invoice Form**: (Pre-filled with selected invoice data)
  - Same structure as Create Invoice Page
  - Update/Save button
  - Cancel/Back button
- **Footer**: Navigation or quick links

### 6. Invoice List Page
- **Header**: Navigation bar
- **Invoice List**:
  - Table or card list of all invoices
    - Invoice Number/ID
    - Client Name
    - Date
    - Total Amount
    - Status (e.g., Paid/Unpaid)
    - Edit/View/Delete buttons for each invoice
- **Footer**: Navigation or quick links

### 7. History Page
- **Header**: Navigation bar
- **History List**:
  - Table showing modification history
    - Invoice Number/ID
    - Client Name
    - Date of creation
    - Date of modification
    - View/Edit buttons for each invoice
- **Footer**: Navigation or quick links

---

**All pages** are responsive, accessible, and include smooth transitions for navigation and form actions.

Feel free to customize this project structure as needed for your workflow! 