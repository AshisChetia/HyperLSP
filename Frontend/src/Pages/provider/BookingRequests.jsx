import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheck, FaTimes, FaRupeeSign, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { bookingAPI } from '../../services/api'

// Status colors and labels
const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'Pending', icon: '⏳' },
    accepted: { color: 'bg-green-100 text-green-700 border-green-300', label: 'Accepted', icon: '✅' },
    rejected: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Rejected', icon: '❌' },
    completed: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Completed', icon: '🎉' },
    cancelled: { color: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Cancelled', icon: '🚫' }
}

function BookingRequests() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('pending')
    const [processingId, setProcessingId] = useState(null)

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getProviderBookings()
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

    const handleAccept = async (bookingId, proposedPrice) => {
        setProcessingId(bookingId)
        try {
            const response = await bookingAPI.acceptBooking(bookingId, {
                finalPrice: proposedPrice
            })
            if (response.success) {
                fetchBookings()
            }
        } catch (error) {
            alert('Failed to accept booking')
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (bookingId) => {
        const reason = window.prompt('Reason for rejection (optional):')
        if (reason === null) return // User cancelled

        setProcessingId(bookingId)
        try {
            const response = await bookingAPI.rejectBooking(bookingId, {
                providerNotes: reason || 'Request rejected'
            })
            if (response.success) {
                fetchBookings()
            }
        } catch (error) {
            alert('Failed to reject booking')
        } finally {
            setProcessingId(null)
        }
    }

    const handleComplete = async (bookingId) => {
        if (!window.confirm('Mark this job as completed? Customer will be notified to pay and rate.')) return

        setProcessingId(bookingId)
        try {
            const response = await bookingAPI.completeBooking(bookingId)
            if (response.success) {
                fetchBookings()
            }
        } catch (error) {
            alert('Failed to complete booking')
        } finally {
            setProcessingId(null)
        }
    }

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'all') return true
        return b.status === activeTab
    })

    const pendingCount = bookings.filter(b => b.status === 'pending').length
    const acceptedCount = bookings.filter(b => b.status === 'accepted').length

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Booking Requests</h1>
                    <div className="flex gap-2">
                        {pendingCount > 0 && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                {pendingCount} Pending
                            </span>
                        )}
                        {acceptedCount > 0 && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                {acceptedCount} Active
                            </span>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['pending', 'accepted', 'completed', 'rejected', 'all'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading requests...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📬</div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Requests Found</h3>
                        <p className="text-slate-500">
                            {activeTab === 'pending'
                                ? "No pending requests right now."
                                : `No ${activeTab} bookings.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 ${statusConfig[booking.status]?.color.split(' ')[2]}`}>
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        {/* Left - Booking Details */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">{statusConfig[booking.status]?.icon}</span>
                                                <h3 className="text-lg font-bold text-slate-800">
                                                    {booking.serviceId?.name || 'Service'}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[booking.status]?.color}`}>
                                                    {statusConfig[booking.status]?.label}
                                                </span>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                                <p className="font-semibold text-slate-800 mb-2">Customer Details</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <strong>Name:</strong> {booking.userId?.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <FaPhone className="text-green-500" />
                                                        {booking.userId?.phone}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600 md:col-span-2">
                                                        <FaMapMarkerAlt className="text-red-500" />
                                                        {booking.serviceAddress}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Schedule */}
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt className="text-orange-500" />
                                                    <span>{formatDate(booking.preferredDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaClock className="text-orange-500" />
                                                    <span>{booking.preferredTime}</span>
                                                </div>
                                            </div>

                                            {booking.userNotes && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-slate-600">
                                                        <strong>Customer Note:</strong> {booking.userNotes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right - Price & Actions */}
                                        <div className="lg:text-right lg:min-w-[180px]">
                                            <div className="mb-4">
                                                <p className="text-sm text-slate-400">Base Price</p>
                                                <p className="text-slate-600 flex items-center lg:justify-end gap-1">
                                                    <FaRupeeSign />{booking.basePrice}
                                                </p>
                                            </div>
                                            <div className="mb-4">
                                                <p className="text-sm text-slate-400">Customer's Offer</p>
                                                <p className={`text-2xl font-bold flex items-center lg:justify-end gap-1 ${booking.proposedPrice >= booking.basePrice ? 'text-green-600' : 'text-orange-600'
                                                    }`}>
                                                    <FaRupeeSign />{booking.proposedPrice}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            {booking.status === 'pending' && (
                                                <div className="flex lg:flex-col gap-2">
                                                    <button
                                                        onClick={() => handleAccept(booking._id, booking.proposedPrice)}
                                                        disabled={processingId === booking._id}
                                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <FaCheck /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(booking._id)}
                                                        disabled={processingId === booking._id}
                                                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <FaTimes /> Reject
                                                    </button>
                                                </div>
                                            )}

                                            {booking.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleComplete(booking._id)}
                                                    disabled={processingId === booking._id}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <FaCheck /> Mark Completed
                                                </button>
                                            )}

                                            {booking.status === 'completed' && booking.rating && (
                                                <div className="text-center">
                                                    <p className="text-sm text-slate-400">Rating</p>
                                                    <p className="text-2xl">{'⭐'.repeat(booking.rating)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingRequests
