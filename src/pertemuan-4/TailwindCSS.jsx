export default function TailwindCSS() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <FlexboxGrid />

            {/* Hero Section */}
            <HeroSection />

            {/* Main Content Container */}
            <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">

                {/* Spacing & Cards Section */}
                <section>
                    <SectionTitle 
                        title="Spacing & Layout" 
                        subtitle="Padding, margin, dan card layouts"
                        color="blue"
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                        <Spacing />
                        <Spacing variant="purple" />
                    </div>
                </section>

                {/* Typography Section */}
                <section>
                    <SectionTitle 
                        title="Typography" 
                        subtitle="Font sizes, weights, dan colors"
                        color="purple"
                    />
                    <Typography />
                </section>

                {/* Interactive Elements Section */}
                <section>
                    <SectionTitle 
                        title="Interactive Elements" 
                        subtitle="Buttons, hover effects, dan transitions"
                        color="green"
                    />
                    <div className="grid md:grid-cols-3 gap-6">
                        <BorderRadius />
                        <BackgroundColors />
                        <ShadowEffects />
                    </div>
                </section>

                {/* CTA Section */}
                <CTASection />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}

// Section Title Component
function SectionTitle({ title, subtitle, color }) {
    const colors = {
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        green: "bg-green-500",
        orange: "bg-orange-500"
    }

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-1.5 h-8 ${colors[color]} rounded-full`}></div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-600 ml-5">{subtitle}</p>
        </div>
    )
}

// Hero Section
function HeroSection() {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                    ✨ Tailwind CSS v4.0
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Belajar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Tailwind CSS</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Framework CSS utility-first yang membuat styling menjadi cepat, 
                    fleksibel, dan menyenangkan untuk React applications.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                        Mulai Belajar
                    </button>
                    <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                        Dokumentasi
                    </button>
                </div>
            </div>
        </div>
    )
}

// Updated Spacing Component with variants
function Spacing({ variant = "default" }) {
    const styles = {
        default: {
            bg: "bg-white",
            icon: "bg-blue-100 text-blue-600",
            title: "text-gray-900"
        },
        purple: {
            bg: "bg-gradient-to-br from-purple-50 to-white",
            icon: "bg-purple-100 text-purple-600",
            title: "text-purple-900"
        }
    }

    const style = styles[variant]

    return (
        <div className={`${style.bg} shadow-lg hover:shadow-xl p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}>
            <div className={`w-12 h-12 ${style.icon} rounded-xl flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 1h-2a1 1 0 01-1-1v-6z"/>
                </svg>
            </div>
            <h2 className={`text-xl font-bold ${style.title} mb-2`}>Card Title</h2>
            <p className="text-gray-600 leading-relaxed">
                Ini adalah contoh penggunaan padding dan margin di Tailwind. 
                Card ini menggunakan <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-blue-600">p-6</code> dan{' '}
                <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-blue-600">rounded-2xl</code>.
            </p>
        </div>
    )
}

// Updated Typography Component
function Typography() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                    Typography yang <span className="text-blue-600">Powerful</span>
                </h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    Tailwind menyediakan utilities lengkap untuk mengontrol ukuran font, 
                    weight, warna, spacing, dan line height. Styling teks menjadi sangat mudah.
                </p>

                {/* Typography Scale Demo */}
                <div className="space-y-4 border-t border-gray-100 pt-6">
                    <div className="flex items-baseline gap-4">
                        <span className="text-xs font-mono text-gray-400 w-20">text-xs</span>
                        <span className="text-xs text-gray-600">Extra small text</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="text-sm font-mono text-gray-400 w-20">text-sm</span>
                        <span className="text-sm text-gray-600">Small text</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="text-base font-mono text-gray-400 w-20">text-base</span>
                        <span className="text-base text-gray-600">Base text size</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="text-lg font-mono text-gray-400 w-20">text-lg</span>
                        <span className="text-lg text-gray-600">Large text</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <span className="text-xl font-mono text-gray-400 w-20">text-xl</span>
                        <span className="text-xl font-semibold text-gray-800">Extra large with weight</span>
                    </div>
                </div>

                {/* Font Weights */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                    <span className="font-light text-gray-600">Light</span>
                    <span className="font-normal text-gray-600">Normal</span>
                    <span className="font-medium text-gray-600">Medium</span>
                    <span className="font-semibold text-gray-600">Semibold</span>
                    <span className="font-bold text-gray-600">Bold</span>
                    <span className="font-extrabold text-gray-600">Extrabold</span>
                </div>
            </div>
        </div>
    )
}

// Updated BorderRadius Component
function BorderRadius() {
    return (
        <div className="bg-white shadow-lg p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Border Radius</h3>
            <div className="space-y-4">
                <button className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-3 rounded-lg font-medium transition-all duration-300">
                    rounded-lg
                </button>
                <button className="w-full border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-4 py-3 rounded-xl font-medium transition-all duration-300">
                    rounded-xl
                </button>
                <button className="w-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-3 rounded-2xl font-medium transition-all duration-300">
                    rounded-2xl
                </button>
                <button className="w-full border-2 border-gray-400 text-gray-600 hover:bg-gray-400 hover:text-white px-4 py-3 rounded-full font-medium transition-all duration-300">
                    rounded-full
                </button>
            </div>
        </div>
    )
}

// Updated BackgroundColors Component
function BackgroundColors() {
    return (
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Colors</h3>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-300"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
            </div>
            <p className="text-green-100 mb-4">
                Belajar Tailwind itu seru dengan color palette yang lengkap!
            </p>
            <div className="flex gap-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-mono">bg-green-500</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-mono">hover:bg-green-700</span>
            </div>
        </div>
    )
}

// Updated ShadowEffects Component
function ShadowEffects() {
    return (
        <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Shadow Effects</h3>
            <p className="text-gray-600 mb-4">
                Hover card ini untuk melihat efek bayangan yang meningkat.
            </p>
            <div className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded">
                hover:shadow-2xl transition-all
            </div>
        </div>
    )
}

// Updated FlexboxGrid Component (Navigation)
function FlexboxGrid() {
    return (
        <nav className="sticky top-0 z-50 bg-gray-900 shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="text-xl font-bold text-white">MyWebsite</span>
                    </div>

                    <ul className="hidden md:flex items-center gap-8">
                        <li><a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Home</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">About</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Contact</a></li>
                        <li>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                                Get Started
                            </button>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    )
}

// CTA Section
function CTASection() {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap untuk memulai?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Pelajari lebih lanjut tentang Tailwind CSS dan buat website yang menakjubkan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                    Mulai Sekarang
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
                    Lihat Contoh
                </button>
            </div>
        </div>
    )
}

// Footer
function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-xl">T</span>
                            </div>
                            <span className="text-xl font-bold">Tailwind Showcase</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Showcase komponen Tailwind CSS yang dirangkai dengan aesthetic dan modern design principles untuk React applications.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-200">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Components</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-200">Connect</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; 2026 Tailwind Showcase. Built with Tailwind CSS v4.0 & React.</p>
                </div>
            </div>
        </footer>
    )
}