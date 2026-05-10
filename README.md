# ProntoCorso - Italian Language Learning Platform

A modern, full-featured web application for learning Italian language through interactive lessons, practice exercises, and AI-powered learning tools.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Authentication & User Roles](#authentication--user-roles)
- [Key Features](#key-features)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

ProntoCorso is a comprehensive Italian language learning platform that provides users with an immersive learning experience through various interactive features. The platform supports multiple user roles (Students, Admins, Support Managers) and offers personalized learning paths, progress tracking, and AI-powered study planning.

## ✨ Features

### For Students
- **Interactive Learning Modules**
  - Reading Practice with AI feedback
  - Listening Exercises with audio playback
  - Speaking Practice with voice recognition
  - Writing Practice with AI evaluation
- **Study Tools**
  - Flashcard decks for vocabulary building
  - AI-powered Study Planner
  - Progress tracking and analytics
  - Leaderboard for competitive learning
- **Account Management**
  - User profile and settings
  - Subscription management
  - Support ticket system
  - Privacy and security settings

### For Administrators
- **User Management**
  - User overview and analytics
  - User details and activity tracking
  - Subscription management
- **Content Management**
  - Lesson creation and management
  - Category organization
  - Flashcard deck management
  - Phrase of the Day management
- **Platform Administration**
  - Analytics dashboard
  - Support ticket management
  - Platform settings
  - Branding customization
  - Notification settings

## 🛠 Tech Stack

### Core Technologies
- **React 18.3.1** - UI library
- **TypeScript 5.7.2** - Type-safe JavaScript
- **Vite 6.2.0** - Build tool and dev server
- **React Router 7.3.0** - Client-side routing

### State Management
- **Redux Toolkit 2.6.1** - State management
- **React Redux 9.2.0** - React bindings for Redux

### UI & Styling
- **Tailwind CSS 4.1.15** - Utility-first CSS framework
- **Framer Motion 12.23.26** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **AOS (Animate On Scroll)** - Scroll animations

### Forms & Validation
- **React Hook Form 7.54.2** - Form management
- **Zod 3.24.2** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Additional Libraries
- **Axios 1.8.2** - HTTP client
- **React Hot Toast 2.6.0** - Toast notifications
- **SweetAlert2 11.26.4** - Beautiful alerts
- **React Player 3.3.3** - Media player
- **Recharts 3.2.1** - Chart library
- **js-cookie 3.0.5** - Cookie management
- **@theme-toggles/react** - Theme toggle components

## 📁 Project Structure

```
cheesuschrusty-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, SVGs, and media files
│   ├── components/        # React components
│   │   ├── AdminDashbord/ # Admin dashboard components
│   │   ├── Athontication copy/ # Authentication components
│   │   ├── LanguageToggle/ # Language switching
│   │   ├── ThemeToggle/   # Dark/Light theme
│   │   └── UserDashbord/  # User dashboard components
│   ├── hooks/             # Custom React hooks
│   ├── Layout/            # Layout components
│   │   ├── AdminLayout/   # Admin layout
│   │   ├── UserLayout/    # User layout
│   │   └── FreeUserLayout/ # Free user layout
│   ├── pages/             # Page components
│   ├── redux/             # Redux store and slices
│   │   ├── features/      # Feature-based API slices
│   │   └── hooks/         # Redux hooks
│   ├── routes/            # Route configuration
│   ├── store/             # Redux store setup
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── .github/               # GitHub workflows
├── Dockerfile             # Docker configuration
├── compose.yaml           # Docker Compose config
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite configuration
└── tailwind.config.js     # Tailwind CSS config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cheesuschrusty-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with necessary API endpoints and configuration:
   ```env
   VITE_API_BASE_URL=your_api_url_here
   # Add other environment variables as needed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📜 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint
- **`npm start`** - Start production server (port 4173)

## 🔐 Authentication & User Roles

The platform supports three main user roles:

### 1. **User (Student)**
- Access to learning modules
- Practice exercises (Reading, Listening, Speaking, Writing)
- Flashcards and study planner
- Progress tracking
- Subscription management

### 2. **Admin**
- Full platform access
- User management
- Content management
- Analytics and reporting
- Platform settings

### 3. **Support Manager**
- User support access
- Ticket management
- Limited admin features

### Authentication Flow
- **Sign Up** - New user registration with email verification
- **Login** - Email/password authentication
- **Forgot Password** - Password reset via email code
- **Protected Routes** - Role-based access control

## 🎨 Key Features

### Theme Support
- **Dark Mode** - Full dark theme support
- **Light Mode** - Clean light theme
- **System Preference** - Automatic theme detection
- **Theme Persistence** - Remembers user preference

### Internationalization
- **Multi-language Support** - Google Translate integration
- **Language Toggle** - Switch between languages
- **RTL Support** - Right-to-left language support

### Responsive Design
- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Responsive tablet layouts
- **Desktop Optimized** - Full desktop experience
- **Breakpoint System** - Tailwind responsive utilities

### AI-Powered Features
- **AI Study Planner** - Personalized study plans
- **AI Feedback** - Intelligent practice feedback
- **Performance Analytics** - AI-driven insights

## 🔧 Environment Setup

### Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run linter
npm run lint
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Using Dockerfile
```bash
# Build image
docker build -t prontocorso-frontend .

# Run container
docker run -p 4173:4173 prontocorso-frontend
```

## 📦 Deployment

The project is configured for deployment on:
- **Vercel** (via `vercel.json`)
- **Netlify** (via `public/_redirects`)
- **Docker** (via `Dockerfile` and `compose.yaml`)

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Build
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is private and proprietary.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔗 Related Links

- **API Documentation** - [Link to API docs]
- **Design System** - [Link to design system]
- **Project Wiki** - [Link to wiki]

---

**Built with ❤️ for Italian language learners**
