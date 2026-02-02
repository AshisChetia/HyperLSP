import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaRupeeSign, FaClock, FaCheckCircle, FaArrowRight, FaQuoteLeft } from 'react-icons/fa'
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

// Static provider profile image
const PROVIDER_PROFILE_IMAGE = '/provider.webp'

function ProviderDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedService, setSelectedService] = useState(null)

    useEffect(() => {
        fetchProviderDetails()
        fetchReviews()
    }, [id])

    const fetchProviderDetails = async () => {
        try {
            const response = await providerAPI.getProviderById(id)
            if (response.success) {
                // API returns { provider, services } - merge them
                const providerData = response.data.provider || response.data
                const services = response.data.services || []
                setProvider({ ...providerData, services })
            }
        } catch (error) {
            console.error('Error fetching provider:', error)
            if (error.response?.status === 404) {
                navigate('/user/browse')
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchReviews = async () => {
        try {
            const response = await bookingAPI.getProviderReviews(id)
            if (response.success) {
                setReviews(response.data)
            }
        } catch (error) {
            console.error('Error fetching reviews:', error)
        }
    }

    const handleBookService = (service) => {
        setSelectedService(service)
        // Navigate to booking page
        navigate(`/book/${provider._id}/${service._id}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading provider details...</p>
                </div>
            </div>
        )
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">😕</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Provider Not Found</h2>
                    <Link to="/user/browse" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Go back to browse
                    </Link>
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
                            <Link to="/user/browse" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 group">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <FaArrowLeft className="text-sm" />
                                </div>
                                <span className="font-medium hidden sm:block">Back to Browse</span>
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
                {/* Provider Profile Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden mb-8">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={PROVIDER_PROFILE_IMAGE}
                                    alt={provider.name}
                                    className="w-28 h-28 rounded-2xl bg-white object-cover shadow-2xl ring-4 ring-white/20"
                                />
                                {provider.isVerified && (
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                                        <FaCheckCircle className="text-white text-sm" />
                                    </div>
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3 flex-wrap">
                                    {provider.name}
                                    {provider.isVerified && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-sm text-emerald-300">
                                            <FaCheckCircle />
                                            Verified
                                        </span>
                                    )}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-blue-100 flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <FaMapMarkerAlt className="text-blue-200" />
                                        <span>{provider.address}</span>
                                    </div>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Pincode: {provider.pincode}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                        <FaStar className="text-amber-400" />
                                        <span className="font-bold text-white">{provider.rating || '0.0'}</span>
                                        <span className="text-blue-200 text-sm">({provider.totalReviews || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-lg font-bold text-white mb-4">Contact Information</h2>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                                    <FaPhone className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Phone</p>
                                    <p className="font-medium text-white">{provider.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                                    <FaEnvelope className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-medium text-white">{provider.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        Services Offered
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-xl text-sm font-normal text-blue-400">
                            {provider.services?.length || 0}
                        </span>
                    </h2>

                    {provider.services?.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">🛠️</span>
                            </div>
                            <p className="text-slate-400">This provider hasn't added any services yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {provider.services?.map((service) => (
                                <div key={service._id} className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                                                {categoryIcons[service.category] || '📋'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{service.name}</h3>
                                                <span className="text-xs text-slate-400 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                                                    {service.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                                <FaRupeeSign />
                                                <span className="text-xl">{service.price || service.basePrice}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                                <FaClock />
                                                <span>{service.duration}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleBookService(service)}
                                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm"
                                        >
                                            Book Now
                                            <FaArrowRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        Customer Reviews
                        <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-xl text-sm font-normal text-amber-400">
                            {reviews.length}
                        </span>
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">💬</span>
                            </div>
                            <p className="text-slate-400">No reviews yet. Be the first to review!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-white text-lg">
                                                {review.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{review.user?.name || 'User'}</h4>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                            <FaStar className="text-amber-400" />
                                            <span className="font-bold text-amber-400">{review.rating}</span>
                                        </div>
                                    </div>
                                    {review.review && (
                                        <div className="pl-16 flex items-start gap-2">
                                            <FaQuoteLeft className="text-slate-600 text-sm flex-shrink-0 mt-1" />
                                            <p className="text-slate-300 italic">
                                                {review.review}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProviderDetail
