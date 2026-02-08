import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bed, Bath, Maximize, Home, MapPin, ChevronRight, ExternalLink, Phone, Mail, FileText, Download } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Show({ property }) {
    const { settings } = usePage().props;
    const [activeTab, setActiveTab] = useState('details');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === (property.images?.length || 0) - 1 ? 0 : prev + 1
        );
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => 
            prev === 0 ? (property.images?.length || 0) - 1 : prev - 1
        );
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage(e);
            if (e.key === 'ArrowLeft') prevImage(e);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <PublicLayout>
            <Head title={property.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <Link href="/property-for-sale" className="hover:text-indigo-600">Property for Sale</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-slate-900 font-medium">{property.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery Section */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                            <div className="grid grid-cols-4 gap-4">
                                <div 
                                    className="col-span-3 h-[400px] relative group cursor-pointer"
                                    onClick={() => openLightbox(0)}
                                >
                                    <img
                                        src={property.main_image || `https://placehold.co/800x600?text=${encodeURIComponent(property.name)}`}
                                        alt={property.name}
                                        className="w-full h-full object-cover rounded-xl transition-opacity hover:opacity-95"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-bold shadow-sm ${property.sold ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white'}`}>
                                            {property.sold ? 'Sold Out' : 'For Sale'}
                                        </span>
                                    </div>
                                    {property.listing_url && (
                                        <a href={property.listing_url} target="_blank" onClick={(e) => e.stopPropagation()} className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                            Listing URL
                                        </a>
                                    )}
                                </div>
                                <div className="col-span-1 flex flex-col gap-4 h-[400px]">
                                    {property.images && property.images.slice(1, 3).map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            className="h-1/2 relative cursor-pointer"
                                            onClick={() => openLightbox(idx + 1)}
                                        >
                                            <img src={img} className="w-full h-full object-cover rounded-xl transition-opacity hover:opacity-95" alt="" />
                                        </div>
                                    ))}
                                    {(!property.images || property.images.length < 2) && (
                                        <>
                                            <div className="h-1/2 bg-slate-100 rounded-xl"></div>
                                            <div className="h-1/2 bg-slate-100 rounded-xl relative flex items-center justify-center text-slate-400 font-bold">
                                                More
                                            </div>
                                        </>
                                    )}
                                    {property.images && property.images.length > 3 && (
                                        <div 
                                            className="h-1/2 bg-slate-100 rounded-xl relative overflow-hidden cursor-pointer group"
                                            onClick={() => openLightbox(3)}
                                        >
                                            <img src={property.images[3]} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-40" alt="" />
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700 text-xl">
                                                +{property.images.length - 3}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.name}</h1>
                                <div className="flex items-center text-slate-500 font-medium">
                                    <MapPin className="w-5 h-5 mr-1 text-indigo-600" />
                                    {property.loc}
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 grid grid-cols-4 divide-x divide-slate-100">
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Bed className="w-8 h-8 text-indigo-600 mb-2" />
                                <div className="font-bold text-slate-900">{property.specs.bedroom} Bedrooms</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Bath className="w-8 h-8 text-indigo-600 mb-2" />
                                <div className="font-bold text-slate-900">{property.specs.bathroom} Bathrooms</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Maximize className="w-8 h-8 text-indigo-600 mb-2" />
                                <div className="font-bold text-slate-900">{property.specs.area}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Home className="w-8 h-8 text-indigo-600 mb-2" />
                                <div className="font-bold text-slate-900">{property.specs.type || 'Villa'}</div>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="border-b border-slate-200">
                                <nav className="flex overflow-x-auto">
                                    {['Details', 'Documents'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab.toLowerCase())}
                                            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-6">
                                {activeTab === 'details' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-indigo-800 mb-3">About the Property</h3>
                                            <div className="prose prose-slate max-w-none text-slate-600">
                                                <p className="whitespace-pre-line">{property.detail}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                             <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-2">Ownership</h3>
                                                <p className="text-slate-600">{property.financials.ownership}</p>
                                            </div>
                                             {property.financials.lease_term && (
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900 mb-2">Lease Term</h3>
                                                    <p className="text-slate-600">{property.financials.lease_term} years</p>
                                                </div>
                                             )}
                                             <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-2">Land Area</h3>
                                                <p className="text-slate-600">{property.specs.land_area}</p>
                                            </div>
                                             <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-2">Building Area</h3>
                                                <p className="text-slate-600">{property.specs.area}</p>
                                            </div>
                                        </div>

                                        {property.map_url && (
                                            <div>
                                                <h3 className="text-lg font-bold text-indigo-800 mb-3">Location</h3>
                                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                                                    <iframe
                                                        src={property.map_url}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    ></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {activeTab === 'documents' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-indigo-800 mb-3">Documents</h3>
                                            {property.documents && property.documents.length > 0 ? (
                                                <div className="space-y-3">
                                                    {property.documents.map((doc, idx) => (
                                                        <a 
                                                            key={idx}
                                                            href={doc.url}
                                                            target="_blank"
                                                            className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="w-5 h-5 text-indigo-500" />
                                                                <span className="font-medium text-slate-700 group-hover:text-indigo-700">{doc.name}</span>
                                                            </div>
                                                            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-slate-400 italic">No documents available.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Price Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 sticky top-24">
                            <div className="mb-6">
                                <div className="text-sm text-slate-500 font-medium mb-1">Price</div>
                                <div className="text-3xl font-bold text-indigo-600">{formatCurrency(property.financials.price)}</div>
                                <div className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{property.financials.ownership}</span>
                                    {property.financials.lease_term && (
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{property.financials.lease_term} Years</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <a href={`https://wa.me/${settings?.whatsapp || '62818580891'}`} target="_blank" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                                    <Phone className="w-5 h-5" />
                                    Contact Agent
                                </a>
                                <button className="w-full bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    Request More Info
                                </button>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="text-sm font-medium text-slate-900 mb-3">Property Highlights</div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                                        Prime location in {property.loc}
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                                        {property.specs.bedroom} Bedrooms, {property.specs.bathroom} Bathrooms
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                                        {property.specs.area} Building Area
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    <button 
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                        <img 
                            src={property.images[currentImageIndex]} 
                            alt={property.name}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        
                        <button 
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        
                        <button 
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                            {currentImageIndex + 1} / {property.images.length}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
