# 🎂 Cake Hamper Sisters - Full Stack Cake Bakery E-Commerce Website
**Owner: Garima Bothra | Jaipur, Rajasthan**

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# .env mein fill karein:
# - MONGO_URI (MongoDB Atlas ya local)
# - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
# - EMAIL_USER, EMAIL_PASS (Gmail)
# - ADMIN_EMAIL (aapka email)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin Account
MongoDB mein ek user create karein aur uski role `admin` karein:
```js
db.users.updateOne({email: "aapka@email.com"}, {$set: {role: "admin"}})
```

## 📱 Pages

### Public
| Route | Page |
|-------|------|
| `/` | Home - Events banner, offers, new cakes, all cakes |
| `/product/:slug` | Cake detail, related cakes, payment |
| `/category/:slug` | Category (flavor / design) wise cakes |
| `/search?q=` | Search results |
| `/contact` | Contact - Custom Cake Order (photo ke saath) & Issue report |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with payment methods |
| `/login` | Login / Register |
| `/developer` | Developer info page |

### Admin (`/admin/*`)
| Route | Page |
|-------|------|
| `/admin` | Dashboard with all charts |
| `/admin/products` | Cakes list + upload |
| `/admin/categories` | Categories (flavor/design) + create |
| `/admin/orders` | All orders + status update + notification |
| `/admin/contacts` | Custom Cake Orders (with reference photo) |
| `/admin/issues` | Customer issues |
| `/admin/offers` | Special occasion offers (Diwali, Holi, Birthday, New Year) |
| `/admin/stats` | Full statistics & graphs |

## 🔔 Admin Notification Service
- Jab bhi koi naya order ya custom cake request aata hai, backend admin ko email bhejta hai (`ADMIN_EMAIL`).
- Admin panel har ~20 second mein `/api/notifications/summary` ko poll karta hai aur top bar mein bell icon par live badge dikhata hai.
- Naya order/request aane par browser push notification bhi trigger hoti hai (agar browser permission enabled hai).
- Admin jab bhi login karta hai, system check karta hai ki browser notifications enable hain ya nahi — agar disable hain toh ek popup dikhta hai jo enable karne ke liye kehta hai.

## 🎨 Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + GSAP + Recharts
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Images:** Cloudinary
- **Email:** Nodemailer (Gmail)
- **Auth:** JWT
- **Payment:** Google Pay, Paytm, BHIM UPI, Credit Card, COD (UI only - integrate payment gateway separately)

## 📦 Categories
Flavors (1, 2, 3...): Chocolate, Vanilla, Red Velvet, Butterscotch, Black Forest, Pineapple
Designs (1, 2, 3...): Birthday Cakes, Wedding Cakes, Photo Cakes, Theme Cakes, Cupcakes, Pastries

## 💳 Payment Methods
- Google Pay
- Paytm
- BHIM UPI
- Credit / Debit Card
- Cash on Delivery
