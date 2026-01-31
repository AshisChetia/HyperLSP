import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaCommentAlt } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import toast from 'react-hot-toast'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Simulate API call
        console.log('Form Submitted:', formData)

        // Show success toast
        toast.success('Message Sent Successfully! We will contact you soon.', {
            duration: 5000,
            icon: '🚀'
        })

        // Clear form
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        })
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/services" className="text-slate-600 hover:text-slate-900 transition-colors">
                                <FaArrowLeft className="text-xl" />
                            </Link>
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <HiSparkles className="text-white text-sm" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                                    HyperLSP
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Support</h1>
                        <p className="text-slate-600">
                            Have a question or need a special service? Fill out the form below and we'll get back to you.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaPhone className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number (Optional)"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                                    <FaCommentAlt className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <textarea
                                    name="message"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <FaPaperPlane />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
