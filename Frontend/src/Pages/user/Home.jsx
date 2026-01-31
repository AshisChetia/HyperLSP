import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaUser, FaSignOutAlt, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { bookingAPI } from '../../services/api'

function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchPincode, setSearchPincode] = useState('')
    const [recentBookings, setRecentBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            setSearchPincode(parsed.pincode || '')
            fetchRecentBookings()
        } else {
            navigate('/login')
        }
    }, [navigate])

    const fetchRecentBookings = async () => {
        try {
            const response = await bookingAPI.getUserBookings()
            if (response.success) {
                setRecentBookings(response.data.slice(0, 3))
            }
        } catch (error) {
            console.error('Error fetching recent bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        navigate('/login')
    }

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        accepted: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        completed: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-gray-100 text-gray-700'
    }

    const handleSearch = (e) => {
        e.preventDefault()
        // Navigate to browse page with search params
        const params = new URLSearchParams()
        if (searchQuery) params.set('q', searchQuery)
        if (searchPincode) params.set('pincode', searchPincode)
        navigate(`/user/browse?${params.toString()}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/user/profile" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <FaUser />
                                <span className="font-medium">Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 mb-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
                    <p className="text-blue-100">Find and book local services near you</p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaSearch className="text-blue-500" />
                        Search Services
                    </h2>
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="What service do you need? (e.g., Plumbing)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all"
                        />
                        <input
                            type="text"
                            placeholder="Your pincode"
                            value={searchPincode}
                            onChange={(e) => setSearchPincode(e.target.value)}
                            className="w-full md:w-48 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Link to="/user/browse" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <FaSearch className="text-blue-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Browse Services</h3>
                        <p className="text-slate-500">Explore available services in your area</p>
                    </Link>

                    <Link to="/user/bookings" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <FaCalendarAlt className="text-green-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">My Bookings</h3>
                        <p className="text-slate-500">View and manage your service bookings</p>
                    </Link>

                    <Link to="/user/browse" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <FaMapMarkerAlt className="text-purple-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Nearby Providers</h3>
                        <p className="text-slate-500">Find service providers near you</p>
                    </Link>
                </div>

                {/* Recent Activity Placeholder */}
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
                        <Link to="/user/bookings" className="text-blue-500 font-medium hover:text-blue-600">
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p>No recent activity yet</p>
                            <p className="text-sm mt-2">Book a service to get started!</p>
                            <Link to="/user/browse" className="inline-block mt-4 px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
                                Browse Services
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-slate-100 text-slate-600`}>
                                            {booking.serviceId?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{booking.serviceId?.name}</h3>
                                            <p className="text-sm text-slate-500">
                                                Provider: {booking.providerId?.name} • {new Date(booking.preferredDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 justify-between md:justify-end flex-1">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <FaMapMarkerAlt className="text-red-400" />
                                            <span className="truncate max-w-[150px]">{booking.serviceAddress}</span>
                                        </div>

                                        <div className="font-bold text-slate-800 flex items-center">
                                            <FaRupeeSign />{booking.proposedPrice}
                                        </div>

                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
