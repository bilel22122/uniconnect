'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/client';
import JobCard from '@/components/jobs/JobCard';
import { Briefcase, Loader2 } from 'lucide-react';

type Job = {
    id: string;
    title: string;
    company_id: string;
    category: string;
    job_location_type: string;
    employment_type: string;
    salary_range: string;
    location?: string;
    location_address?: string;
    salary_min?: number;
    salary_max?: number;
    created_at: string;
    company: {
        company_name: string;
        photo_url: string;
        is_verified?: boolean;
    }
};

export default function PublicJobsPage() {
    const supabase = createClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*, company:profiles!company_id(company_name, photo_url, is_verified)')
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

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Explore Opportunities</h1>
                    <p className="text-xl text-slate-600">Find the perfect job or internship to kickstart your career.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
                        <p className="text-slate-500">Check back later for new opportunities.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} hrefPrefix="/dashboard/student/jobs" />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
