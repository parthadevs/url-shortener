# ShortCash - Premium URL Shortener

ShortCash is a full-stack, premium URL shortening service built with modern technologies. It allows users to transform long links into short, memorable ones while providing features like link monetization, detailed analytics, and a premium ad-free experience.

## 🚀 Features

- **Quick Shortening**: Instantly shorten any long URL.
- **User Dashboard**: Manage all your shortened links in one place.
- **Analytics**: Track clicks, geographic data, and performance metrics for your links.
- **Monetization**: Earn rewards for link traffic with built-in ad integration.
- **Premium Plan**: Offer an ad-free experience and custom branded links.
- **Secure Architecture**: Link safety checks and robust authentication.
- **Responsive Design**: Beautiful, modern UI that works on all devices.

## 🛠 Tech Stack

### Frontend (`/web-app`)
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: Custom JWT-based with Cookies & Context API
- **Charts**: [Recharts](https://recharts.org/) & [Tremor](https://tremor.so/)
- **State Management**: React Hooks & Context API

### Backend (`/backend`)
- **Framework**: [NestJS 11+](https://nestjs.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Passport.js](https://www.passportjs.org/) (JWT Strategy)
- **Validation**: [Class-validator](https://github.com/typestack/class-validator)
- **Security**: Bcrypt for password hashing & Rate Limiting

## 📁 Project Structure

```text
.
├── backend/            # NestJS API & Prisma Schema
└── web-app/            # Next.js Frontend
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database (for Prisma)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/parthadevs/url-shortener.git
   cd url-shortener
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env file and add your DATABASE_URL and JWT_SECRET
   npx prisma migrate dev
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../web-app
   npm install
   # Create .env.local and add NEXT_PUBLIC_API_URL and NEXTAUTH_SECRET
   npm run dev
   ```

## 🧪 Development

### Running Locally
You can run both services simultaneously in separate terminals:
- **Backend**: `npm run start:dev` (runs on port 3001 by default)
- **Frontend**: `npm run dev` (runs on port 3000)

## 📄 License
This project is [UNLICENSED](LICENSE).

---
Built with ❤️ by the ShortCash Team.
