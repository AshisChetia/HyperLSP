import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaMapMarkerAlt, FaRupeeSign, FaClock, FaCalendarAlt, FaCheckCircle, FaStickyNote, FaArrowRight, FaTimes } from 'react-icons/fa'
import { HiSparkles, HiLocationMarker } from 'react-icons/hi'
import { providerAPI, bookingAPI } from '../../services/api'

// Service category icons mapping
const categoryIcons = {
    'Plumbing': '🔧',
    'Electrical': '⚡',
    'Cleaning': '🧹',
    'Carpentry': '🪚',
    'Painting': '🎨',
    'AC & Appliance': '❄️',
    'Pest Control': '🐜',
    'Beauty & Spa': '💅',
    'Home Repair': '🏠',
    'Moving & Packing': '📦',
    'Other': '📋'
}

function BookService() {
    const { providerId, serviceId } = useParams()
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null)
    const [service, setService] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        proposedPrice: '',
        serviceAddress: '',
        preferredDate: '',
        preferredTime: '',
        userNotes: ''
    })

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
            setFormData(prev => ({
                ...prev,
                serviceAddress: parsed.address || ''
            }))
        } else {
            navigate('/login')
            return
        }
        fetchProviderDetails()
    }, [providerId, serviceId, navigate])

    const fetchProviderDetails = async () => {
        try {
            const response = await providerAPI.getProviderById(providerId)
            if (response.success) {
                setProvider(response.data)
                const found = response.data.services.find(s => s._id === serviceId)
                if (found) {
                    setService(found)
                    setFormData(prev => ({
                        ...prev,
                        proposedPrice: found.basePrice
                    }))
                } else {
                    setError('Service not found')
                }
            }
        } catch (err) {
            console.error('Error:', err)
            setError('Failed to load details')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            const bookingData = {
                providerId,
                serviceId,
                proposedPrice: Number(formData.proposedPrice),
                serviceAddress: formData.serviceAddress,
                preferredDate: formData.preferredDate,
                preferredTime: formData.preferredTime,
                userNotes: formData.userNotes
            }

            const response = await bookingAPI.createBooking(bookingData)
            if (response.success) {
                setSuccess(true)
                setTimeout(() => {
                    navigate('/user/bookings')
                }, 2000)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking')
        } finally {
            setSubmitting(false)
        }
    }

    // Get tomorrow's date for min date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading...</p>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 flex items-center justify-center p-4">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center max-w-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
                        <FaCheckCircle className="text-white text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Booking Request Sent!</h2>
                    <p className="text-slate-400 mb-6">
                        Your booking request has been sent to <span className="text-white font-medium">{provider?.name}</span>. They will review and respond soon.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Redirecting to My Bookings...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="bg-slate-900/50 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to={`/provider/${providerId}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 group">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <FaArrowLeft className="text-sm" />
                                </div>
                                <span className="font-medium hidden sm:block">Back</span>
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
            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Service Card */}
                {service && provider && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                {categoryIcons[service.category] || '📋'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-white mb-1">{service.name}</h2>
                                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{service.description}</p>
                                <div className="flex items-center gap-4 text-sm flex-wrap">
                                    <span className="text-slate-400">by <span className="text-white font-medium">{provider.name}</span></span>
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                        <FaRupeeSign className="text-sm" />
                                        <span>{service.basePrice}</span>
                                        <span className="text-slate-500 font-normal">(base)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <FaClock className="text-sm" />
                                        <span>{service.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative">
                            <h1 className="text-2xl font-bold text-white">Book This Service</h1>
                            <p className="text-blue-100 mt-1">Fill in the details to send your booking request</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3">
                                <FaTimes className="flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Your Proposed Price */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-3">
                                <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                    <FaRupeeSign className="text-emerald-400 text-xs" />
                                </div>
                                Your Proposed Price (₹) *
                            </label>
                            <div className="relative">
                                <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
                                <input
                                    type="number"
                                    name="proposedPrice"
                                    value={formData.proposedPrice}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="Enter your budget"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300 text-lg font-semibold"
                                />
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                                Base price is ₹{service?.basePrice}. You can propose a different price.
                            </p>
                        </div>

                        {/* Service Address */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-3">
                                <div className="w-6 h-6 bg-rose-500/20 rounded-lg flex items-center justify-center">
                                    <HiLocationMarker className="text-rose-400 text-xs" />
                                </div>
                                Service Address *
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-500" />
                                <textarea
                                    name="serviceAddress"
                                    value={formData.serviceAddress}
                                    onChange={handleChange}
                                    required
                                    rows="2"
                                    placeholder="Enter the address where service is needed"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300 resize-none"
                                />
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-3">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <FaCalendarAlt className="text-blue-400 text-xs" />
                                    </div>
                                    Preferred Date *
                                </label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleChange}
                                        required
                                        min={minDate}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-3">
                                    <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <FaClock className="text-purple-400 text-xs" />
                                    </div>
                                    Preferred Time *
                                </label>
                                <select
                                    name="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-slate-800">Select time</option>
                                    <option value="8:00 AM - 10:00 AM" className="bg-slate-800">8:00 AM - 10:00 AM</option>
                                    <option value="10:00 AM - 12:00 PM" className="bg-slate-800">10:00 AM - 12:00 PM</option>
                                    <option value="12:00 PM - 2:00 PM" className="bg-slate-800">12:00 PM - 2:00 PM</option>
                                    <option value="2:00 PM - 4:00 PM" className="bg-slate-800">2:00 PM - 4:00 PM</option>
                                    <option value="4:00 PM - 6:00 PM" className="bg-slate-800">4:00 PM - 6:00 PM</option>
                                    <option value="6:00 PM - 8:00 PM" className="bg-slate-800">6:00 PM - 8:00 PM</option>
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-3">
                                <div className="w-6 h-6 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                    <FaStickyNote className="text-amber-400 text-xs" />
                                </div>
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                name="userNotes"
                                value={formData.userNotes}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Any specific requirements or details..."
                                className="w-full px-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300 resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Sending Request...
                                </>
                            ) : (
                                <>
                                    Send Booking Request
                                    <FaArrowRight />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            The provider will review your request and can accept or propose a different price.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BookService
