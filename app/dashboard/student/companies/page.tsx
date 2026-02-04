'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Search, MapPin, Building2, ArrowRight, Loader2 } from 'lucide-react';

type Company = {
    id: string;
    company_name: string;
    photo_url: string | null;
    industry: string | null;
    headquarters: string | null;
    website: string | null;
};

export default function StudentCompaniesPage() {
    const supabase = createClient();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, company_name, photo_url, industry, headquarters, website')
                    .neq('company_name', null); // Filter out non-company profiles (or properly use role if possible, but name check works for now based on prompt)

                if (error) throw error;

                // Ensure we only get valid companies (double check active ones or just all)
                // Ideally we filter by role='company' but user said "where company_name is NOT null"
                const validCompanies = data?.filter(c => c.company_name) || [];

                setCompanies(validCompanies);
                setFilteredCompanies(validCompanies);
            } catch (err) {
                console.error('Error fetching companies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [supabase]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = companies.filter(company =>
            (company.company_name?.toLowerCase().includes(query)) ||
            (company.industry?.toLowerCase().includes(query))
        );
        setFilteredCompanies(filtered);
    }, [searchQuery, companies]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Discover Companies</h1>
                <p className="text-slate-500 mt-2 text-lg">Find top employers and explore their culture.</p>
            </div>

            {/* Search */}
            <div className="relative mb-10 max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or industry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base outline-none transition-all hover:border-blue-300"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                </div>
            ) : filteredCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                        <div key={company.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-6 flex flex-col h-full group">

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {company.photo_url ? (
                                        <img src={company.photo_url} alt={company.company_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-slate-300" />
                                    )}
                                </div>
                            </div>

                            <div className="mb-6 flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {company.company_name}
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {company.industry ? (
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                                            {company.industry}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold text-slate-300 bg-slate-50 px-2.5 py-1 rounded-md w-fit">
                                            No Industry
                                        </span>
                                    )}
                                    {company.headquarters && (
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            {company.headquarters}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 mt-auto">
                                <Link
                                    href={`/dashboard/student/companies/${company.id}`}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm"
                                >
                                    Visit Profile
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No companies found</h3>
                    <p className="text-slate-500">Try adjusting your search criteria.</p>
                </div>
            )}
        </div>
    );
}
