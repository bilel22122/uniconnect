'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Search, MapPin, Briefcase, DollarSign, Building2, ArrowRight } from 'lucide-react';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';

type Job = {
    id: string;
    title: string;
    company_id: string;
    category: string;
    job_location_type: string; // Remote, On-site, etc.
    employment_type: string;
    salary_range: string;
    // New fields
    location?: string;
    location_address?: string; // New field from Post Job
    salary_min?: number;
    salary_max?: number;
    created_at: string;
    company: {
        company_name: string;
        photo_url: string; // Logo
        is_verified?: boolean;
    }
};

export default function StudentJobsPage() {
    const supabase = createClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [filters, setFilters] = useState({
        query: '',
        location: '',
        jobType: '',
        salaryMin: '',
        salaryMax: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            console.log('Active Filters:', filters);

            try {
                let query = supabase
                    .from('jobs')
                    .select('*, company:profiles!company_id(company_name, photo_url, is_verified)')
                    .order('created_at', { ascending: false });

                // Apply Search Filter (Title)
                if (filters.query) {
                    query = query.ilike('title', `%${filters.query}%`);
                }

                // Apply Location Filter (location_address)
                if (filters.location) {
                    // Use ilike for case-insensitivity and partial matches if needed, 
                    // though LocationSelector usually provides exact strings.
                    query = query.ilike('location_address', `%${filters.location}%`);
                }

                // Apply Job Type Filter (job_location_type)
                if (filters.jobType && filters.jobType !== 'All') {
                    // Mapped to 'job_location_type' in DB (Remote, On-site, Hybrid)
                    query = query.eq('job_location_type', filters.jobType);
                }

                // Apply Salary Min Filter
                if (filters.salaryMin) {
                    query = query.gte('salary_max', parseInt(filters.salaryMin));
                }

                // Apply Salary Max Filter
                if (filters.salaryMax) {
                    query = query.lte('salary_min', parseInt(filters.salaryMax));
                }

                const { data, error } = await query;

                if (error) throw error;
                setJobs(data || []);
            } catch (err) {
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [supabase, filters]);

    return (
        <div className="p-4 md:p-8 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Find Your Next Role</h1>
                <p className="text-slate-500 mt-1">Discover opportunities tailored for students.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar: Filters */}
                <div className="lg:col-span-1">
                    <JobFilters onFilterChange={setFilters} />
                </div>

                {/* Right Content: Job Grid */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {jobs.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
                                    <p className="text-slate-500">Try adjusting your filters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {jobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
