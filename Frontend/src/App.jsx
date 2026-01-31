import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
// User Pages
import UserHome from './pages/user/Home'
import UserProfile from './pages/user/Profile'
import UserBrowse from './pages/user/Browse'
import ProviderDetailPage from './pages/user/ProviderDetail'
import BookService from './pages/user/BookService'
import MyBookings from './pages/user/MyBookings'
// Provider Pages
import ProviderHome from './pages/provider/Home'
import ProviderProfile from './pages/provider/Profile'
import ProviderMyServices from './pages/provider/MyServices'
import BookingRequests from './pages/provider/BookingRequests'
import ProviderAnalytics from './pages/provider/Analytics'
import './App.css'

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* User Routes */}
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/browse" element={<UserBrowse />} />
        <Route path="/user/bookings" element={<MyBookings />} />
        <Route path="/provider/:id" element={<ProviderDetailPage />} />
        <Route path="/book/:providerId/:serviceId" element={<BookService />} />

        {/* Provider Routes */}
        <Route path="/provider/home" element={<ProviderHome />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />
        <Route path="/provider/services" element={<ProviderMyServices />} />
        <Route path="/provider/bookings" element={<BookingRequests />} />
        <Route path="/provider/analytics" element={<ProviderAnalytics />} />
      </Routes>
    </Router>
  )
}

export default App

