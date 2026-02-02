import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './Pages/Landing'
import Services from './Pages/Services'
import Contact from './Pages/Contact'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import { Toaster } from 'react-hot-toast'
// User Pages
import UserHome from './Pages/user/Home'
import UserProfile from './Pages/user/Profile'
import UserBrowse from './Pages/user/Browse'
import ProviderDetailPage from './Pages/user/ProviderDetail'
import BookService from './Pages/user/BookService'
import MyBookings from './Pages/user/MyBookings'
// Provider Pages
import ProviderHome from './Pages/provider/Home'
import ProviderProfile from './Pages/provider/Profile'
import ProviderMyServices from './Pages/provider/MyServices'
import BookingRequests from './Pages/provider/BookingRequests'
import ProviderAnalytics from './Pages/provider/Analytics'
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

