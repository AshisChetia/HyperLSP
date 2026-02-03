import { Link, useNavigate } from 'react-router-dom'
import { FaBriefcase, FaUser, FaSignOutAlt, FaCalendarAlt, FaChartLine, FaStar, FaRupeeSign, FaCheck, FaTimes, FaMapMarkerAlt, FaArrowRight, FaClock } from 'react-icons/fa'
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

    const statusConfig = {
        pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
        accepted: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
        rejected: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
        completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
        cancelled: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' }
    }

    // Robust stats destructuring (Local || Production)
    const totalBookings = stats.totalBookings || 0
    const completedJobs = stats.completedJobs || stats.completed || 0
    const pendingRequests = stats.pendingRequests || stats.pending || 0
    // Fix: Ensure we display earnings correctly even if 0
    const totalEarnings = stats.totalEarnings !== undefined ? stats.totalEarnings : (stats.earnings || 0)
    const averageRating = stats.avgRating || 0

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation */}
            <nav className="bg-slate-900/50 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                            <span className="hidden sm:inline-flex px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs font-medium text-orange-400">
                                Provider
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/provider/profile" className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                                <FaUser />
                                <span className="font-medium hidden sm:inline">Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 font-medium"
                            >
                                <FaSignOutAlt />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className={`relative pt-32 pb-12 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 lg:p-12 mb-8 shadow-2xl shadow-orange-500/20">
                        {/* ... background blobs ... */}
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

                        <div className="relative z-10">
                            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                                Welcome back, {provider?.name?.split(' ')[0]}! 🛠️
                            </h1>
                            <p className="text-orange-100 text-lg max-w-2xl">
                                Manage your services and grow your business
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Total Bookings */}
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:bg-slate-800 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaCalendarAlt className="text-blue-400 text-xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{totalBookings}</h3>
                            <p className="text-slate-400 text-sm">Total Bookings</p>
                        </div>

                        {/* Completed Jobs */}
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:bg-slate-800 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaCheckCircle className="text-emerald-400 text-xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{completedJobs}</h3>
                            <p className="text-slate-400 text-sm">Completed Jobs</p>
                        </div>

                        {/* Pending Requests */}
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:bg-slate-800 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaClock className="text-orange-400 text-xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{pendingRequests}</h3>
                            <p className="text-slate-400 text-sm">Pending Requests</p>
                        </div>

                        {/* Average Rating */}
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl hover:bg-slate-800 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FaStar className="text-amber-400 text-xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0'}</h3>
                            <p className="text-slate-400 text-sm">Average Rating</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Link to="/provider/services" className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl hover:bg-slate-800 transition-all group">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">💼</div>
                            <h3 className="text-lg font-bold text-white mb-2">Manage Services</h3>
                            <p className="text-slate-400 text-sm">Add or edit your service offerings</p>
                        </Link>
                        <Link to="/provider/bookings" className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl hover:bg-slate-800 transition-all group">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">📅</div>
                            <h3 className="text-lg font-bold text-white mb-2">View Bookings</h3>
                            <p className="text-slate-400 text-sm">See upcoming and past bookings</p>
                        </Link>
                        <Link to="/provider/analytics" className="bg-slate-800/50 border border-white/5 p-6 rounded-2xl hover:bg-slate-800 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">📈</div>
                            <h3 className="text-lg font-bold text-white mb-2">Analytics</h3>
                            <p className="text-slate-400 text-sm">Track your performance and earnings</p>
                        </Link>
                    </div>

                    {/* Recent Requests */}
                    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Recent Booking Requests</h2>
                            <Link to="/provider/bookings" className="text-orange-400 hover:text-orange-300 flex items-center gap-2 text-sm font-semibold transition-colors">
                                View All <FaArrowRight />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentBookings.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    No recent booking requests
                                </div>
                            ) : (
                                recentBookings.map((booking) => {
                                    // Robust data handling
                                    const user = booking.userId || booking.user || {}
                                    const service = booking.serviceId || booking.service || {}
                                    const date = booking.preferredDate || booking.scheduledDate

                                    return (
                                        <div key={booking._id} className="bg-slate-900/50 rounded-xl p-4 flex items-center justify-between group hover:bg-slate-900 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{user.name || 'Unknown User'}</h4>
                                                    <p className="text-slate-400 text-sm">
                                                        {service.name || 'Service'} • {date ? new Date(date).toLocaleDateString() : 'Invalid Date'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {booking.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <FaClock className="text-orange-400" />
                                                    </div>
                                                )}
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold
                                                ${booking.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                                                        booking.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
