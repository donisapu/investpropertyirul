import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Bed, Bath, Maximize, Building2, Search, Filter, X } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function PropertyForSale({ properties, settings }) {
    const queryParams = new URLSearchParams(window.location.search);
    const [filters, setFilters] = useState({
        search: queryParams.get('search') || '',
        location: queryParams.get('location') || '',
        type: queryParams.get('type') || '',
        bedroom: queryParams.get('bedroom') || '',
        min_price: queryParams.get('min_price') || '',
        max_price: queryParams.get('max_price') || '',
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        router.get(route('property-for-sale.index'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            location: '',
            type: '',
            bedroom: '',
            min_price: '',
            max_price: '',
        });
        router.get(route('property-for-sale.index'));
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.search !== (queryParams.get('search') || '')) {
                applyFilters();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

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
            <Head title="Property for Sale" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner */}
                <div className="mb-8 rounded-2xl overflow-hidden shadow-sm bg-indigo-50 border border-indigo-100 p-8 flex items-center justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Find Your Dream Property</h2>
                        <p className="text-slate-600 mb-6">
                            Browse our exclusive selection of properties for sale. 
                            {settings?.description && <span className="block mt-2 text-sm">{settings.description}</span>}
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-64 h-48 bg-indigo-100/50 rounded-xl flex items-center justify-center">
                            <Building2 className="w-24 h-24 text-indigo-300" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-indigo-600" />
                            Filter Properties
                        </h3>
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)} 
                            className="md:hidden text-indigo-600 font-medium"
                        >
                            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>
                        <button 
                            onClick={clearFilters}
                            className="hidden md:flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" /> Clear All
                        </button>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 ${isFilterOpen ? 'block' : 'hidden md:grid'}`}>
                        {/* Search */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Property name, location..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                placeholder="Any location"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Any Type</option>
                                <option value="Villa">Villa</option>
                                <option value="Land">Land</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>

                        {/* Bedroom */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Min. Bedrooms</label>
                            <select
                                name="bedroom"
                                value={filters.bedroom}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        {/* <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Min Price</label>
                            <input
                                type="number"
                                name="min_price"
                                value={filters.min_price}
                                onChange={handleFilterChange}
                                placeholder="Min"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div> */}
                        
                        <div className="flex items-end">
                             <button 
                                onClick={applyFilters}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                    
                    {/* Price Range - Secondary Row */}
                    <div className={`grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 ${isFilterOpen ? 'block' : 'hidden md:grid'}`}>
                         <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Min Price</label>
                            <input
                                type="number"
                                name="min_price"
                                value={filters.min_price}
                                onChange={handleFilterChange}
                                placeholder="Any"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Max Price</label>
                            <input
                                type="number"
                                name="max_price"
                                value={filters.max_price}
                                onChange={handleFilterChange}
                                placeholder="Any"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-4 md:hidden">
                        <button 
                            onClick={clearFilters}
                            className="w-full flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors py-2 border border-slate-200 rounded-lg"
                        >
                            <X className="w-4 h-4" /> Clear All Filters
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {properties.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.data.map((prop, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                                {/* Image */}
                                <div className="relative h-64 bg-slate-200 overflow-hidden">
                                    <img 
                                        src={prop.image || `https://placehold.co/600x400?text=${encodeURIComponent(prop.name)}`} 
                                        alt={prop.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${prop.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                        {prop.status}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <div className="text-white font-bold text-lg">{formatCurrency(prop.price)}</div>
                                        <div className="text-slate-200 text-xs font-medium flex items-center gap-1">
                                            <span>{prop.ownership}</span>
                                            {prop.ownership === 'Leasehold' && <span>• {prop.lease_term} years</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{prop.type}</div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors">{prop.name}</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        {prop.loc}
                                    </div>

                                    {/* Specs */}
                                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100 mb-4">
                                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg">
                                            <Bed className="w-5 h-5 text-slate-400 mb-1" />
                                            <span className="text-xs font-semibold text-slate-700">{prop.specs.bedroom} Beds</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg">
                                            <Bath className="w-5 h-5 text-slate-400 mb-1" />
                                            <span className="text-xs font-semibold text-slate-700">{prop.specs.bathroom} Baths</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg">
                                            <Maximize className="w-5 h-5 text-slate-400 mb-1" />
                                            <span className="text-xs font-semibold text-slate-700">{prop.specs.area}</span>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <Link 
                                        href={route('property-for-sale.show', prop.consignment_id)}
                                        className="mt-auto w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
                                    >
                                        View Details
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4">
                        <div className="bg-slate-50 rounded-2xl p-8 max-w-lg mx-auto border border-slate-100">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No Properties Found</h3>
                            <p className="text-slate-600 mb-6">We couldn't find any properties matching your search criteria. Try adjusting your filters.</p>
                            <button 
                                onClick={clearFilters}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                            >
                                Clear All Filters
                            </button>
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
                                className={`min-w-[2.25rem] h-9 px-3 flex items-center justify-center rounded-lg text-sm transition-all ${
                                    link.active
                                        ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/30'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-300 font-medium'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                         ) : (
                            <span
                                key={index}
                                className="min-w-[2.25rem] h-9 px-3 flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 text-sm"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                         )
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
