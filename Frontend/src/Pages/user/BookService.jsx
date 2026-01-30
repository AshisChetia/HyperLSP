import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaMapMarkerAlt, FaRupeeSign, FaClock, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading...</p>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-green-500 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Request Sent!</h2>
                    <p className="text-slate-500 mb-6">
                        Your booking request has been sent to {provider?.name}. They will review and respond soon.
                    </p>
                    <p className="text-sm text-slate-400">Redirecting to My Bookings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to={`/provider/${providerId}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <FaArrowLeft />
                                <span className="font-medium">Back</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Service Card */}
                {service && provider && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <span className="text-4xl">{categoryIcons[service.category] || '📋'}</span>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-800">{service.name}</h2>
                                <p className="text-slate-500 text-sm mb-2">{service.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-slate-600">by <strong>{provider.name}</strong></span>
                                    <div className="flex items-center gap-1 text-green-600 font-bold">
                                        <FaRupeeSign />
                                        <span>{service.basePrice}</span>
                                        <span className="text-slate-400 font-normal">(base price)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <FaClock />
                                        <span>{service.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Form */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                        <h1 className="text-2xl font-bold text-white">Book This Service</h1>
                        <p className="text-blue-100">Fill in the details to send your booking request</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Your Proposed Price */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Your Proposed Price (₹) *
                            </label>
                            <div className="relative">
                                <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                                <input
                                    type="number"
                                    name="proposedPrice"
                                    value={formData.proposedPrice}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="Enter your budget"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all text-lg font-semibold"
                                />
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Base price is ₹{service?.basePrice}. You can propose a different price.
                            </p>
                        </div>

                        {/* Service Address */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Service Address *
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-400" />
                                <textarea
                                    name="serviceAddress"
                                    value={formData.serviceAddress}
                                    onChange={handleChange}
                                    required
                                    rows="2"
                                    placeholder="Enter the address where service is needed"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Preferred Date *
                                </label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleChange}
                                        required
                                        min={minDate}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Preferred Time *
                                </label>
                                <select
                                    name="preferredTime"
                                    value={formData.preferredTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all"
                                >
                                    <option value="">Select time</option>
                                    <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                                    <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                                    <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                                    <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                                    <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                name="userNotes"
                                value={formData.userNotes}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Any specific requirements or details..."
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Sending Request...' : 'Send Booking Request'}
                        </button>

                        <p className="text-center text-sm text-slate-400">
                            The provider will review your request and can accept or propose a different price.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BookService
