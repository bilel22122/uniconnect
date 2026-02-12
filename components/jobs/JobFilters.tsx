'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Banknote } from 'lucide-react';

import LocationSelector from '@/components/ui/LocationSelector';

interface FilterState {
    query: string;
    location: string;
    jobType: string;
    salaryMin: string;
    salaryMax: string;
}

interface JobFiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

const ALGERIAN_CITIES = [
    "Algiers",
    "Oran",
    "Constantine",
    "Setif",
    "Annaba",
    "Ouargla",
    "Tlemcen"
];

const JOB_TYPES = [
    "Remote",
    "On-site",
    "Hybrid"
];

export default function JobFilters({ onFilterChange }: JobFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        query: '',
        location: '',
        jobType: '',
        salaryMin: '',
        salaryMax: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="tex-lg font-bold text-slate-900 mb-6">Filter Jobs</h3>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Search Keywords
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            name="query"
                            value={filters.query}
                            onChange={handleChange}
                            placeholder="e.g. Developer, Designer"
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <LocationSelector
                        label="Filter by Wilaya"
                        value={filters.location}
                        onChange={(val) => {
                            const newFilters = { ...filters, location: val };
                            setFilters(newFilters);
                            onFilterChange(newFilters);
                        }}
                        placeholder="All Algeria"
                        enableDefaultOption={true}
                    />
                </div>

                {/* Job Type */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Job Type
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            name="jobType"
                            value={filters.jobType}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                            <option value="">All Types</option>
                            {JOB_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Salary Range */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Salary Range (Counts)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                name="salaryMin"
                                value={filters.salaryMin}
                                onChange={handleChange}
                                placeholder="Min"
                                className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                name="salaryMax"
                                value={filters.salaryMax}
                                onChange={handleChange}
                                placeholder="Max"
                                className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Clear Filters (Optional but nice UX) */}
                {(filters.query || filters.location || filters.jobType || filters.salaryMin || filters.salaryMax) && (
                    <button
                        onClick={() => {
                            const cleared = { query: '', location: '', jobType: '', salaryMin: '', salaryMax: '' };
                            setFilters(cleared);
                            onFilterChange(cleared);
                        }}
                        className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors border border-dashed border-slate-300 rounded-lg hover:border-slate-400"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}
