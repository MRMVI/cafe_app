# Cafe User Portal — Vue.js Customer App

This is the customer-facing web app for browsing the cafe menu and placing orders.

---

## Features

- View all menu items
- Add items to cart
- Place orders
- Optional: Track order status
- Simple, responsive design

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
git clone https://github.com/YOUR-USERNAME/cafe-user-frontend.git
cd cafe-user-frontend
npm install
cp .env.example .env
npm run dev
```

## Folder Structure

src/
api/
axios.ts # Axios instance for API requests
stores/
cart.ts # Cart store
menu.ts # Menu store
order.ts # Order store
views/
Home.vue # List all menu items
Cart.vue # View cart and checkout
OrderSuccess.vue # Order confirmation
OrderStatus.vue # Optional: Track order status
components/
MenuCard.vue
CartItem.vue
CheckoutForm.vue
