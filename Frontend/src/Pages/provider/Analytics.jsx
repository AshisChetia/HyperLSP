import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaChartLine, FaRupeeSign, FaCalendarCheck, FaStar, FaClock, FaArrowRight } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { bookingAPI } from '../../services/api'

function ProviderAnalytics() {
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await bookingAPI.getProviderStats()
            if (response.success) {
                setStats(response.data)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
            if (error.response?.status === 401) {
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading analytics...</p>
                </div>
            </div>
        )
    }

    // Robust stats destructuring (Local || Production)
    const totalEarnings = stats?.totalEarnings !== undefined ? stats.totalEarnings : (stats?.earnings || 0)
    const completedJobs = stats?.completedJobs || stats?.completed || 0
    const pendingRequests = stats?.pendingRequests || stats?.pending || 0
    const averageRating = stats?.avgRating || 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation */}
            <nav className="bg-slate-900/50 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/provider/home" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 group">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <FaArrowLeft className="text-sm" />
                                </div>
                                <span className="font-medium hidden sm:block">Back to Dashboard</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                        <FaChartLine className="text-purple-400" />
                    </div>
                    Performance Analytics
                </h1>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Total Earnings */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaRupeeSign className="text-emerald-400 text-xl" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg">
                                Total
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-1">Total Earnings</p>
                        <h3 className="text-3xl font-bold text-emerald-400 flex items-center">
                            <FaRupeeSign className="text-lg" />
                            {totalEarnings}
                        </h3>
                    </div>

                    {/* Completed Jobs */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaCalendarCheck className="text-blue-400 text-xl" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-1">Completed Jobs</p>
                        <h3 className="text-3xl font-bold text-blue-400">
                            {completedJobs}
                        </h3>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaStar className="text-amber-400 text-xl" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-1">Average Rating</p>
                        <h3 className="text-3xl font-bold text-amber-400 flex items-center gap-2">
                            {typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0'}
                            <span className="text-lg">★</span>
                        </h3>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaClock className="text-orange-400 text-xl" />
                            </div>
                            <Link to="/provider/bookings" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                View All
                            </Link>
                        </div>
                        <p className="text-slate-400 text-sm mb-1">Pending Requests</p>
                        <h3 className="text-3xl font-bold text-orange-400">
                            {pendingRequests}
                        </h3>
                    </div>
                </div>

                {/* Info Card */}
                <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative">
                        <h2 className="text-2xl font-bold text-white mb-4">Tip for Growth 🚀</h2>
                        <p className="text-purple-100 mb-6 max-w-2xl">
                            Updating your service prices and adding more service categories can help you attract more customers.
                            Keep your ratings high by providing excellent service!
                        </p>
                        <Link
                            to="/provider/services"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 hover:shadow-lg transition-all group"
                        >
                            Manage Services
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProviderAnalytics
