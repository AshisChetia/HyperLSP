import { Link, useNavigate } from 'react-router-dom'
import { FaBriefcase, FaUser, FaSignOutAlt, FaCalendarAlt, FaChartLine, FaStar } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { useEffect, useState } from 'react'

function Home() {
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            setProvider(JSON.parse(userData))
        } else {
            navigate('/login')
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        navigate('/login')
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
                        <div className="text-3xl font-bold text-slate-800">0</div>
                        <p className="text-slate-500">Total Bookings</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <p className="text-slate-500">Completed Jobs</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-3xl font-bold text-orange-600">0</div>
                        <p className="text-slate-500">Pending Requests</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-1 text-3xl font-bold text-yellow-500">
                            <FaStar /> 0.0
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
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Booking Requests</h2>
                    <div className="text-center py-12 text-slate-400">
                        <p>No booking requests yet</p>
                        <p className="text-sm mt-2">Complete your profile to start receiving bookings!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
