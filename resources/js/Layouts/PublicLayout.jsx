import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Helper to check active route
    const isActive = (path) => url === path || (path !== '/' && url.startsWith(path));
    
    // Determine if we are on the home page
    const isHome = window.location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (isHome) {
                setIsScrolled(window.scrollY > 40);
            } else {
                setIsScrolled(true);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
            {/* Header */}
            <header
                className={`sticky top-0 z-50 transition-colors duration-300 ${
                    (isScrolled || isMobileMenuOpen)
                        ? 'bg-white border-b border-slate-200 shadow-sm'
                        : 'bg-slate-700/15 border-b border-transparent'
                }`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <a href="/">
                                <img src="/assets/img/logo.png" alt="logo" className="h-10 w-auto sm:h-12 lg:h-14 object-contain max-w-[150px] sm:max-w-[200px]" />
                            </a>
                        </div>

                        {/* Desktop Menu */}
                        <nav
                            className={`hidden min-[900px]:flex items-center gap-2 xl:gap-3 text-[0.7rem] xl:text-sm font-medium uppercase tracking-wide ${
                                (isScrolled || isMobileMenuOpen) ? 'text-slate-900' : 'text-white'
                            }`}
                        >
                            <a href="/" className={`${isActive('/') ? 'text-emerald-700 font-bold' : 'hover:text-emerald-600'} transition-colors`}>HOME</a>
                            <span className="text-slate-300">|</span>
                            <Link href="/investments" className={`${isActive('/investments') ? 'text-emerald-700 font-bold' : 'hover:text-emerald-600'} transition-colors`}>INVESTMENT</Link>
                            <span className="text-slate-300">|</span>
                            <Link href="/crowdfunding" className={`${isActive('/crowdfunding') ? 'text-emerald-700 font-bold' : 'hover:text-emerald-600'} transition-colors`}>CROWDFUNDING</Link>
                            <span className="text-slate-300">|</span>
                            <a href="#properti" className="hover:text-emerald-600 transition-colors">PROPERTY FOR SALE</a>
                            <span className="text-slate-300">|</span>
                            <Link href="/auctions" className={`${isActive('/auctions') ? 'text-emerald-700 font-bold' : 'hover:text-emerald-600'} transition-colors`}>LELANG/CESSIE</Link>
                            <span className="text-slate-300">|</span>
                            <Link href="/how-to-invest" className={`${isActive('/how-to-invest') ? 'text-emerald-700 font-bold' : 'hover:text-emerald-600'} transition-colors`}>HOW TO INVEST</Link>
                            <span className="text-slate-300">|</span>
                            
                            {auth.user ? (
                                <a href="/dashboard" className="hover:text-emerald-600 transition-colors font-bold text-emerald-700">MY ACCOUNT</a>
                            ) : (
                                <a href="/login" className="hover:text-emerald-600 transition-colors font-bold">MY ACCOUNT</a>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex min-[900px]:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                type="button"
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isMobileMenuOpen ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="min-[900px]:hidden bg-white border-t border-slate-200">
                        <div className="space-y-1 px-4 py-6">
                            <a href="/" className={`block rounded-md py-2 px-3 text-base font-medium ${isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-900 hover:bg-slate-50 hover:text-emerald-600'}`}>HOME</a>
                            <Link href="/investments" className={`block rounded-md py-2 px-3 text-base font-medium ${isActive('/investments') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-900 hover:bg-slate-50 hover:text-emerald-600'}`}>INVESTMENT</Link>
                            <Link href="/crowdfunding" className={`block rounded-md py-2 px-3 text-base font-medium ${isActive('/crowdfunding') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-900 hover:bg-slate-50 hover:text-emerald-600'}`}>CROWDFUNDING</Link>
                            <a href="#properti" className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">PROPERTY FOR SALE</a>
                            <Link href="/auctions" className={`block rounded-md py-2 px-3 text-base font-medium ${isActive('/auctions') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-900 hover:bg-slate-50 hover:text-emerald-600'}`}>LELANG/CESSIE</Link>
                            <Link href="/how-to-invest" className={`block rounded-md py-2 px-3 text-base font-medium ${isActive('/how-to-invest') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-900 hover:bg-slate-50 hover:text-emerald-600'}`}>HOW TO INVEST</Link>
                            <a href="#properti" className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">DEVELOPER</a>
                            
                            <div className="mt-4 border-t border-slate-100 pt-4">
                                {auth.user ? (
                                    <a href="/dashboard" className="block rounded-md py-2 px-3 text-base font-bold text-emerald-700 hover:bg-emerald-50">MY ACCOUNT</a>
                                ) : (
                                    <a href="/login" className="block rounded-md py-2 px-3 text-base font-bold text-slate-900 hover:bg-slate-50 hover:text-emerald-600">MY ACCOUNT</a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

function Footer() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', checkScroll);
        
        return () => {
            window.removeEventListener('resize', checkScroll);
            if (el) el.removeEventListener('scroll', checkScroll);
        };
    }, []);

    const scroll = (offset) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-white text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="flex gap-2 items-center justify-center">
                        <span className="inline-block rounded-lg bg-amber-200 px-2 py-1 text-amber-900 text-2xl sm:text-3xl font-semibold tracking-wide">Partner</span>
                        <h2 className="text-2xl sm:text-3xl font-semibold">Kami</h2>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        Kami memiliki beberapa partner yang membantu kami dalam membangun rumah untuk klien-klien kami.
                    </p>
                </div>

                <div className="mt-6 relative group">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll(-300)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow border border-slate-200 text-slate-700 hover:bg-slate-50 z-10 flex items-center justify-center"
                        >
                            ‹
                        </button>
                    )}
                    
                    <div
                        ref={scrollRef}
                        className="overflow-x-auto flex items-center justify-center whitespace-nowrap scrollbar-hide px-10 no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="inline-flex items-center gap-8">
                            <img src="https://dummyimage.com/120x40/eaecf0/111&text=Mandiri" alt="Mandiri" className="h-10 object-contain" />
                            <img src="https://dummyimage.com/120x40/eaecf0/111&text=BRI" alt="BRI" className="h-10 object-contain" />
                            <img src="https://dummyimage.com/120x40/eaecf0/111&text=BNI" alt="BNI" className="h-10 object-contain" />
                            <img src="https://dummyimage.com/120x40/eaecf0/111&text=Bule" alt="Bule" className="h-10 object-contain" />
                            <img src="https://dummyimage.com/120x40/eaecf0/111&text=X+I+BOBA" alt="X I BOBA" className="h-10 object-contain" />
                            <img src="https://dummyimage.com/120x40/eaecf0/111&text=Partner" alt="Partner" className="h-10 object-contain" />
                        </div>
                    </div>

                    {canScrollRight && (
                        <button
                            onClick={() => scroll(300)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow border border-slate-200 text-slate-700 hover:bg-slate-50 z-10 flex items-center justify-center"
                        >
                            ›
                        </button>
                    )}
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-base font-semibold">Tentang Kami</h3>
                        <p className="mt-2 text-sm text-slate-700">
                            PT. Umah Bali Mesari adalah perusahaan yang bergerak di bidang Developer dan Kontraktor yang berbasis di Bali dengan visi dan misi serta jangkauan layanan yang menyeluruh yang dipersembahkan untuk kepuasan konsumen.
                        </p>
                        <div className="mt-2 text-sm text-slate-700">
                            <span className="mr-2">📍</span> Jalan Raya Singaraja – Seririt, Desa Penarom, Buleleng, Bali
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold">Beranda</h3>
                        <ul className="mt-2 space-y-1 text-sm">
                            <li><a href="#properti" className="hover:text-emerald-600">Investment</a></li>
                            <li><a href="#properti" className="hover:text-emerald-600">Crowdfunding</a></li>
                            <li><a href="#properti" className="hover:text-emerald-600">Lelang/Cessie</a></li>
                            <li><a href="#properti" className="hover:text-emerald-600">Property for Sale</a></li>
                            <li><a href="#fitur" className="hover:text-emerald-600">How to Invest</a></li>
                            <li><a href="#properti" className="hover:text-emerald-600">Development</a></li>
                            <li><a href="#properti" className="hover:text-emerald-600">ROI Simulator</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold">Hubungi Kami</h3>
                        <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex items-center gap-2"><span className="text-slate-500">📞</span><a href="tel:+62818580891" className="hover:text-emerald-600">+62818580891</a></li>
                            <li className="flex items-center gap-2"><span className="text-slate-500">✉️</span><a href="mailto:umahbalimesari@gmail.com" className="hover:text-emerald-600">umahbalimesari@gmail.com</a></li>
                        </ul>
                        <div className="mt-4 flex items-center gap-3">
                            <a href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600" aria-label="Facebook">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0022 12z"/></svg>
                            </a>
                            <a href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600" aria-label="Instagram">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z"/></svg>
                            </a>
                            <a href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600" aria-label="YouTube">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.8 3.6 12 3.6 12 3.6s-7.8 0-9.4.5A3 3 0 00.6 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.6 5.8 3 3 0 002.1 2.1c1.6.5 9.4.5 9.4.5s7.8 0 9.4-.5a3 3 0 002.1-2.1c.4-1.9.6-3.8.6-5.8s-.2-3.9-.6-5.8zM9.7 15.5V8.5l6.2 3.5-6.2 3.5z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600">
                    <p className="text-[0.8rem]">
                        © {new Date().getFullYear()} InvestProperti
                    </p>
                    <p className="text-[0.8rem]">
                        Laravel v10 · PHP v8
                    </p>
                </div>
            </div>
        </footer>
    );
}
