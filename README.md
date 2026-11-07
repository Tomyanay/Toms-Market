# 🛒 Tom's Market

<p align="center">
  <h1 align="center">Tom's Market</h1>
  <p align="center">
    A modern full-stack online market built with the PERN stack and TypeScript.
    <br />
    Browse products, manage your cart, and enjoy a seamless shopping experience.
  </p>
</p>

---

## ✨ Features

- 🛍️ **Product Catalog** – Browse over 190+ products (more can be added).
- ⚡ **Fast Performance** – Optimized state management and responsive interactions.
- 📦 **Product Details** – View descriptions, ratings, and real-time stock availability.
- ⭐ **Review System** – Create, edit, and delete product reviews.
- 🔐 **User Authentication** – User registration, login, and session management using JWT.
- 🗄️ **Database Persistence** – PostgreSQL-backed storage for users, products, carts, and reviews.
- 📱 **Responsive UI** – Modern interface designed for different screen sizes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL, Supabase |
| **Forms** | React Hook Form |

---

## 🚀 Getting Started

Follow the instructions below to run Tom's Market locally or globaly.

### 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- A PostgreSQL instance or a [Supabase](https://supabase.com/) project

### 💻 Installation

**1. Clone the repository**

```bash
git clone https://github.com/Tomyanay/Toms-Market.git
```

**2. Navigate to the project directory**

```bash
cd Toms-Market
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create your `.env` file and fill it using the variable keys provided in `.env.example`.

**5. Initialize the database**

1. Open your Supabase SQL Editor or PostgreSQL client.
2. Navigate to `backend/Create_tables.sql in the project folder`.
3. Copy and execute the entire SQL query.

The script automatically creates and inserts data to the following tables:

- `products`
- `users`
- `cart`
- `refresh_table`

**6. Create an administrator account (For testing if needed)**

1. Register a new account through the Login page.
2. Open your database editor.
3. Execute the following query, replacing `your_username` with your chosen username:

```sql
UPDATE public.users
SET role = 'Admin'
WHERE username = 'your_username';
```

**7. Start the development server**

```bash
npm run dev
```
