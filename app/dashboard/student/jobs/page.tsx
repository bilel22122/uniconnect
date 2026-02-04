'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Search, MapPin, Briefcase, DollarSign, Building2, ArrowRight } from 'lucide-react';

type Job = {
    id: string;
    title: string;
    company_id: string;
    category: string;
    job_location_type: string; // Remote, On-site, etc.
    employment_type: string;
    salary_range: string;
    created_at: string;
    company: {
        company_name: string;
        photo_url: string; // Logo
    }
};

export default function StudentJobsPage() {
    const supabase = createClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*, company:profiles!company_id(company_name, photo_url)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setJobs(data || []);
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [supabase]);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 pb-20">

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Find Your Next Role</h1>
                    <p className="text-slate-500 mt-1">Discover opportunities tailored for students.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search jobs or companies..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
                            <p className="text-slate-500">Try adjusting your search terms.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredJobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full">

                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                                                {job.company?.photo_url ? (
                                                    <img src={job.company.photo_url} alt={job.company.company_name} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <Building2 className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    <Link href={`/dashboard/student/jobs/${job.id}`}>
                                                        {job.title}
                                                    </Link>
                                                </h3>
                                                <div className="text-sm text-slate-500">{job.company?.company_name || 'Confidential'}</div>
                                            </div>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                                            {job.employment_type || 'Full-time'}
                                        </span>
                                    </div>

                                    {/* Tags/Info */}
                                    <div className="space-y-2 mb-6 flex-grow">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            {job.job_location_type || 'On-site'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <DollarSign className="w-4 h-4 text-slate-400" />
                                            {job.salary_range || 'Competitive'}
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                                        <span className="text-xs text-slate-400">
                                            Posted {new Date(job.created_at).toLocaleDateString()}
                                        </span>

                                        <Link
                                            href={`/dashboard/student/jobs/${job.id}`}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
