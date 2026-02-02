import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaSearch, FaArrowLeft, FaStar, FaMapMarkerAlt, FaCheckCircle, FaArrowRight, FaTimes } from 'react-icons/fa'
import { HiSparkles, HiLocationMarker } from 'react-icons/hi'
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

const categoryColors = {
    'Plumbing': 'from-blue-500 to-cyan-400',
    'Electrical': 'from-amber-500 to-orange-400',
    'Cleaning': 'from-emerald-500 to-teal-400',
    'Carpentry': 'from-amber-600 to-yellow-500',
    'Painting': 'from-purple-500 to-pink-400',
    'AC & Appliance': 'from-sky-500 to-blue-400',
    'Pest Control': 'from-red-500 to-orange-400',
    'Beauty & Spa': 'from-pink-500 to-rose-400',
    'Home Repair': 'from-slate-500 to-gray-400',
    'Moving & Packing': 'from-indigo-500 to-purple-400',
    'Other': 'from-gray-500 to-slate-400'
}

// Category name list for matching
const categoryNames = Object.keys(categoryIcons)

// Static provider profile image
const PROVIDER_PROFILE_IMAGE = '/provider.webp'

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
        // Check if keyword matches a category
        const matchedCategory = categoryNames.find(
            cat => cat.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        if (matchedCategory) {
            setSelectedCategory(matchedCategory)
        }
        fetchProviders({
            category: matchedCategory || selectedCategory,
            pincode: searchPincode,
            keyword: searchKeyword
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
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl"></div>
                    <h2 className="relative text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <FaSearch className="text-white" />
                        </div>
                        Find Service Providers
                    </h2>
                    <form onSubmit={handleSearch} className="relative flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search services (e.g., Plumber, Electrician)"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                            />
                        </div>
                        <div className="w-full md:w-56 relative group">
                            <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Enter your pincode"
                                value={searchPincode}
                                onChange={(e) => setSearchPincode(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Search
                            <FaArrowRight className="text-sm" />
                        </button>
                    </form>
                </div>

                {/* Categories */}
                {!searchKeyword && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4">Browse by Category</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`group relative p-4 rounded-xl border transition-all duration-300 overflow-hidden ${selectedCategory === category
                                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-transparent text-white shadow-lg shadow-blue-500/25'
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`text-2xl mb-2 transition-transform duration-300 group-hover:scale-110`}>
                                        {categoryIcons[category] || '📋'}
                                    </div>
                                    <div className="text-sm font-medium">{category}</div>
                                </button>
                            ))}
                        </div>
                        {selectedCategory && (
                            <div className="mt-4 flex items-center gap-3">
                                <span className="text-slate-400">Filtering by:</span>
                                <span className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium flex items-center gap-2">
                                    {categoryIcons[selectedCategory]} {selectedCategory}
                                    <button
                                        onClick={() => handleCategoryClick(selectedCategory)}
                                        className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center hover:bg-blue-500/50 transition-colors"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Providers List */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        {searchKeyword ? `Search Results for "${searchKeyword}"` : (selectedCategory ? `${selectedCategory} Providers` : 'All Providers')}
                        {searchPincode && <span className="text-slate-400 font-normal">in {searchPincode}</span>}
                        {!loading && <span className="ml-2 px-3 py-1 bg-white/10 rounded-full text-sm font-normal text-slate-400">{providers.length} found</span>}
                    </h2>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-slate-400">Finding providers...</p>
                        </div>
                    ) : providers.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FaSearch className="text-3xl text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Providers Found</h3>
                            <p className="text-slate-400 text-lg max-w-md mx-auto">
                                {searchKeyword
                                    ? `There are no providers for "${searchKeyword}"${searchPincode ? ` in pincode ${searchPincode}` : ''} at this time.`
                                    : 'Try adjusting your search filters or check another area.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {providers.map((provider) => (
                                <div key={provider._id} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                                    {/* Provider Header */}
                                    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-5">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="relative flex items-center gap-4">
                                            <img
                                                src={PROVIDER_PROFILE_IMAGE}
                                                alt={provider.name}
                                                className="w-16 h-16 rounded-xl bg-white object-cover shadow-lg ring-2 ring-white/20"
                                            />
                                            <div>
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    {provider.name}
                                                    {provider.isVerified && (
                                                        <FaCheckCircle className="text-green-300 text-sm" />
                                                    )}
                                                </h3>
                                                <div className="flex items-center gap-1 text-blue-100">
                                                    <FaMapMarkerAlt className="text-xs" />
                                                    <span className="text-sm">{provider.pincode}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        {/* Rating */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                <FaStar className="text-amber-400" />
                                                <span className="font-semibold text-amber-400">{provider.rating || '0.0'}</span>
                                            </div>
                                            <span className="text-slate-400 text-sm">{provider.totalReviews || 0} reviews</span>
                                        </div>

                                        {/* Services Preview */}
                                        <div className="mb-4">
                                            <p className="text-sm text-slate-400 mb-2">{provider.servicesCount || 0} services offered</p>
                                            <div className="flex flex-wrap gap-2">
                                                {provider.services?.slice(0, 2).map((service) => (
                                                    <span key={service._id} className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs flex items-center gap-1.5">
                                                        <span>{categoryIcons[service.category]}</span>
                                                        <span>{service.name}</span>
                                                    </span>
                                                ))}
                                                {provider.servicesCount > 2 && (
                                                    <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-400 rounded-lg text-xs">
                                                        +{provider.servicesCount - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            to={`/provider/${provider._id}`}
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group-hover:from-blue-600 group-hover:to-cyan-600"
                                        >
                                            View Profile & Services
                                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
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
