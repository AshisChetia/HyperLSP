import { Link } from 'react-router-dom'
import {
    FaWrench, FaBolt, FaBroom, FaPaintRoller, FaCar, FaLeaf,
    FaArrowLeft, FaSearch, FaArrowRight, FaHammer, FaFan,
    FaBug, FaSpa, FaHome, FaBox, FaClipboardList
} from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'

function Services() {
    const services = [
        {
            icon: FaWrench,
            name: 'Plumbing',
            description: 'Leak repairs, pipe installation, and maintenance.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: FaBolt,
            name: 'Electrical',
            description: 'Wiring, repairs, and electrical installations.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: FaBroom,
            name: 'Cleaning',
            description: 'Home and office deep cleaning services.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: FaHammer,
            name: 'Carpentry',
            description: 'Custom furniture, repairs, and woodworks.',
            color: 'from-amber-600 to-yellow-600'
        },
        {
            icon: FaPaintRoller,
            name: 'Painting',
            description: 'Interior and exterior wall painting.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: FaFan, // AC & Appliance
            name: 'AC & Appliance',
            description: 'AC service, refrigerator and appliance repairs.',
            color: 'from-cyan-400 to-blue-400'
        },
        {
            icon: FaBug,
            name: 'Pest Control',
            description: 'Termite, cockroach, and general pest control.',
            color: 'from-red-500 to-rose-600'
        },
        {
            icon: FaSpa,
            name: 'Beauty & Spa',
            description: 'At-home salon, makeup, and relaxation services.',
            color: 'from-pink-400 to-rose-400'
        },
        {
            icon: FaHome,
            name: 'Home Repair',
            description: 'General home maintenance and odd jobs.',
            color: 'from-indigo-500 to-violet-500'
        },
        {
            icon: FaBox,
            name: 'Moving & Packing',
            description: 'House shifting and relocation services.',
            color: 'from-orange-600 to-red-600'
        },
        {
            icon: FaCar,
            name: 'Car Service',
            description: 'Car wash, repair, and roadside assistance.',
            color: 'from-red-500 to-rose-500'
        },
        {
            icon: FaLeaf,
            name: 'Gardening',
            description: 'Lawn care, planting, and landscape design.',
            color: 'from-lime-500 to-green-500'
        },
        {
            icon: FaClipboardList,
            name: 'Other',
            description: 'Miscellaneous services tailored to your needs.',
            color: 'from-gray-500 to-slate-500'
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">
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
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="pt-32 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Our Services
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Explore our wide range of professional services designed to make your life easier.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group border border-slate-100 hover:border-blue-100 flex flex-col items-start"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                                <service.icon className="text-2xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                            <p className="text-slate-600 mb-4 text-sm flex-grow">{service.description}</p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
                            >
                                Book Service
                                <FaArrowRight />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Need something specific?</h2>
                            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                                If you can't find the service you're looking for, let us know and we'll help you out.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Services
