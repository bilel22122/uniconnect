'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { FileText, Building2, Calendar, Search, ArrowRight } from 'lucide-react';

type Application = {
    id: string;
    status: string;
    created_at: string;
    job: {
        title: string;
        category: string;
        company: {
            company_name: string;
        } | null;
    } | null;
};

export default function StudentApplicationsPage() {
    const supabase = createClient();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // Nested join: Get application -> job -> company (profile)
                    const { data, error } = await supabase
                        .from('applications')
                        .select('*, job:jobs!job_id(title, category, company:profiles!company_id(company_name))')
                        .eq('student_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    setApplications(data as unknown as Application[]);
                }
            } catch (err: any) {
                console.error('Error fetching applications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
                <p className="text-slate-500 mt-1">Track the status of your job applications.</p>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">No applications yet</h3>
                    <p className="mt-1 text-slate-500 max-w-sm mx-auto">
                        You haven't applied to any jobs yet. Start exploring opportunities!
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard/student/jobs"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
                        >
                            <Search className="w-4 h-4" />
                            Find Work
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Job Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Applied Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900">{app.job?.title}</div>
                                            <div className="text-sm text-slate-500">{app.job?.category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                {app.job?.company?.company_name || 'Unknown Company'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {app.status}
                                            </span>
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
