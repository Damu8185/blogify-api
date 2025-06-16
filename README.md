# 📝 Mini Blogging Platform – Backend

A secure RESTful API backend built using **Express.js**, **TypeScript**, **JWT authentication**, and **MongoDB** via **Mongoose**.

---

## ⚙️ Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or MongoDB Atlas)

---

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/mini-blog-backend.git
cd mini-blog-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the root:

```env
PORT=4000
DB_CONNECTION=mongodb://localhost:27017/mini_blog_db
JWT_SECRET=your_jwt_secret_here
```

4. **Start the development server**

```bash
npm start
```

Or build and run:

```bash
npm run build
npm start
```

---

## 🔐 Authentication

- JWT-based authentication.
- After sign-up or sign-in, receive a `token` to authorize future requests.

### Auth Header Format

```
Authorization: Bearer <token>
```

---

## 🧪 Testing with Postman

1. Sign up at `POST /api/sign-up`t
2. Login via `POST /api/sign-in`
3. Use the token in Authorization header for protected routes

---

## 📄 License

MIT
