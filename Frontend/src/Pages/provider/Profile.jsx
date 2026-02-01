import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaArrowLeft, FaCheckCircle, FaShieldAlt } from 'react-icons/fa'
import { HiSparkles, HiLocationMarker } from 'react-icons/hi'

// Static provider profile image
const PROVIDER_PROFILE_IMAGE = '/provider.webp'

function Profile() {
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null)
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
            setProvider(parsed)
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
            const updatedProvider = { ...provider, ...formData }
            localStorage.setItem('user', JSON.stringify(updatedProvider))
            setProvider(updatedProvider)
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
            name: provider.name || '',
            email: provider.email || '',
            phone: provider.phone || '',
            address: provider.address || '',
            pincode: provider.pincode || ''
        })
        setIsEditing(false)
    }

    if (!provider) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
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
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-8">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={PROVIDER_PROFILE_IMAGE}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-2xl bg-white object-cover shadow-2xl ring-4 ring-white/20"
                                />
                                {provider.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                        <FaCheckCircle className="text-white text-sm" />
                                    </div>
                                )}
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-2xl font-bold text-white mb-2">{provider.name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white">
                                        <FaShieldAlt />
                                        Service Provider
                                    </span>
                                    {provider.isVerified ? (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-sm text-emerald-300">
                                            <FaCheckCircle />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-xl text-sm text-amber-300">
                                            Pending Verification
                                        </span>
                                    )}
                                </div>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-medium border border-white/10"
                                >
                                    <FaEdit />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6 md:p-8">
                        {/* Message */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                {message.type === 'success' ? <FaCheckCircle /> : <FaTimes />}
                                {message.text}
                            </div>
                        )}

                        {/* Profile Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <FaUser className="text-orange-400 text-xs" />
                                    </div>
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-800 transition-all duration-300"
                                    />
                                ) : (
                                    <p className="px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white font-medium">{provider.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <FaEnvelope className="text-orange-400 text-xs" />
                                    </div>
                                    Email Address
                                </label>
                                <p className="px-4 py-4 bg-slate-800/30 border border-white/5 rounded-xl text-slate-500">{provider.email}</p>
                                <p className="text-xs text-slate-600">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <FaPhone className="text-orange-400 text-xs" />
                                    </div>
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-800 transition-all duration-300"
                                    />
                                ) : (
                                    <p className="px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white font-medium">{provider.phone}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <HiLocationMarker className="text-orange-400 text-xs" />
                                    </div>
                                    Pincode
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-800 transition-all duration-300"
                                    />
                                ) : (
                                    <p className="px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white font-medium">{provider.pincode}</p>
                                )}
                            </div>

                            {/* Address - Full Width */}
                            <div className="space-y-3 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-orange-400 text-xs" />
                                    </div>
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-800 transition-all duration-300 resize-none"
                                    />
                                ) : (
                                    <p className="px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white font-medium">{provider.address}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                                >
                                    <FaSave />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all duration-300"
                                >
                                    <FaTimes className="inline mr-2" />
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
