import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaShoppingCart, FaToolbox } from 'react-icons/fa'
import { authAPI } from '../services/api'

function Login() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('user')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            let response
            if (activeTab === 'user') {
                response = await authAPI.loginUser(formData)
            } else {
                response = await authAPI.loginProvider(formData)
            }

            if (response.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data))
                localStorage.setItem('role', response.data.role)

                // Navigate to appropriate home page
                if (activeTab === 'user') {
                    navigate('/user/home')
                } else {
                    navigate('/provider/home')
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-orange-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                            HyperLSP
                        </h1>
                    </Link>
                    <p className="text-slate-600 mt-2 text-lg">Welcome back! Sign in to continue</p>
                </div>

                {/* Main Container */}
                <div className="w-full max-w-lg">
                    {/* Tab Selector */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('user')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${activeTab === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white/70 text-slate-600 hover:bg-white hover:shadow-lg backdrop-blur-sm border border-white/50'
                                }`}
                        >
                            <FaShoppingCart className="text-xl" />
                            User Login
                        </button>
                        <button
                            onClick={() => setActiveTab('provider')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${activeTab === 'provider'
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                                : 'bg-white/70 text-slate-600 hover:bg-white hover:shadow-lg backdrop-blur-sm border border-white/50'
                                }`}
                        >
                            <FaToolbox className="text-xl" />
                            Provider Login
                        </button>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-white/50">
                        {/* Card Header */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className={`p-4 rounded-2xl ${activeTab === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                : 'bg-gradient-to-br from-orange-500 to-amber-500'
                                }`}>
                                {activeTab === 'user' ? (
                                    <FaShoppingCart className="text-3xl text-white" />
                                ) : (
                                    <FaToolbox className="text-3xl text-white" />
                                )}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                                {activeTab === 'user' ? 'User Login' : 'Provider Login'}
                            </h2>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className={`text-lg transition-colors ${activeTab === 'user' ? 'text-blue-400 group-focus-within:text-blue-600' : 'text-orange-400 group-focus-within:text-orange-600'
                                        }`} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className={`text-lg transition-colors ${activeTab === 'user' ? 'text-blue-400 group-focus-within:text-blue-600' : 'text-orange-400 group-focus-within:text-orange-600'
                                        }`} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                                    required
                                />
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <a
                                    href="#"
                                    className={`text-sm font-medium transition-colors ${activeTab === 'user' ? 'text-blue-600 hover:text-blue-700' : 'text-orange-600 hover:text-orange-700'
                                        }`}
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${activeTab === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                                    : 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50'
                                    }`}
                            >
                                {loading ? 'Logging in...' : (activeTab === 'user' ? 'Login as User' : 'Login as Provider')}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-500">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className={`font-semibold transition-colors ${activeTab === 'user' ? 'text-blue-600 hover:text-blue-700' : 'text-orange-600 hover:text-orange-700'
                                        }`}
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="text-slate-500 hover:text-slate-700 transition-colors font-medium"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
