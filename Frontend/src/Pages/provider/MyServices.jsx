import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaRupeeSign, FaClock, FaTimes, FaCheck } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { serviceAPI } from '../../services/api'
import toast from 'react-hot-toast'

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

function MyServices() {
    const navigate = useNavigate()
    const [services, setServices] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Plumbing',
        basePrice: '',
        duration: '1-2 hours'
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchServices()
        fetchCategories()
    }, [])

    const fetchServices = async () => {
        try {
            const response = await serviceAPI.getMyServices()
            if (response.success) {
                setServices(response.data)
            }
        } catch (error) {
            console.error('Error fetching services:', error)
            if (error.response?.status === 401) {
                navigate('/login')
            }
        } finally {
            setLoading(false)
        }
    }

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const openAddModal = () => {
        setEditingService(null)
        setFormData({
            name: '',
            description: '',
            category: 'Plumbing',
            basePrice: '',
            duration: '1-2 hours'
        })
        setError('')
        setSuccess('')
        setShowModal(true)
    }

    const openEditModal = (service) => {
        setEditingService(service)
        setFormData({
            name: service.name,
            description: service.description,
            category: service.category,
            basePrice: service.basePrice,
            duration: service.duration
        })
        setError('')
        setSuccess('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setSubmitting(true)

        try {
            const data = {
                ...formData,
                basePrice: Number(formData.basePrice)
            }

            let response
            if (editingService) {
                response = await serviceAPI.updateService(editingService._id, data)
            } else {
                response = await serviceAPI.addService(data)
            }

            if (response.success) {
                toast.success(editingService ? 'Service updated successfully!' : 'Service added successfully!')
                fetchServices()
                setTimeout(() => {
                    setShowModal(false)
                }, 1500)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save service')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return

        try {
            const response = await serviceAPI.deleteService(serviceId)
            if (response.success) {
                setServices(services.filter(s => s._id !== serviceId))
                toast.success('Service deleted successfully')
            }
        } catch (error) {
            console.error('Error deleting service:', error)
            toast.error('Failed to delete service')
        }
    }

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
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Services</h1>
                        <p className="text-slate-400 mt-1">Manage your service offerings</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <FaPlus />
                        Add Service
                    </button>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-slate-400">Loading services...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🛠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Services Yet</h2>
                        <p className="text-slate-400 mb-6">Add your first service to start receiving bookings from customers.</p>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                        >
                            <FaPlus />
                            Add Your First Service
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service._id} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                                <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl">{categoryIcons[service.category] || '📋'}</span>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${service.isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                            <FaRupeeSign className="text-sm" />
                                            <span className="text-lg">{service.basePrice}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                            <FaClock />
                                            <span>{service.duration}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm mb-4">
                                        <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-slate-400">{service.category}</span>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => openEditModal(service)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-all font-medium"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-all font-medium"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 rounded-t-3xl">
                            <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
                            <div className="relative flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingService ? 'Edit Service' : 'Add New Service'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Pipe Repair"
                                    className="w-full px-4 py-4 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-700 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-4 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:bg-slate-700 transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name} className="bg-slate-800">
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    placeholder="Describe your service..."
                                    className="w-full px-4 py-4 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-700 transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Base Price (₹)</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="500"
                                        className="w-full px-4 py-4 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:bg-slate-700 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Duration</label>
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 focus:bg-slate-700 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="30 mins" className="bg-slate-800">30 mins</option>
                                        <option value="1 hour" className="bg-slate-800">1 hour</option>
                                        <option value="1-2 hours" className="bg-slate-800">1-2 hours</option>
                                        <option value="2-3 hours" className="bg-slate-800">2-3 hours</option>
                                        <option value="Half day" className="bg-slate-800">Half day</option>
                                        <option value="Full day" className="bg-slate-800">Full day</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            {editingService ? 'Update Service' : 'Add Service'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyServices
