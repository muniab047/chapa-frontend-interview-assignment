# Chapa Frontend Developer Test - Payment Dashboard

A comprehensive role-based dashboard single-page application (SPA) built with Next.js for a fictional Payment Service Provider platform. This application demonstrates frontend skills while integrating both mock and live data experiences.

## 🚀 Live Demo

**Hosted Application**: ['']('')

## 🔑 Demo Accounts

Use these credentials to test different roles:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **User** | user@chapa.co | password123 | Wallet balance, transactions, payment initiation |
| **Admin** | admin@chapa.co | password123 | User management, payment summaries, bank list |
| **Super Admin** | superadmin@chapa.co | password123 | All admin features + admin management + system stats |

## 🎯 Features by Role

### User Dashboard
- ✅ Wallet balance display (mock value: 15,750.50 ETB)
- ✅ Recent transactions list (hardcoded mock data)
- ✅ Payment initiation form with UI feedback
- ✅ **API Integration**: Initialize Payment endpoint
- ✅ **API Integration**: Verify Transaction endpoint

### Admin Dashboard
- ✅ User list with activation/deactivation toggles
- ✅ Payment summaries per user in table format
- ✅ **API Integration**: Get Banks endpoint for supported banks
- ✅ Real-time status updates with loading states

### Super Admin Dashboard
- ✅ All Admin functionalities inherited
- ✅ Add/remove Admin users with form validation
- ✅ System-wide statistics dashboard
- ✅ **API Integration**: Transfer verification functionality
- ✅ Advanced admin management capabilities

## 🔌 Chapa API Integration

This application integrates **3 real Chapa API endpoints**:

### 1. Initialize Payment (`https://api.chapa.co/v1/transaction/initialize`)
- **Used in**: User Dashboard
- **Purpose**: Initiate payment transactions
- **Implementation**: `services/chapaService.ts` - `initializePayment()`
- **Features**: Form validation, loading states, success/error handling

### 2. Verify Transaction (`https://api.chapa.co/v1/transaction/verify/<tx_ref>`)
- **Used in**: User Dashboard
- **Purpose**: Check transaction status
- **Implementation**: `services/chapaService.ts` - `verifyTransaction()`
- **Features**: verification with loading indicators

### 3. Get Banks (`/banks`)
- **Used in**: Admin Dashboard
- **Purpose**: Display supported banks
- **Implementation**: `https://api.chapa.co/v1/banks`
- **Features**: Paginated display, refresh functionality, error handling


## 🛠️ Technical Implementation

### Architecture
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom color scheme (#7DC400 primary)
- **State Management**: React Context for authentication
- **UI Components**: shadcn/ui component library
- **API Layer**: Custom service class with error handling

### Key Features
- 🔐 **Role-based authentication** with persistent sessions
- 🎨 **Interactive UI** with loading states and animations
- 📱 **Responsive design** for all screen sizes
- ⚡ **Mock backend simulation** using setTimeout and local state
- 🚨 **Comprehensive error handling** with proper handling toast
- ⚡ **Dark Mode**: Theme switching capability


### Folder Structure
\`\`\`
├── app/                    # Next.js app directory
├── components/
│   ├── dashboards/         # Role-specific dashboard components
│   ├── layout/            # Layout components
│   ├── ui/                # Reusable UI components
│   └── LoginForm.tsx      # Authentication component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state management
├── services/              # API service layer
│   └── chapaService.ts    # Chapa API integration
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/chapa-frontend-interview-assignment.git
   cd chapa-frontend-interview-assignment/payment-service-provider-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`
  `

3. **Environment Setup** (Optional)
   \`\`\`bash
   # Change .env.local file to .env
   # Get your secret key from [Chapa](https://chapa.co/)
   CHAPA_SECRET_KEY=your_chapa_secret_key_here
   \`\`\`
   

4. **Run the development server**
   \`\`\`bash
   pnpm run
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Testing the Application

1. **Login with demo accounts** using the credentials above
2. **User Role**: Test payment initialization and transaction verification
3. **Admin Role**: Manage users and view supported banks
4. **Super Admin Role**: Add/remove admins and transfer verification

## 🔧 API Integration Notes

### Error Handling Strategy
- **Graceful Degradation**: Toast notifications
- **Loading States**: Visual feedback during API requests
- **User Feedback**: Toast notifications for success/error states

### Mock Data Implementation
- **Simulated Delays**: setTimeout used to simulate network latency
- **State Persistence**: Local storage for authentication sessions

### Security Considerations
- **CORS**: Handled by Next.js API routes in production

## 🎨 Design System

### Color Palette
- **Primary**: #7DC400 (Chapa Green)
- **Background**: White (#FFFFFF)
- **Secondary**: Gray scale variants
- **Status Colors**: Green (success), Yellow (pending), Red (error)

### Interactive Elements
- **Hover Effects**: Smooth transitions on buttons and cards
- **Loading States**: Spinners and skeleton loaders
- **Animations**: Subtle fade-ins and slide transitions
- **Responsive**: Mobile-first design approach

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full feature set for desktop (1024px+)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with all three role types
- [ ] Payment initialization (User)
- [ ] Transaction verification (User)
- [ ] User management (Admin)
- [ ] Bank list loading (Admin)
- [ ] Admin management (Super Admin)
- [ ] Transfer verification functionality (Super Admin)
- [ ] Responsive design on different screen sizes
- [ ] Error handling with network failures

## 🚀 Deployment

The application is configured for easy deployment on Vercel:

1. **Connect GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Build Commands
\`\`\`bash
pnpm run build    # Production build
pnpm run start    # Start production server
pnpm run lint     # Code linting
\`\`\`


## 📄 License

This project is created for the Chapa Frontend Developer interview assignment.

---

**Built with ❤️ using Next.js, Tailwind CSS, and the Chapa API**
