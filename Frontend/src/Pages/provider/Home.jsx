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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-8 mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Welcome back, {provider?.name || 'Provider'}! 🛠️
                        </h1>
                        <p className="text-orange-100 text-lg">Manage your services and grow your business</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaCalendarAlt className="text-blue-400 text-xl" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stats.totalBookings}</div>
                        <p className="text-slate-400 text-sm">Total Bookings</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaCheck className="text-emerald-400 text-xl" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.completedJobs}</div>
                        <p className="text-slate-400 text-sm">Completed Jobs</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaClock className="text-orange-400 text-xl" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-orange-400 mb-1">{stats.pendingRequests}</div>
                        <p className="text-slate-400 text-sm">Pending Requests</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaStar className="text-amber-400 text-xl" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-3xl font-bold text-amber-400 mb-1">
                            {typeof stats.avgRating === 'number' ? stats.avgRating.toFixed(1) : '0.0'}
                        </div>
                        <p className="text-slate-400 text-sm">Average Rating</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <Link to="/provider/services" className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FaBriefcase className="text-orange-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            Manage Services
                            <FaArrowRight className="text-sm text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-slate-400 text-sm">Add or edit your service offerings</p>
                    </Link>

                    <Link to="/provider/bookings" className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FaCalendarAlt className="text-emerald-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            View Bookings
                            <FaArrowRight className="text-sm text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-slate-400 text-sm">See upcoming and past bookings</p>
                    </Link>

                    <Link to="/provider/analytics" className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <FaChartLine className="text-purple-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            Analytics
                            <FaArrowRight className="text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-slate-400 text-sm">Track your performance and earnings</p>
                    </Link>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Booking Requests</h2>
                        <Link to="/provider/bookings" className="flex items-center gap-2 text-orange-400 font-medium hover:text-orange-300 transition-colors group">
                            View All
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">📋</span>
                            </div>
                            <p className="text-slate-400 mb-2">No booking requests yet</p>
                            <p className="text-sm text-slate-500">Complete your profile to start receiving bookings!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-lg font-bold text-white">
                                            {booking.userId?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{booking.serviceId?.name}</h3>
                                            <p className="text-sm text-slate-400">{booking.userId?.name} • {new Date(booking.preferredDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 justify-between lg:justify-end flex-1">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <FaMapMarkerAlt className="text-rose-400" />
                                            <span className="truncate max-w-[150px]">{booking.serviceAddress}</span>
                                        </div>

                                        <div className="font-bold text-emerald-400 flex items-center">
                                            <FaRupeeSign className="text-sm" />
                                            {booking.proposedPrice}
                                        </div>

                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border ${statusConfig[booking.status]?.bg} ${statusConfig[booking.status]?.text} ${statusConfig[booking.status]?.border}`}>
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
