'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';
import CompanyCard from '@/components/CompanyCard';
import { Search, Building2, Loader2 } from 'lucide-react';

type Company = {
    id: string;
    company_name: string;
    photo_url: string | null;
    industry: string | null;
    headquarters: string | null;
    website: string | null;
    is_verified?: boolean;
};

export default function PublicCompaniesPage() {
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
                    .select('id, company_name, photo_url, industry, headquarters, website, is_verified')
                    .neq('company_name', null);

                if (error) throw error;

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
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Discover Top Companies</h1>
                    <p className="text-xl text-slate-600">Explore employers who are hiring on UniConnect.</p>
                </div>

                {/* Search */}
                <div className="relative mb-12 max-w-2xl mx-auto">
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
                            <CompanyCard key={company.id} company={company} hrefPrefix="/dashboard/student/companies" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No companies found</h3>
                        <p className="text-slate-500">Try adjusting your search criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
