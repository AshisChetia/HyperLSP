import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaRupeeSign, FaClock, FaCheckCircle } from 'react-icons/fa'
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
const PROVIDER_PROFILE_IMAGE = 'https://api.dicebear.com/7.x/avataaars/svg?seed=provider&backgroundColor=ffd5dc'

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
                setProvider(response.data)
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-slate-500">Loading provider details...</p>
                </div>
            </div>
        )
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Provider Not Found</h2>
                    <Link to="/user/browse" className="text-blue-500 hover:underline">
                        Go back to browse
                    </Link>
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
                            <Link to="/user/browse" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                                <FaArrowLeft />
                                <span className="font-medium">Back to Browse</span>
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
                {/* Provider Profile Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <img
                                src={PROVIDER_PROFILE_IMAGE}
                                alt={provider.name}
                                className="w-28 h-28 rounded-2xl bg-white object-cover shadow-lg"
                            />
                            <div className="text-center md:text-left text-white">
                                <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
                                    {provider.name}
                                    {provider.isVerified && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-green-400/30 rounded-full text-sm">
                                            <FaCheckCircle />
                                            Verified
                                        </span>
                                    )}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-blue-100">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt />
                                        <span>{provider.address}</span>
                                    </div>
                                    <span>•</span>
                                    <span>Pincode: {provider.pincode}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                                        <FaStar className="text-yellow-300" />
                                        <span className="font-semibold">{provider.rating || '0.0'}</span>
                                        <span className="text-sm">({provider.totalReviews || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h2>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FaPhone className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Phone</p>
                                    <p className="font-medium">{provider.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FaEnvelope className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Email</p>
                                    <p className="font-medium">{provider.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                        Services Offered ({provider.services?.length || 0})
                    </h2>

                    {provider.services?.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <div className="text-5xl mb-4">🛠️</div>
                            <p>This provider hasn't added any services yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {provider.services?.map((service) => (
                                <div key={service._id} className="border-2 border-slate-100 rounded-2xl p-5 hover:border-blue-300 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{categoryIcons[service.category] || '📋'}</span>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{service.name}</h3>
                                                <span className="text-xs text-slate-400 px-2 py-1 bg-slate-100 rounded">
                                                    {service.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-sm mb-4">{service.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-green-600 font-bold">
                                                <FaRupeeSign />
                                                <span className="text-lg">{service.basePrice}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400 text-sm">
                                                <FaClock />
                                                <span>{service.duration}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleBookService(service)}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        Customer Reviews
                        <span className="text-base font-normal text-slate-500">
                            ({reviews.length})
                        </span>
                    </h2>

                    {reviews.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <div className="text-5xl mb-4">💬</div>
                            <p>No reviews yet. Be the first to review!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b border-slate-100 pb-6 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                                                {review.userId?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{review.userId?.name || 'User'}</h4>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                                            <FaStar />
                                            <span className="font-bold">{review.rating}</span>
                                        </div>
                                    </div>
                                    {review.review && (
                                        <p className="text-slate-600 pl-14">
                                            "{review.review}"
                                        </p>
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
