import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaRupeeSign, FaClock, FaCalendarAlt, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { bookingAPI } from '../../services/api'

// Status colors and labels
const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
    accepted: { color: 'bg-green-100 text-green-700', label: 'Accepted' },
    rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected' },
    completed: { color: 'bg-blue-100 text-blue-700', label: 'Completed' },
    cancelled: { color: 'bg-gray-100 text-gray-700', label: 'Cancelled' }
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
            }
        } catch (error) {
            alert('Failed to cancel booking')
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
            }
        } catch (error) {
            alert('Failed to submit rating')
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/user/home" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <FaArrowLeft />
                                <span className="font-medium">Back to Home</span>
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">My Bookings</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Bookings Found</h3>
                        <p className="text-slate-500">
                            {activeTab === 'all'
                                ? "You haven't made any bookings yet."
                                : `No ${activeTab} bookings.`}
                        </p>
                        <Link
                            to="/user/browse"
                            className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold"
                        >
                            Browse Services
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-800">
                                                    {booking.serviceId?.name || 'Service'}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[booking.status]?.color}`}>
                                                    {statusConfig[booking.status]?.label}
                                                </span>
                                            </div>

                                            <p className="text-slate-500 text-sm mb-3">
                                                Provider: <strong>{booking.providerId?.name}</strong>
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt className="text-blue-500" />
                                                    <span>{formatDate(booking.preferredDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaClock className="text-blue-500" />
                                                    <span>{booking.preferredTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-blue-500" />
                                                    <span className="truncate max-w-[200px]">{booking.serviceAddress}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="mb-2">
                                                <p className="text-sm text-slate-400">Your Price</p>
                                                <p className="text-xl font-bold text-green-600 flex items-center justify-end gap-1">
                                                    <FaRupeeSign />{booking.proposedPrice}
                                                </p>
                                            </div>
                                            {booking.finalPrice && booking.finalPrice !== booking.proposedPrice && (
                                                <div>
                                                    <p className="text-sm text-slate-400">Final Price</p>
                                                    <p className="text-lg font-bold text-blue-600 flex items-center justify-end gap-1">
                                                        <FaRupeeSign />{booking.finalPrice}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {booking.providerNotes && (
                                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-slate-600">
                                                <strong>Provider Note:</strong> {booking.providerNotes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center gap-2"
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        )}
                                        {booking.status === 'completed' && !booking.rating && (
                                            <button
                                                onClick={() => openRatingModal(booking)}
                                                className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg font-medium hover:bg-yellow-100 flex items-center gap-2"
                                            >
                                                <FaStar /> Rate & Pay
                                            </button>
                                        )}
                                        {booking.rating && (
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <FaStar />
                                                <span className="font-semibold">{booking.rating}/5</span>
                                                <span className="text-slate-400 text-sm ml-1">- Paid</span>
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-white">Rate & Complete Payment</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-slate-600">
                                Please confirm you've paid the provider offline and rate your experience.
                            </p>

                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Your Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="text-3xl transition-transform hover:scale-110"
                                        >
                                            {star <= rating ? '⭐' : '☆'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Review (Optional)</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows="3"
                                    placeholder="Share your experience..."
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleRating}
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                                >
                                    {submitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                    {submitting ? 'Submitting...' : 'Confirm Payment & Rate'}
                                </button>
                                <button
                                    onClick={() => setShowRatingModal(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold"
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
