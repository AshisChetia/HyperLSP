import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaUser, FaSignOutAlt, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { useEffect, useState } from 'react'

function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchPincode, setSearchPincode] = useState('')

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            setSearchPincode(parsed.pincode || '')
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
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
                    <div className="text-center py-12 text-slate-400">
                        <p>No recent activity yet</p>
                        <p className="text-sm mt-2">Book a service to get started!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
