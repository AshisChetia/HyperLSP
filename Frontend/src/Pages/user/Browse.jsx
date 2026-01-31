import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaSearch, FaArrowLeft, FaStar, FaMapMarkerAlt, FaRupeeSign, FaCheckCircle } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { serviceAPI, providerAPI } from '../../services/api'

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

// Category name list for matching
const categoryNames = Object.keys(categoryIcons)

// Static provider profile image
const PROVIDER_PROFILE_IMAGE = 'https://api.dicebear.com/7.x/avataaars/svg?seed=provider&backgroundColor=ffd5dc'

function Browse() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [user, setUser] = useState(null)
    const [categories, setCategories] = useState([])
    const [providers, setProviders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [searchPincode, setSearchPincode] = useState('')
    const [searchKeyword, setSearchKeyword] = useState('')

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsed = JSON.parse(userData)
            setUser(parsed)
        }

        // Read URL params
        const urlQuery = searchParams.get('q') || ''
        const urlPincode = searchParams.get('pincode') || ''

        // Check if query matches a category
        const matchedCategory = categoryNames.find(
            cat => cat.toLowerCase() === urlQuery.toLowerCase()
        )

        // Set initial values from URL or user data
        const pincode = urlPincode || (userData ? JSON.parse(userData).pincode : '') || ''
        setSearchPincode(pincode)
        setSearchKeyword(urlQuery)

        if (matchedCategory) {
            setSelectedCategory(matchedCategory)
        }

        fetchCategories()

        // Fetch with URL params
        fetchProviders({
            category: matchedCategory || '',
            pincode: pincode
        })
    }, [searchParams])

    const fetchCategories = async () => {
        try {
            const response = await serviceAPI.getCategories()
            if (response.success) {
                setCategories(response.data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchProviders = async (filters = {}) => {
        setLoading(true)
        try {
            const response = await providerAPI.getProviders(filters)
            if (response.success) {
                setProviders(response.data)
            }
        } catch (error) {
            console.error('Error fetching providers:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryClick = (categoryName) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory('')
            fetchProviders({ pincode: searchPincode })
        } else {
            setSelectedCategory(categoryName)
            fetchProviders({ category: categoryName, pincode: searchPincode })
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchProviders({
            category: selectedCategory,
            pincode: searchPincode
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FaSearch className="text-blue-500" />
                        Find Service Providers
                    </h2>
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Enter your pincode"
                                value={searchPincode}
                                onChange={(e) => setSearchPincode(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Categories - Only show if NO search keyword */}
                {!searchKeyword && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Browse by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedCategory === category.name
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{category.icon}</div>
                                    <div className="text-sm font-medium">{category.name}</div>
                                </button>
                            ))}
                        </div>
                        {selectedCategory && (
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-slate-500">Filtering by:</span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                    {selectedCategory}
                                </span>
                                <button
                                    onClick={() => handleCategoryClick(selectedCategory)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Providers List */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        {searchKeyword ? `Search Results for "${searchKeyword}"` : (selectedCategory ? `${selectedCategory} Providers` : 'All Providers')}
                        {searchPincode && ` in ${searchPincode}`}
                    </h2>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-slate-500">Loading providers...</p>
                        </div>
                    ) : providers.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Providers Found</h3>
                            <p className="text-slate-500 text-lg">
                                {searchKeyword
                                    ? `There are no providers for "${searchKeyword}"${searchPincode ? ` in pincode ${searchPincode}` : ''} at this time.`
                                    : 'Try adjusting your search filters or check another area.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {providers.map((provider) => (
                                <div key={provider._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={PROVIDER_PROFILE_IMAGE}
                                                alt={provider.name}
                                                className="w-16 h-16 rounded-xl bg-white object-cover"
                                            />
                                            <div className="text-white">
                                                <h3 className="text-lg font-bold flex items-center gap-2">
                                                    {provider.name}
                                                    {provider.isVerified && (
                                                        <FaCheckCircle className="text-green-300 text-sm" />
                                                    )}
                                                </h3>
                                                <div className="flex items-center gap-1 text-blue-100">
                                                    <FaMapMarkerAlt className="text-sm" />
                                                    <span className="text-sm">{provider.pincode}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <FaStar />
                                                <span className="font-semibold">{provider.rating || '0.0'}</span>
                                            </div>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-slate-500 text-sm">{provider.totalReviews || 0} reviews</span>
                                        </div>

                                        {/* Services Preview */}
                                        <div className="mb-4">
                                            <p className="text-sm text-slate-500 mb-2">{provider.servicesCount || 0} services offered</p>
                                            <div className="flex flex-wrap gap-2">
                                                {provider.services?.slice(0, 2).map((service) => (
                                                    <span key={service._id} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                        {categoryIcons[service.category]} {service.name}
                                                    </span>
                                                ))}
                                                {provider.servicesCount > 2 && (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                        +{provider.servicesCount - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            to={`/provider/${provider._id}`}
                                            className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            View Profile & Services
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Browse
