'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { PlusCircle, Trash2, MapPin, Tag, Calendar, AlertCircle } from 'lucide-react';

type Job = {
    id: string;
    title: string;
    category: string;
    job_type: string;
    created_at: string;
};

export default function CompanyListingsPage() {
    const supabase = createClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setError('You must be logged in to view listings.');
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('company_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setJobs(data || []);
            } catch (err: any) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load listings.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [supabase]);

    const handleDelete = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await supabase.from('jobs').delete().eq('id', jobId);

            if (error) throw error;

            // Update state to remove deleted job
            setJobs((prev) => prev.filter((job) => job.id !== jobId));
        } catch (err: any) {
            console.error('Error deleting job:', err);
            alert('Failed to delete job.');
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1C38]">My Listings</h1>
                    <p className="text-slate-500 mt-1">Manage your active job postings and applications.</p>
                </div>
                <Link
                    href="/dashboard/company/post-job"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FBBF24] px-4 py-2 text-sm font-bold text-[#0B1C38] shadow-md hover:bg-[#FBBF24]/90 transition-all"
                >
                    <PlusCircle className="w-4 h-4" />
                    Post a Job
                </Link>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            ) : jobs.length === 0 ? (
                // Empty State
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B1C38]/5">
                        <PlusCircle className="h-8 w-8 text-[#0B1C38]" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">No active listings found</h3>
                    <p className="mt-1 text-slate-500 max-w-sm mx-auto">
                        Get started by creating a new job posting to find the perfect candidate.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard/company/post-job"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FBBF24] px-4 py-2 text-sm font-bold text-[#0B1C38] shadow-md hover:bg-[#FBBF24]/90 transition-all"
                        >
                            Post a Job
                        </Link>
                    </div>
                </div>
            ) : (
                // Data Table
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Posted Date
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">{job.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-slate-500">
                                                <Tag className="mr-1.5 h-4 w-4 text-slate-400" />
                                                {job.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.job_type === 'Remote' ? 'bg-green-100 text-green-800' :
                                                job.job_type === 'Hybrid' ? 'bg-primary/10 text-primary' :
                                                    'bg-slate-100 text-slate-800'
                                                }`}>
                                                {job.job_type === 'Remote' || job.job_type === 'Hybrid' ? null : <MapPin className="w-3 h-3 mr-1" />}
                                                {job.job_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div className="flex items-center">
                                                <Calendar className="mr-1.5 h-4 w-4 text-slate-400" />
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete listing"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
