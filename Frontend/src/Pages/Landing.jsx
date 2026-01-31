import { Link } from 'react-router-dom'
import {
    FaSearch, FaCalendarCheck, FaStar, FaShieldAlt, FaClock, FaMapMarkerAlt,
    FaUsers, FaHandshake, FaChartLine, FaTools, FaHome, FaCar, FaBroom,
    FaWrench, FaPaintRoller, FaBolt, FaLeaf, FaArrowRight, FaCheck, FaPlay
} from 'react-icons/fa'
import { HiSparkles, HiLightningBolt } from 'react-icons/hi'

function Landing() {
    const services = [
        { icon: FaWrench, name: 'Plumbing', color: 'from-blue-500 to-cyan-500' },
        { icon: FaBolt, name: 'Electrician', color: 'from-yellow-500 to-orange-500' },
        { icon: FaBroom, name: 'Cleaning', color: 'from-green-500 to-emerald-500' },
        { icon: FaPaintRoller, name: 'Painting', color: 'from-purple-500 to-pink-500' },
        { icon: FaCar, name: 'Car Service', color: 'from-red-500 to-rose-500' },
        { icon: FaLeaf, name: 'Gardening', color: 'from-lime-500 to-green-500' },
    ]

    const howItWorks = [
        {
            step: '01',
            title: 'Search Services',
            description: 'Browse through verified service providers in your area based on your needs.',
            icon: FaSearch,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            step: '02',
            title: 'Book Instantly',
            description: 'Select a convenient time slot and book your service with just a few clicks.',
            icon: FaCalendarCheck,
            color: 'from-orange-500 to-amber-500'
        },
        {
            step: '03',
            title: 'Get Service',
            description: 'Our verified professional arrives at your doorstep and completes the job.',
            icon: FaTools,
            color: 'from-green-500 to-emerald-500'
        },
        {
            step: '04',
            title: 'Rate & Review',
            description: 'Share your experience and help others find the best service providers.',
            icon: FaStar,
            color: 'from-purple-500 to-pink-500'
        },
    ]

    const benefits = [
        {
            icon: FaShieldAlt,
            title: 'Verified Professionals',
            description: 'All service providers undergo thorough background verification for your safety.',
            color: 'text-blue-500'
        },
        {
            icon: FaClock,
            title: 'On-Time Service',
            description: 'Punctual professionals who value your time and deliver as promised.',
            color: 'text-orange-500'
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Hyperlocal Network',
            description: 'Connect with skilled professionals right in your neighborhood.',
            color: 'text-green-500'
        },
        {
            icon: FaStar,
            title: 'Quality Assured',
            description: 'Transparent ratings and reviews from real customers.',
            color: 'text-purple-500'
        },
    ]

    const stats = [
        { number: '10,000+', label: 'Service Providers' },
        { number: '50,000+', label: 'Happy Customers' },
        { number: '100+', label: 'Service Categories' },
        { number: '500+', label: 'Cities Covered' },
    ]

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <HiSparkles className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                                HyperLSP
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">How it Works</a>
                            <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Services</a>
                            <a href="#benefits" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Benefits</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-slate-50 via-blue-50/50 to-orange-50/50">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full mb-6">
                                <HiLightningBolt className="text-orange-500" />
                                <span className="text-sm font-semibold text-slate-700">Your Trusted Service Marketplace</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                                Find Trusted
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Local Services </span>
                                at Your Doorstep
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                                Connect with verified service providers in your neighborhood. From plumbing to painting,
                                get any service you need with just a few clicks.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                                >
                                    Book a Service
                                    <FaArrowRight />
                                </Link>
                                <Link
                                    to="/signup?role=provider"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105"
                                >
                                    Become a Provider
                                    <FaTools />
                                </Link>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br ${i === 1 ? 'from-blue-400 to-blue-600' :
                                            i === 2 ? 'from-orange-400 to-orange-600' :
                                                i === 3 ? 'from-green-400 to-green-600' : 'from-purple-400 to-purple-600'
                                            }`}></div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((i) => <FaStar key={i} className="text-sm" />)}
                                    </div>
                                    <p className="text-sm text-slate-600">Trusted by 50,000+ customers</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                                <div className="grid grid-cols-2 gap-4">
                                    {services.map((service, index) => (
                                        <div
                                            key={index}
                                            className="p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all cursor-pointer group hover:bg-white"
                                        >
                                            <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                <service.icon className="text-2xl text-white" />
                                            </div>
                                            <h3 className="font-semibold text-slate-800">{service.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-blue-100 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                            Simple Process
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Getting your service done is as easy as 1-2-3-4. Just follow these simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="relative group">
                                {index < howItWorks.length - 1 && (
                                    <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent"></div>
                                )}
                                <div className="bg-slate-50 rounded-3xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 relative z-10">
                                    <div className="text-6xl font-bold text-slate-100 absolute top-4 right-6 group-hover:text-slate-200 transition-colors">
                                        {item.step}
                                    </div>
                                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <item.icon className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                    <p className="text-slate-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
                            Our Services
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                            Services We Offer
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            From home repairs to personal care, we've got all your service needs covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-slate-100 hover:border-transparent"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <service.icon className="text-2xl text-white" />
                                </div>
                                <h3 className="font-semibold text-slate-800">{service.name}</h3>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                        >
                            View All Services
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-4">
                                Why Choose Us
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                                Benefits for Our Community
                            </h2>
                            <p className="text-lg text-slate-600 mb-8">
                                We're building a platform that benefits everyone - customers get reliable services,
                                and providers get opportunities to grow their business.
                            </p>

                            <div className="space-y-6">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className={`w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 ${benefit.color}`}>
                                            <benefit.icon className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">{benefit.title}</h3>
                                            <p className="text-slate-600">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-3xl blur-3xl"></div>
                            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white">
                                <h3 className="text-2xl font-bold mb-6">For Service Providers</h3>
                                <ul className="space-y-4">
                                    {[
                                        'Reach thousands of customers in your area',
                                        'Flexible working hours - be your own boss',
                                        'Secure and timely payments',
                                        'Build your reputation with reviews',
                                        'Grow your business with our support',
                                        'Get training and skill development'
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FaCheck className="text-xs" />
                                            </div>
                                            <span className="text-slate-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/signup?role=provider"
                                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                                >
                                    Join as Provider
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Impact Section */}
            <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-40 h-40 border border-white rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-60 h-60 border border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white rounded-full"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center text-white">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            Empowering Local Communities
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
                            We believe in creating a sustainable ecosystem where local service providers thrive,
                            and communities get access to quality services at fair prices.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FaUsers className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Job Creation</h3>
                                <p className="text-blue-100">Empowering local workers with sustainable income opportunities</p>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FaHandshake className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Trust Building</h3>
                                <p className="text-blue-100">Creating verified connections between customers and providers</p>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FaChartLine className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Economic Growth</h3>
                                <p className="text-blue-100">Boosting local economy through increased service accessibility</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 lg:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl"></div>

                        <div className="relative text-center">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                                Join thousands of satisfied customers and service providers on HyperLSP today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                                >
                                    Find a Service
                                    <FaSearch />
                                </Link>
                                <Link
                                    to="/signup?role=provider"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-105"
                                >
                                    Become a Provider
                                    <FaTools />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
                                    <HiSparkles className="text-white text-xl" />
                                </div>
                                <span className="text-2xl font-bold">HyperLSP</span>
                            </div>
                            <p className="text-slate-400">
                                Connecting you with trusted local service providers for all your needs.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">For Providers</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Join as Provider</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Provider Benefits</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Legal</h4>
                            <ul className="space-y-3 text-slate-400">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
                        <p>&copy; 2026 HyperLSP. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
