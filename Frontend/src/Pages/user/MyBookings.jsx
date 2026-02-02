import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaRupeeSign, FaClock, FaCalendarAlt, FaTimes, FaCheck, FaSpinner, FaArrowRight } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { bookingAPI } from '../../services/api'
import toast from 'react-hot-toast'

// Status colors and labels
const statusConfig = {
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '⏳', label: 'Pending' },
    accepted: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '✓', label: 'Accepted' },
    rejected: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: '✕', label: 'Rejected' },
    completed: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', icon: '★', label: 'Completed' },
    cancelled: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20', icon: '–', label: 'Cancelled' }
}

const tabConfig = {
    all: { gradient: 'from-blue-500 to-cyan-500', icon: '📋' },
    pending: { gradient: 'from-amber-500 to-orange-500', icon: '⏳' },
    accepted: { gradient: 'from-emerald-500 to-teal-500', icon: '✓' },
    completed: { gradient: 'from-sky-500 to-blue-500', icon: '★' },
    rejected: { gradient: 'from-rose-500 to-red-500', icon: '✕' },
    cancelled: { gradient: 'from-slate-500 to-gray-500', icon: '–' }
}

function MyBookings() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [rating, setRating] = useState(5)
    const [review, setReview] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getUserBookings()
            if (response.success) {
                setBookings(response.data)
            }
        } catch (error) {
            console.error('Error fetching bookings:', error)
            if (error.response?.status === 401) {
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return

        try {
            const response = await bookingAPI.cancelBooking(bookingId)
            if (response.success) {
                fetchBookings()
                toast.success('Booking cancelled successfully')
            }
        } catch (error) {
            toast.error('Failed to cancel booking')
        }
    }

    const openRatingModal = (booking) => {
        setSelectedBooking(booking)
        setRating(5)
        setReview('')
        setShowRatingModal(true)
    }

    const handleRating = async () => {
        if (!selectedBooking) return
        setSubmitting(true)

        try {
            const response = await bookingAPI.rateBooking(selectedBooking._id, { rating, review })
            if (response.success) {
                setShowRatingModal(false)
                fetchBookings()
                toast.success('Rating submitted successfully')
            }
        } catch (error) {
            toast.error('Failed to submit rating')
        } finally {
            setSubmitting(false)
        }
    }

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'all') return true
        return b.status === activeTab
    })

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
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
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
                        <p className="text-slate-400">Track and manage your service bookings</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-slate-400">Total:</span>
                        <span className="text-white font-semibold">{bookings.length} bookings</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`group relative px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${activeTab === tab
                                ? `bg-gradient-to-r ${tabConfig[tab].gradient} text-white shadow-lg`
                                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <span>{tabConfig[tab].icon}</span>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-slate-400">Loading your bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaCalendarAlt className="text-3xl text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Bookings Found</h3>
                        <p className="text-slate-400 mb-6">
                            {activeTab === 'all'
                                ? "You haven't made any bookings yet."
                                : `No ${activeTab} bookings.`}
                        </p>
                        <Link
                            to="/user/browse"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                        >
                            Browse Services
                            <FaArrowRight className="text-sm" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                        {/* Left Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                {/* Service Icon */}
                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center text-2xl border border-blue-500/20 flex-shrink-0">
                                                    {booking.service?.name?.charAt(0) || '📋'}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h3 className="text-lg font-bold text-white">
                                                            {booking.service?.name || 'Service'}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusConfig[booking.status]?.bg} ${statusConfig[booking.status]?.text} border ${statusConfig[booking.status]?.border}`}>
                                                            {statusConfig[booking.status]?.icon} {statusConfig[booking.status]?.label}
                                                        </span>
                                                    </div>

                                                    <p className="text-slate-400 text-sm mb-4">
                                                        Provider: <span className="text-white font-medium">{booking.provider?.name}</span>
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-slate-300">
                                                            <FaCalendarAlt className="text-blue-400" />
                                                            <span>{formatDate(booking.scheduledDate)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-slate-300">
                                                            <FaClock className="text-blue-400" />
                                                            <span>{booking.scheduledTime}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-slate-300">
                                                            <FaMapMarkerAlt className="text-rose-400" />
                                                            <span className="truncate max-w-[180px]">{booking.address}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Content - Price */}
                                        <div className="lg:text-right flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
                                            <div>
                                                <p className="text-sm text-slate-500">Your Price</p>
                                                <p className="text-2xl font-bold text-emerald-400 flex items-center gap-1">
                                                    <FaRupeeSign className="text-lg" />{booking.totalAmount}
                                                </p>
                                            </div>
                                            {booking.finalPrice && booking.finalPrice !== booking.proposedPrice && (
                                                <div>
                                                    <p className="text-sm text-slate-500">Final Price</p>
                                                    <p className="text-xl font-bold text-blue-400 flex items-center gap-1">
                                                        <FaRupeeSign className="text-base" />{booking.finalPrice}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Provider Notes */}
                                    {booking.providerNotes && (
                                        <div className="mt-4 p-4 bg-slate-800/50 border border-white/5 rounded-xl">
                                            <p className="text-sm text-slate-300">
                                                <span className="text-slate-500 font-medium">Provider Note:</span> {booking.providerNotes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-medium hover:bg-rose-500/20 transition-all duration-300 flex items-center gap-2"
                                            >
                                                <FaTimes /> Cancel Booking
                                            </button>
                                        )}
                                        {booking.status === 'completed' && !booking.rating && (
                                            <button
                                                onClick={() => openRatingModal(booking)}
                                                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center gap-2"
                                            >
                                                <FaStar /> Rate & Pay
                                            </button>
                                        )}
                                        {booking.rating && (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                                <FaStar className="text-amber-400" />
                                                <span className="font-semibold text-amber-400">{booking.rating}/5</span>
                                                <span className="text-slate-500 text-sm">• Paid</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                            <h2 className="text-2xl font-bold text-white">Rate & Complete Payment</h2>
                            <p className="text-amber-100 text-sm mt-1">Confirm payment and share your experience</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <p className="text-slate-300">
                                Please confirm you've paid the provider offline and rate your experience.
                            </p>

                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">Your Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${star <= rating
                                                ? 'bg-amber-500/20 border border-amber-500/30 scale-110'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {star <= rating ? '⭐' : '☆'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Review (Optional)</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows="3"
                                    placeholder="Share your experience..."
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none transition-all duration-300"
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={handleRating}
                                    disabled={submitting}
                                    className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 disabled:opacity-50"
                                >
                                    {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                    {submitting ? 'Submitting...' : 'Confirm Payment & Rate'}
                                </button>
                                <button
                                    onClick={() => setShowRatingModal(false)}
                                    className="px-6 py-4 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyBookings
