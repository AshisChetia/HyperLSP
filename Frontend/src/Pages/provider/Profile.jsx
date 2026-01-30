import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { HiSparkles, HiLocationMarker } from 'react-icons/hi'

// Static provider profile image
const PROVIDER_PROFILE_IMAGE = 'https://api.dicebear.com/7.x/avataaars/svg?seed=provider&backgroundColor=ffd5dc'

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
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
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-32 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                                <img
                                    src={PROVIDER_PROFILE_IMAGE}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-medium"
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
                            <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        {/* Provider Role Badge */}
                        <div className="mb-6 flex items-center gap-3">
                            <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                                Service Provider
                            </span>
                            {provider.isVerified ? (
                                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                                    <FaCheckCircle />
                                    Verified
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium">
                                    Pending Verification
                                </span>
                            )}
                        </div>

                        {/* Profile Fields */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <FaUser className="text-orange-500" />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">{provider.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <FaEnvelope className="text-orange-500" />
                                    Email Address
                                </label>
                                <p className="px-4 py-3 bg-slate-100 rounded-xl text-slate-600">{provider.email}</p>
                                <p className="text-xs text-slate-400">Email cannot be changed</p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <FaPhone className="text-orange-500" />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">{provider.phone}</p>
                                )}
                            </div>

                            {/* Pincode */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <HiLocationMarker className="text-orange-500" />
                                    Pincode
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">{provider.pincode}</p>
                                )}
                            </div>

                            {/* Address - Full Width */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <FaMapMarkerAlt className="text-orange-500" />
                                    Address
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all resize-none"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">{provider.address}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    <FaSave />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all"
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
