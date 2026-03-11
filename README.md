# FoodHub 🍔

FoodHub is a premium, full-scale food delivery web application that connects local food providers with hungry customers. Designed with a stunning, modern user interface, FoodHub offers a seamless experience from browsing menus to live order tracking. 

The platform supports multiple user roles (Customers, Providers, and Admins), each with tailored dashboards and administrative controls.

---

## 🌟 Key Features

### For Customers
* **Browse & Discover:** Explore a diverse catalog of meals from verified local providers.
* **Smart Cart System:** Easily add items to your cart, adjust quantities, and calculate real-time totals.
* **Live Order Tracking:** Track your order's journey from `Placed` ➔ `Preparing` ➔ `Ready` ➔ `Delivered`.
* **Account Management:** Manage your profile, secure authentication, and view your complete order history.

### For Providers (Restaurants/Home Kitchens)
* **Provider Dashboard:** A dedicated space for providers to manage their business operations.
* **Menu Management:** Create, update, and manage your dishes, complete with pricing and image uploads via Cloudinary.
* **Order Fulfillment:** Accept and update the real-time status of incoming orders.
* **Business Profile:** Setup your business name, logo, description, and delivery settings.

### For Administrators
* **Centralized Admin Dashboard:** Comprehensive oversight of the entire FoodHub ecosystem.
* **User Management:** View all registered users, suspend accounts, and manage platform access.
* **Category Control:** Add and manage global food categories.
* **Platform Analytics:** View total orders, revenue metrics, and active provider counts.

---

## 🛠️ Technology Stack

FoodHub uses a modern, strictly-typed monorepo-style architecture separated into two distinct directories:

### Frontend (`/frontend`)
* **Framework:** [Next.js 16 (React 19)](https://nextjs.org/)
* **Styling:** Tailwind CSS 4 & Framer Motion for micro-animations
* **Icons:** Lucide React
* **State Management:** React Context API (AuthContext, CartContext)
* **API Client:** Axios (with cross-domain credential support)
* **Cookies:** `js-cookie` for synchronized Next.js Proxy Middleware authentication.

### Backend (`/backend`)
* **Framework:** Node.js with [Express](https://expressjs.com/)
* **Language:** TypeScript
* **Database ORM:** [Prisma](https://www.prisma.io/)
* **Database Engine:** PostgreSQL
* **Storage:** Cloudinary (for profile and meal images)
* **Authentication:** JWT (JSON Web Tokens) with dual Access and Refresh token rotation.

---

## 🚀 Getting Started

To run FoodHub locally, you will need Node.js and a PostgreSQL database.

### 1. Clone the Repository
```bash
git clone https://github.com/dev-arman-hossain/FoodHub.git
cd FoodHub
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/foodhub?schema=public"
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET="your_super_secret_access_key"
   ACCESS_TOKEN_EXPIRES_IN="1d"
   REFRESH_TOKEN_SECRET="your_super_secret_refresh_key"
   REFRESH_TOKEN_EXPIRES_IN="7d"
   
   # Cloudinary (Optional, for image uploads)
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```
4. Generate the Prisma Client and push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will be running on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be running on `http://localhost:3000`.*

---

## 🌐 Deployment Architecture (Vercel)

FoodHub is optimized for serverless deployment on **Vercel**. 

Since the Frontend and Backend are hosted on different sub-domains, the backend handles cross-domain authentication securely by issuing HTTP-Only cookies. 

To prevent Next.js Middleware route collisions on protected pages (`/orders`, `/admin`, `/provider`), the frontend actively syncs a localized `clientToken` via `js-cookie`. This guarantees reliable route-blocking and seamless navigation for authenticated users on production Vercel domains. 

---

*Designed and Developed for seamless culinary experiences.*
