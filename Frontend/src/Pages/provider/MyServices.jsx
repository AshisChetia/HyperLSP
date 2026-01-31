import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaRupeeSign, FaClock } from 'react-icons/fa'
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">My Services</h1>
                        <p className="text-slate-500 mt-1">Manage your service offerings</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        <FaPlus />
                        Add Service
                    </button>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading services...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🛠️</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Services Yet</h2>
                        <p className="text-slate-500 mb-6">Add your first service to start receiving bookings from customers.</p>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            <FaPlus />
                            Add Your First Service
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl">{categoryIcons[service.category] || '📋'}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${service.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{service.name}</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <FaRupeeSign className="text-green-500" />
                                            <span className="font-semibold">{service.basePrice}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <FaClock className="text-blue-500" />
                                            <span className="text-sm">{service.duration}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded">{service.category}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(service)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-white">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">


                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Pipe Repair"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    placeholder="Describe your service..."
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Base Price (₹)</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        placeholder="500"
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Duration</label>
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-400 transition-all"
                                    >
                                        <option value="30 mins">30 mins</option>
                                        <option value="1 hour">1 hour</option>
                                        <option value="1-2 hours">1-2 hours</option>
                                        <option value="2-3 hours">2-3 hours</option>
                                        <option value="Half day">Half day</option>
                                        <option value="Full day">Full day</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : (editingService ? 'Update Service' : 'Add Service')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all"
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
