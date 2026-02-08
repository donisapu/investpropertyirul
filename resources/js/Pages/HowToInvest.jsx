import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Wallet, 
    Coins,
    Building2, 
    Gavel, 
    Users, 
    ArrowRight, 
    CheckCircle2, 
    ShieldCheck, 
    TrendingUp,
    Search,
    FileText,
    CreditCard
} from 'lucide-react';

export default function HowToInvest({ auth }) {
    const steps = [
        {
            icon: <Search className="w-8 h-8 text-emerald-600" />,
            title: "1. Explore Properties",
            description: "Browse our curated selection of high-potential properties. Filter by location, price, and investment type (Investment, Crowdfunding, or Auction)."
        },
        {
            icon: <FileText className="w-8 h-8 text-emerald-600" />,
            title: "2. Review Details",
            description: "Analyze detailed reports, financial projections, and legal documents for each property. We ensure full transparency."
        },
        {
            icon: <Wallet className="w-8 h-8 text-emerald-600" />,
            title: "3. Choose Your Method",
            description: "Decide whether to invest via tokenized equity (Investment), fractional lending (Crowdfunding), or full ownership (Auction)."
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
            title: "4. Invest & Earn",
            description: "Complete your transaction securely. Track your portfolio performance and receive returns directly to your wallet."
        }
    ];

    const methods = [
        {
            title: "Property Investment",
            icon: <Building2 className="w-12 h-12 text-emerald-600 mb-4" />,
            description: "Buy property tokens for direct equity ownership. Benefit from capital appreciation and potential rental dividends with clear ROI targets.",
            features: [
                "Tokenized equity",
                "Capital appreciation",
                "Medium-long term",
                "Direct ownership share"
            ],
            color: "emerald",
            link: route('investments.index')
        },
        {
            title: "Crowdfunding",
            icon: <Users className="w-12 h-12 text-blue-600 mb-4" />,
            description: "Participate in collective property financing. Earn fixed returns over a set period by contributing to property development or acquisition.",
            features: [
                "Fixed tenor & ROI",
                "Low minimum entry",
                "Passive income",
                "Short-medium term"
            ],
            color: "blue",
            link: route('crowdfunding.index')
        },
        {
            title: "Auctions & Cessie",
            icon: <Gavel className="w-12 h-12 text-amber-600 mb-4" />,
            description: "Bid for properties below market value. Acquire full ownership rights through transparent auction processes or bank cessie rights.",
            features: [
                "Below market value",
                "Full ownership",
                "High return potential",
                "Asset flipping"
            ],
            color: "amber",
            link: route('auctions.index')
        }
    ];

    return (
        <PublicLayout auth={auth}>
            <Head title="How to Invest" />

            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Start Your Real Estate <span className="text-emerald-400">Investment Journey</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        We make property investment accessible, transparent, and profitable. Choose the path that fits your goals.
                    </p>
                    {!auth.user && (
                        <Link
                            href={route('register')}
                            className="inline-flex items-center px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Investment Methods */}
            <div className="py-20 bg-slate-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Three Ways to Invest</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Whether you want to start small or go big, we have the right investment model for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {methods.map((method, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                                <div className={`p-3 rounded-xl inline-block bg-${method.color}-50 mb-6`}>
                                    {method.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{method.title}</h3>
                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    {method.description}
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {method.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-slate-700">
                                            <CheckCircle2 className={`w-5 h-5 text-${method.color}-500 mr-3`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={method.link}
                                    className={`block w-full text-center py-3 rounded-xl font-semibold border-2 border-${method.color}-500 text-${method.color}-600 hover:bg-${method.color}-50 transition-colors`}
                                >
                                    Browse {method.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step by Step */}
            <div className="py-20 bg-white px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600">Simple steps to build your property portfolio.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-100 transition-colors">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trust Section */}
            <div className="py-20 bg-slate-900 text-white px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6">Why Invest With Us?</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Due Diligence First</h4>
                                    <p className="text-slate-400 text-sm">Every property undergoes a rigorous legal and financial check before listing.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Building2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Premium Assets</h4>
                                    <p className="text-slate-400 text-sm">Access to exclusive properties and high-yield opportunities usually reserved for institutions.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CreditCard className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-bold mb-1">Secure Transactions</h4>
                                    <p className="text-slate-400 text-sm">All financial transactions are encrypted and handled through regulated payment gateways.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 bg-slate-800 p-8 rounded-2xl border border-slate-700">
                        <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
                        <p className="text-slate-400 mb-6">Join thousands of investors building wealth through real estate today.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href={route('register')} 
                                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-bold rounded-xl transition-colors"
                            >
                                Sign Up Now
                            </Link>
                            <Link 
                                href={route('crowdfunding.index')} 
                                className="flex-1 py-3 bg-transparent border border-slate-600 hover:border-emerald-500 text-white text-center font-bold rounded-xl transition-colors"
                            >
                                Browse Properties
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
