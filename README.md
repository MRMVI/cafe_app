# Restaurant Menu & Order Tracker — Full Project

This is a complete system for a simple cafe, including backend and frontend portals for admin and users.

- **Backend:** Laravel API for managing menus and orders  
- **Admin Portal:** Vue.js dashboard for menu and order management  
- **User Portal:** Vue.js customer app for browsing the menu and placing orders  

Order flow: **new → preparing → done**.

---

## Features

### Backend
- User & Admin authentication (Laravel Sanctum)
- Admin CRUD for menu items
- User order placement
- Admin order management and status updates
- Data validation and pagination

### Admin Portal
- Admin login
- Create, edit, and delete menu items
- View all orders and update status
- Dashboard metrics and filtering
- Optional: Real-time updates

### User Portal
- Browse all menu items
- Add items to cart
- Place orders
- Optional: Track order status
- Responsive design for mobile and desktop

---

## Tech Stack

### Backend
- PHP 8+, Laravel 10+
- MySQL / PostgreSQL / SQLite
- Laravel Sanctum for authentication

### Frontend
- Vue 3 (Composition API) + Vite
- Pinia (state management)
- Vue Router
- Axios for API calls
- Tailwind CSS / Bootstrap (optional)

---



