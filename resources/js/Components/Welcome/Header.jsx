import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';

export default function Header() {
    const { auth, settings } = usePage().props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper for conditionally applying classes
    const navClass = (scrolled || open) ? 'text-slate-900' : 'text-white';
    const headerClass = (scrolled || open) ? 'bg-white border-b border-slate-200 shadow-sm' : 'bg-slate-700/20 border-b border-transparent';

    return (
        <header className={`sticky top-0 z-50 transition-colors duration-300 ${headerClass}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <img 
                                src={settings?.logo ? (settings.logo.startsWith('http') || settings.logo.startsWith('/') ? settings.logo : `/storage/${settings.logo}`) : "/assets/img/logo.png"} 
                                alt="logo" 
                                className="h-10 w-auto sm:h-12 lg:h-14 object-contain max-w-[150px] sm:max-w-[200px]" 
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <nav className={`hidden min-[900px]:flex items-center gap-2 xl:gap-3 text-[0.7rem] xl:text-sm font-medium uppercase tracking-wide ${navClass}`}>
                        <Link href="/" className="hover:text-emerald-600 transition-colors">HOME</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/investments" className="hover:text-emerald-600 transition-colors">INVESTMENT</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/crowdfunding" className="hover:text-emerald-600 transition-colors">CROWDFUNDING</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="#property" className="hover:text-emerald-600 transition-colors">PROPERTY FOR SALE</Link>
                        <span className="text-slate-300">|</span>
                        <Link href={route('auctions.index')} className="hover:text-emerald-600 transition-colors">LELANG/CESSIE</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/how-to-invest" className="hover:text-emerald-600 transition-colors">HOW TO INVEST</Link>
                        <span className="text-slate-300">|</span>

                        <a href={route(auth.user ? 'admin.dashboard' : 'login')} className="hover:text-emerald-600 transition-colors font-bold text-emerald-400">MY ACCOUNT</a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex min-[900px]:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                            aria-controls="mobile-menu"
                            aria-expanded={open}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon: Menu */}
                            {!open ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            ) : (
                                /* Icon: X */
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="min-[900px]:hidden bg-white border-t border-slate-200" id="mobile-menu">
                    <div className="space-y-1 px-4 py-6">
                        <Link href="/" className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">HOME</Link>
                        <Link href={route('investments.index')} className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">INVESTMENT</Link>
                        <Link href={route('crowdfunding.index')} className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">CROWDFUNDING</Link>
                        <a href="#property" className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">PROPERTY FOR SALE</a>
                        <a href={route('auctions.index')} className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">LELANG/CESSIE</a>
                        <a href="/how-to-invest" className="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">HOW TO INVEST</a>

                        <div className="mt-4 border-t border-slate-100 pt-4">
                            <a href={route(auth.user ? 'admin.dashboard' : 'login')} className="block rounded-md py-2 px-3 text-base font-bold text-emerald-400 hover:bg-emerald-50">MY ACCOUNT</a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
