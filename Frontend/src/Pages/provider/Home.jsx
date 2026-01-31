import { Link, useNavigate } from 'react-router-dom'
import { FaBriefcase, FaUser, FaSignOutAlt, FaCalendarAlt, FaChartLine, FaStar, FaRupeeSign, FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa'
import { bookingAPI } from '../../services/api'
import { HiSparkles } from 'react-icons/hi'
import { useEffect, useState } from 'react'

function Home() {
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null)
    const [stats, setStats] = useState({
        totalBookings: 0,
        completedJobs: 0,
        pendingRequests: 0,
        avgRating: 0
    })
    const [recentBookings, setRecentBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            setProvider(JSON.parse(userData))
            fetchDashboardData()
        } else {
            navigate('/login')
        }
    }, [navigate])

    const fetchDashboardData = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                bookingAPI.getProviderStats(),
                bookingAPI.getProviderBookings()
            ])

            if (statsRes.success) {
                setStats(statsRes.data)
            }

            if (bookingsRes.success) {
                // Get 3 most recent bookings
                setRecentBookings(bookingsRes.data.slice(0, 3))
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/provider/profile" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
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
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 mb-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Welcome, {provider?.name || 'Provider'}! 🛠️</h1>
                    <p className="text-orange-100">Manage your services and grow your business</p>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-slate-800">{stats.totalBookings}</div>
                        <p className="text-slate-500">Total Bookings</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-green-600">{stats.completedJobs}</div>
                        <p className="text-slate-500">Completed Jobs</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-orange-600">{stats.pendingRequests}</div>
                        <p className="text-slate-500">Pending Requests</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-1 text-3xl font-bold text-yellow-500">
                            <FaStar /> {typeof stats.avgRating === 'number' ? stats.avgRating.toFixed(1) : '0.0'}
                        </div>
                        <p className="text-slate-500">Average Rating</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Link to="/provider/services" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                            <FaBriefcase className="text-orange-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Manage Services</h3>
                        <p className="text-slate-500">Add or edit your service offerings</p>
                    </Link>

                    <Link to="/provider/bookings" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <FaCalendarAlt className="text-green-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">View Bookings</h3>
                        <p className="text-slate-500">See upcoming and past bookings</p>
                    </Link>

                    <Link to="/provider/analytics" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <FaChartLine className="text-purple-500 text-xl" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Analytics</h3>
                        <p className="text-slate-500">Track your performance and earnings</p>
                    </Link>
                </div>

                {/* Recent Bookings Placeholder */}
                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Recent Booking Requests</h2>
                        <Link to="/provider/bookings" className="text-orange-500 font-medium hover:text-orange-600">
                            View All
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p>No booking requests yet</p>
                            <p className="text-sm mt-2">Complete your profile to start receiving bookings!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-slate-100 text-slate-600`}>
                                            {booking.userId?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{booking.serviceId?.name}</h3>
                                            <p className="text-sm text-slate-500">{booking.userId?.name} • {new Date(booking.preferredDate).toLocaleDateString()}</p>
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
