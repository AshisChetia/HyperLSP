import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheck, FaTimes, FaRupeeSign, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaArrowRight } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { bookingAPI } from '../../services/api'
import toast from 'react-hot-toast'

// Status colors and labels
const statusConfig = {
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Pending', icon: '⏳' },
    accepted: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Accepted', icon: '✅' },
    rejected: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Rejected', icon: '❌' },
    completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Completed', icon: '🎉' },
    cancelled: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Cancelled', icon: '🚫' }
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
                toast.success('Booking accepted successfully')
            }
        } catch (error) {
            console.error('Accept booking error:', error)
            toast.error('Failed to accept booking')
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
                toast.success('Booking rejected')
            }
        } catch (error) {
            console.error('Reject booking error:', error)
            toast.error('Failed to reject booking')
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
                toast.success('Job marked as completed')
            }
        } catch (error) {
            console.error('Complete booking error:', error)
            toast.error('Failed to complete booking')
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

    const tabs = ['pending', 'accepted', 'completed', 'rejected', 'all']

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
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Booking Requests</h1>
                    <div className="flex gap-2">
                        {pendingCount > 0 && (
                            <span className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-semibold">
                                {pendingCount} Pending
                            </span>
                        )}
                        {acceptedCount > 0 && (
                            <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-semibold">
                                {acceptedCount} Active
                            </span>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${activeTab === tab
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-slate-400">Loading requests...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📬</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Requests Found</h3>
                        <p className="text-slate-400">
                            {activeTab === 'pending'
                                ? "No pending requests right now."
                                : `No ${activeTab} bookings.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            // Robust data handling to support both Local and Production schemas
                            const user = booking.userId || booking.user || {}
                            const service = booking.serviceId || booking.service || {}
                            const date = booking.preferredDate || booking.scheduledDate
                            const time = booking.preferredTime || booking.scheduledTime
                            const address = booking.serviceAddress || booking.address
                            const price = booking.finalPrice || booking.proposedPrice || booking.totalAmount
                            const basePrice = booking.basePrice || service.price || 0

                            return (
                                <div key={booking._id} className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300`}>
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            {/* Left - Booking Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-2xl">{statusConfig[booking.status]?.icon}</span>
                                                    <h3 className="text-lg font-bold text-white">
                                                        {service.name || 'Service Name Unavailable'}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusConfig[booking.status]?.bg} ${statusConfig[booking.status]?.text} ${statusConfig[booking.status]?.border}`}>
                                                        {statusConfig[booking.status]?.label}
                                                    </span>
                                                </div>

                                                {/* Customer Info */}
                                                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4 mb-4">
                                                    <p className="font-semibold text-white mb-3">Customer Details</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                                                {user.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <span className="text-white">{user.name || 'Unknown User'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400">
                                                            <FaPhone className="text-emerald-400" />
                                                            <span>{user.phone || 'No Phone'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400 md:col-span-2">
                                                            <FaMapMarkerAlt className="text-rose-400" />
                                                            <span>{address || 'No Address'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Schedule */}
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center">
                                                            <FaCalendarAlt className="text-orange-400 text-xs" />
                                                        </div>
                                                        <span className="text-white">{date ? formatDate(date) : 'Invalid Date'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                                                            <FaClock className="text-purple-400 text-xs" />
                                                        </div>
                                                        <span className="text-white">{time || 'Any Time'}</span>
                                                    </div>
                                                </div>

                                                {booking.userNotes && (
                                                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                                        <p className="text-sm text-blue-300">
                                                            <strong>Customer Note:</strong> {booking.userNotes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right - Price & Actions */}
                                            <div className="lg:text-right lg:min-w-[200px]">
                                                <div className="mb-4">
                                                    <p className="text-sm text-slate-500 mb-1">Base Price</p>
                                                    <p className="text-slate-400 flex items-center lg:justify-end gap-1">
                                                        <FaRupeeSign className="text-sm" />{basePrice}
                                                    </p>
                                                </div>
                                                <div className="mb-4">
                                                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                                                    <p className={`text-2xl font-bold flex items-center lg:justify-end gap-1 ${price >= basePrice ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                        <FaRupeeSign className="text-lg" />{price}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                {booking.status === 'pending' && (
                                                    <div className="flex lg:flex-col gap-2">
                                                        <button
                                                            onClick={() => handleAccept(booking._id, price)}
                                                            disabled={processingId === booking._id}
                                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                                                        >
                                                            <FaCheck /> Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(booking._id)}
                                                            disabled={processingId === booking._id}
                                                            className="flex-1 px-4 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl font-semibold hover:bg-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                                                        >
                                                            <FaTimes /> Reject
                                                        </button>
                                                    </div>
                                                )}

                                                {booking.status === 'accepted' && (
                                                    <button
                                                        onClick={() => handleComplete(booking._id)}
                                                        disabled={processingId === booking._id}
                                                        className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                                                    >
                                                        <FaCheck /> Mark Completed
                                                    </button>
                                                )}

                                                {booking.status === 'completed' && booking.rating && (
                                                    <div className="text-center bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                                        <p className="text-sm text-slate-500 mb-1">Rating</p>
                                                        <p className="text-2xl">{'⭐'.repeat(booking.rating)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingRequests
