import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaChartLine, FaRupeeSign, FaCalendarCheck, FaStar, FaClock } from 'react-icons/fa'
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading analytics...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/provider/home" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <FaArrowLeft />
                                <span className="font-medium">Back to Dashboard</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                    <FaChartLine className="text-purple-500" />
                    Performance Analytics
                </h1>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Earnings */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-green-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <FaRupeeSign className="text-green-600 text-xl" />
                            </div>
                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                Total
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm mb-1">Total Earnings</p>
                        <h3 className="text-3xl font-bold text-slate-800 flex items-center">
                            <FaRupeeSign className="text-lg" />
                            {stats?.totalEarnings || 0}
                        </h3>
                    </div>

                    {/* Completed Jobs */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-blue-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FaCalendarCheck className="text-blue-600 text-xl" />
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-1">Completed Jobs</p>
                        <h3 className="text-3xl font-bold text-slate-800">
                            {stats?.completedJobs || 0}
                        </h3>
                    </div>

                    {/* Average Rating */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-yellow-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <FaStar className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-1">Average Rating</p>
                        <h3 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                            {stats?.avgRating ? stats.avgRating.toFixed(1) : '0.0'}
                            <span className="text-lg text-yellow-500">★</span>
                        </h3>
                    </div>

                    {/* Pending Requests */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-orange-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <FaClock className="text-orange-600 text-xl" />
                            </div>
                            <Link to="/provider/bookings" className="text-xs font-semibold text-blue-500 hover:underline">
                                View All
                            </Link>
                        </div>
                        <p className="text-slate-500 text-sm mb-1">Pending Requests</p>
                        <h3 className="text-3xl font-bold text-slate-800">
                            {stats?.pendingRequests || 0}
                        </h3>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-8 text-white shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Tip for Growth 🚀</h2>
                    <p className="text-purple-100 mb-6 max-w-2xl">
                        Updating your service prices and adding more service categories can help you attract more customers.
                        Keep your ratings high by providing excellent service!
                    </p>
                    <Link
                        to="/provider/services"
                        className="inline-block px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors"
                    >
                        Manage Services
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProviderAnalytics
