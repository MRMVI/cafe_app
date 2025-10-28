# Cafe Admin Portal — Vue.js Dashboard

This is the admin dashboard interface for managing the cafe system. Admins can:

- Login to the portal
- Create, update, and delete menu items
- View all orders
- Update order status (**new → preparing → done**)

---

## Features

- Admin authentication with backend API
- Menu CRUD (Create, Read, Update, Delete)
- Orders dashboard with filtering and status updates
- Dashboard metrics (optional: new orders count, revenue summary)
- Pagination for lists

---

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Pinia (state management)
- Vue Router
- Axios for API calls
- Tailwind CSS or Bootstrap (optional)

---

## Setup Instructions

### 1. Clone the project

```bash
git clone https://github.com/YOUR-USERNAME/cafe-admin-frontend.git
cd cafe-admin-frontend
npm install
cp .env.example .env
VITE_API_BASE_URL=http://localhost:8000/api
npm run dev
```

## Folder Structure

src/
api/
axios.ts # Axios instance for API requests
stores/
auth.ts # Authentication store
menu.ts # Menu management store
order.ts # Orders store
views/
Login.vue
Menus.vue
Orders.vue
Dashboard.vue
components/
MenuForm.vue
OrderCard.vue
OrderFilter.vue
