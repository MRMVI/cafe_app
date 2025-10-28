# Restaurant Menu & Order Tracker — Backend (Laravel API)

This is the backend API for a simple cafe system. Admins manage menus and orders. Users browse the menu and place orders. Order flow: **new → preparing → done**.

---

## Features

-   User & Admin authentication (Sanctum / token)
-   Admin: Create/Update/Delete menu items
-   User: Place orders
-   Admin: View all orders and update status
-   Items and orders stored in database
-   Pagination and validation included

---

## Tech Stack

-   PHP 8+
-   Laravel 10+
-   MySQL / PostgreSQL / SQLite
-   Laravel Sanctum (for authentication)

---

## Setup Instructions

1. **Clone the project**

```bash
git clone https://github.com/YOUR-USERNAME/restaurant-backend.git
cd restaurant-backend

```

2. **Install dependencies**

```bash
cp .env.example .env
php artisan key:generate
```

3. **Environment configuration**

```bash
cp .env.example .env
php artisan key:generate
```

4. **Run the API**

```bash
php artisan serve
```
