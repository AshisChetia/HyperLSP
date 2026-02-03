import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaUser, FaSignOutAlt, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign, FaArrowRight, FaClock, FaStar, FaChevronRight } from 'react-icons/fa'
import { HiSparkles, HiLightningBolt, HiLocationMarker, HiCalendar } from 'react-icons/hi'
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

    const statusConfig = {
        pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: '⏳' },
        accepted: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: '✓' },
        rejected: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', icon: '✕' },
        completed: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', icon: '★' },
        cancelled: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', icon: '–' }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (searchQuery) params.set('q', searchQuery)
        if (searchPincode) params.set('pincode', searchPincode)
        navigate(`/user/browse?${params.toString()}`)
    }

    const quickServices = [
        { name: 'Plumbing', icon: '🔧', color: 'from-blue-500 to-cyan-400' },
        { name: 'Electrical', icon: '⚡', color: 'from-amber-500 to-orange-400' },
        { name: 'Cleaning', icon: '✨', color: 'from-emerald-500 to-teal-400' },
        { name: 'Painting', icon: '🎨', color: 'from-purple-500 to-pink-400' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="bg-slate-900/50 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to="/user/profile" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                                    <FaUser className="text-sm" />
                                </div>
                                <span className="font-medium hidden sm:block">Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all duration-300 font-medium"
                            >
                                <FaSignOutAlt />
                                <span className="hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Welcome Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-8 md:p-12 mb-8 shadow-2xl shadow-blue-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium flex items-center gap-2">
                                <HiLightningBolt className="text-yellow-300" />
                                Welcome back
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
                        </h1>
                        <p className="text-blue-100 text-lg max-w-xl">
                            Find trusted local service providers and book instantly
                        </p>
                    </div>
                </div>

                {/* Search Section */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl"></div>
                    <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="What service do you need?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                            />
                        </div>
                        <div className="w-full md:w-48 relative group">
                            <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={searchPincode}
                                onChange={(e) => setSearchPincode(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Search
                            <FaArrowRight className="text-sm" />
                        </button>
                    </form>
                </div>

                {/* Quick Service Categories */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <HiLightningBolt className="text-yellow-400" />
                        Quick Services
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickServices.map((service) => (
                            <Link
                                key={service.name}
                                to={`/user/browse?q=${service.name}`}
                                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {service.icon}
                                </div>
                                <h3 className="font-semibold text-white">{service.name}</h3>
                                <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Link to="/user/browse" className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                                <FaSearch className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Browse Services</h3>
                            <p className="text-slate-400">Explore all available services in your area</p>
                        </div>
                    </Link>

                    <Link to="/user/bookings" className="group relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                                <FaCalendarAlt className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">My Bookings</h3>
                            <p className="text-slate-400">View and manage your service bookings</p>
                        </div>
                    </Link>

                    <Link to="/user/browse" className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                                <FaMapMarkerAlt className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Nearby Providers</h3>
                            <p className="text-slate-400">Find trusted providers near you</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                                <HiCalendar className="text-slate-300" />
                            </div>
                            Recent Activity
                        </h2>
                        <Link to="/user/bookings" className="flex items-center gap-2 text-blue-400 font-medium hover:text-blue-300 transition-colors group">
                            View All
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                                <p className="mt-4 text-slate-400">Loading your activities...</p>
                            </div>
                        ) : recentBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FaCalendarAlt className="text-3xl text-slate-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No recent activity</h3>
                                <p className="text-slate-400 mb-6">Book a service to see your activity here</p>
                                <Link to="/user/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                                    Browse Services
                                    <FaArrowRight className="text-sm" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentBookings.map((booking) => {
                                    const service = booking.serviceId || booking.service || {}
                                    const provider = booking.providerId || booking.provider || {}

                                    return (
                                        <div key={booking._id} className="group bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:bg-slate-800 hover:border-white/10 transition-all duration-300">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-xl font-bold text-blue-400 border border-blue-500/20">
                                                        {service?.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{service?.name || 'Service Name Unavailable'}</h3>
                                                        <div className="flex items-center gap-3 text-sm text-slate-400">
                                                            <span>{provider?.name || 'Provider Unavailable'}</span>
                                                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                            <span className="flex items-center gap-1">
                                                                <FaClock className="text-xs" />
                                                                {new Date(booking.preferredDate || booking.scheduledDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 justify-between md:justify-end">
                                                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                                                        <FaMapMarkerAlt className="text-rose-400" />
                                                        <span className="truncate max-w-[120px]">{booking.serviceAddress || booking.address}</span>
                                                    </div>

                                                    <div className="font-bold text-white flex items-center">
                                                        <FaRupeeSign className="text-emerald-400" />
                                                        <span>{booking.proposedPrice || booking.totalAmount}</span>
                                                    </div>

                                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${statusConfig[booking.status]?.bg} ${statusConfig[booking.status]?.text} border ${statusConfig[booking.status]?.border}`}>
                                                        {statusConfig[booking.status]?.icon} {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home
