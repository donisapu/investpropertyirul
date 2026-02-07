import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Bed, Bath, Maximize, Building2 } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Investments({ properties, settings }) {
    console.log(properties);
    return (
        <PublicLayout>
            <Head title="Investments" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner */}
                <div className="mb-10 rounded-2xl overflow-hidden shadow-sm bg-emerald-50 border border-emerald-100 p-8 flex items-center justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Start Investing with {settings?.site_name || 'Goro'}</h2>
                        <p className="text-slate-600 mb-6">
                            Discover premium property investment opportunities with high returns. 
                            {settings?.description && <span className="block mt-2 text-sm">{settings.description}</span>}
                        </p>
                        <div className="flex gap-4">
                            <a href="#properties" className="bg-emerald-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 shadow-lg transition-colors shadow-emerald-200">
                                View Properties
                            </a>
                            <a href="#fitur" className="bg-white text-emerald-700 border border-emerald-200 px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-colors">
                                How it Works
                            </a>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-64 h-48 bg-emerald-100/50 rounded-xl flex items-center justify-center">
                            <Building2 className="w-24 h-24 text-emerald-300" />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {properties.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.data.map((prop, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                {/* Image */}
                                <div className="relative h-48 bg-slate-200 group">
                                    <img src={prop.image || `https://placehold.co/600x400?text=${encodeURIComponent(prop.name)}`} alt={prop.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-700 flex items-center gap-1">
                                        <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        {prop.loc}
                                    </div>

                                    {prop.sold && (
                                        <div className="absolute top-3 left-3 bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white">
                                            Sold Out
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-emerald-900 mb-2">{prop.name}</h3>
                                    
                                    {/* Specs */}
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Bed className="w-4 h-4 text-emerald-600" />
                                            <span>{prop.specs.bedroom}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Bath className="w-4 h-4 text-emerald-600" />
                                            <span>{prop.specs.bathroom}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Maximize className="w-4 h-4 text-emerald-600" />
                                            <span>{prop.specs.area}</span>
                                        </div>
                                    </div>

                                    {/* Returns */}
                                    <div className="flex items-center gap-8 mb-4 border-t border-slate-100 pt-3">
                                        <div>
                                            <div className="text-lg font-bold text-emerald-600">{prop.roi}</div>
                                            <div className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-wider">ROI</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-emerald-600">{prop.roi_period}</div>
                                            <div className="text-[0.65rem] text-slate-400 font-bold uppercase tracking-wider">ROI Period (Month)</div>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-5 mt-auto">
                                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                                            <span className={prop.progress > 0 ? 'text-emerald-700' : 'text-slate-400'}>{prop.progress}%</span>
                                            <span className="text-slate-400">{prop.tokens} tokens left</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.max(prop.progress, 5)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <Link 
                                        href={route('investments.show', prop.id)}
                                        className={`w-full block text-center ${prop.sold ? 'bg-slate-300 text-slate-500' : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/20 shadow-lg'} font-bold text-sm py-3 rounded-lg transition-all`}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4">
                        <div className="bg-slate-50 rounded-2xl p-8 max-w-lg mx-auto border border-slate-100">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Investment Properties Found</h3>
                            <p className="text-slate-600 mb-6">We currently don't have any investment properties available. Please check back later for new opportunities.</p>
                            <a href="/" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                                Return Home
                            </a>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-2">
                    {properties.links.map((link, index) => (
                         link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`min-w-[2.25rem] h-9 px-3 flex items-center justify-center rounded text-sm transition-colors ${
                                    link.active
                                        ? 'bg-emerald-800 text-white font-medium shadow-md shadow-emerald-900/20'
                                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                         ) : (
                            <span
                                key={index}
                                className="min-w-[2.25rem] h-9 px-3 flex items-center justify-center rounded border border-slate-200 text-slate-400 text-sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                         )
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
