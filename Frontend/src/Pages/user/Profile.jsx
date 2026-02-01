import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaArrowLeft, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import { HiSparkles, HiLocationMarker } from 'react-icons/hi'

// Static user profile image
const USER_PROFILE_IMAGE = '/user.webp'

function Profile() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            setFormData({
                name: parsed.name || '',
                email: parsed.email || '',
                phone: parsed.phone || '',
                address: parsed.address || '',
                pincode: parsed.pincode || ''
            })
        } else {
            navigate('/login')
        }
    }, [navigate])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            // Update localStorage for now (backend integration later)
            const updatedUser = { ...user, ...formData }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            setIsEditing(false)
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            pincode: user.pincode || ''
        })
        setIsEditing(false)
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="bg-slate-900/50 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/user/home" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 group">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <FaArrowLeft className="text-sm" />
                                </div>
                                <span className="font-medium hidden sm:block">Back to Home</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
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
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 h-40">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        {/* Profile Image */}
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden bg-slate-800 ring-4 ring-blue-500/20">
                                    <img
                                        src={USER_PROFILE_IMAGE}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                    <FaCheckCircle className="text-white text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium border border-white/10"
                            >
                                <FaEdit />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 px-8 pb-8">
                        {/* Message */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                {message.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
                                {message.text}
                            </div>
                        )}

                        {/* User Role Badge */}
                        <div className="mb-8 flex items-center gap-3">
                            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-sm font-semibold flex items-center gap-2">
                                <FaUser className="text-xs" />
                                User Account
                            </span>
                            <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-semibold flex items-center gap-2">
                                <FaShieldAlt className="text-xs" />
                                Verified
                            </span>
                        </div>

                        {/* Profile Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <FaUser className="text-blue-400 text-xs" />
                                    </div>
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white font-medium">{user.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <FaEnvelope className="text-blue-400 text-xs" />
                                    </div>
                                    Email Address
                                </label>
                                <p className="px-4 py-3 bg-slate-800/30 border border-white/5 rounded-xl text-slate-400">{user.email}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <FaShieldAlt className="text-blue-400" />
                                    Email cannot be changed
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <FaPhone className="text-blue-400 text-xs" />
                                    </div>
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white font-medium">{user.phone}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <HiLocationMarker className="text-blue-400 text-xs" />
                                    </div>
                                    Pincode
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white font-medium">{user.pincode}</p>
                                )}
                            </div>

                            {/* Address - Full Width */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-blue-400 text-xs" />
                                    </div>
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300 resize-none"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-white font-medium">{user.address}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                                >
                                    <FaSave />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-4 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                                >
                                    <FaTimes />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
