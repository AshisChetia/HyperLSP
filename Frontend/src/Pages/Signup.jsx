import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaShoppingCart, FaToolbox } from 'react-icons/fa'
import { HiLocationMarker } from 'react-icons/hi'
import { authAPI } from '../services/api'

function Signup() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get('role') === 'provider' ? 'provider' : 'user')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const { confirmPassword, ...submitData } = formData

            let response
            if (activeTab === 'user') {
                response = await authAPI.signupUser(submitData)
            } else {
                response = await authAPI.signupProvider(submitData)
            }

            console.log('Signup response:', response)

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
            } else {
                setError(response.message || 'Registration failed')
            }
        } catch (err) {
            console.error('Signup error:', err)
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.'
            setError(errorMessage)
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
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-orange-600 bg-clip-text text-transparent">
                        HyperLSP
                    </h1>
                    <p className="text-slate-600 mt-2 text-lg">Create your account</p>
                </div>

                {/* Main Container */}
                <div className="w-full max-w-4xl">
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
                            Sign up as User
                        </button>
                        <button
                            onClick={() => setActiveTab('provider')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${activeTab === 'provider'
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                                : 'bg-white/70 text-slate-600 hover:bg-white hover:shadow-lg backdrop-blur-sm border border-white/50'
                                }`}
                        >
                            <FaToolbox className="text-xl" />
                            Sign up as Provider
                        </button>
                    </div>

                    {/* Signup Card */}
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
                                {activeTab === 'user' ? 'User Registration' : 'Provider Registration'}
                            </h2>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name & Email Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaUser className={`text-lg transition-colors ${activeTab === 'user' ? 'text-blue-400 group-focus-within:text-blue-600' : 'text-orange-400 group-focus-within:text-orange-600'
                                            }`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                                        required
                                    />
                                </div>

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
                            </div>

                            {/* Phone & Pincode Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaPhone className={`text-lg transition-colors ${activeTab === 'user' ? 'text-blue-400 group-focus-within:text-blue-600' : 'text-orange-400 group-focus-within:text-orange-600'
                                            }`} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <HiLocationMarker className={`text-xl transition-colors ${activeTab === 'user' ? 'text-blue-400 group-focus-within:text-blue-600' : 'text-orange-400 group-focus-within:text-orange-600'
                                            }`} />
                                    </div>
                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="Pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="relative group">
                                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                                    <FaMapMarkerAlt className={`text-lg transition-colors ${activeTab === 'user' ? 'text-blue-400 group-focus-within:text-blue-600' : 'text-orange-400 group-focus-within:text-orange-600'
                                        }`} />
                                </div>
                                <textarea
                                    name="address"
                                    placeholder="Full Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400 resize-none"
                                    required
                                />
                            </div>

                            {/* Password Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                                        required
                                    />
                                </div>
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
                                {loading ? 'Creating Account...' : (activeTab === 'user' ? 'Create User Account' : 'Create Provider Account')}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-500">
                                Already have an account?{' '}
                                <a href="/login" className={`font-semibold transition-colors ${activeTab === 'user' ? 'text-blue-600 hover:text-blue-700' : 'text-orange-600 hover:text-orange-700'
                                    }`}>
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className="text-center text-slate-500 text-sm mt-6">
                        By signing up, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
