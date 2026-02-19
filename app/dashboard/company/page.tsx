'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
    Building2, Users, Briefcase, TrendingUp,
    ArrowRight, Loader2, Calendar, Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type DashboardStats = {
    activeJobs: number;
    totalCandidates: number;
    newCandidates: number; // Placeholder for now or calculated if possible
};

type RecentApplication = {
    id: string;
    created_at: string;
    status: string;
    job: {
        title: string;
    };
    student: {
        full_name: string;
        photo_url: string | null;
    };
};

export default function CompanyDashboardPage() {
    const supabase = createClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState('Company');
    const [stats, setStats] = useState<DashboardStats>({ activeJobs: 0, totalCandidates: 0, newCandidates: 0 });
    const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                // 1. Fetch Company Profile (Name)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('company_name')
                    .eq('id', user.id)
                    .single();

                if (profile?.company_name) setCompanyName(profile.company_name);


                // 2. Fetch Active Jobs
                const { data: jobs, error: jobsError } = await supabase
                    .from('jobs')
                    .select('id')
                    .eq('company_id', user.id);

                if (jobsError) throw jobsError;

                const jobIds = jobs?.map(j => j.id) || [];
                const activeJobCount = jobIds.length;


                // 3. Fetch Applications Stats & Recent Activity
                let totalCandidatesCount = 0;
                let recentAppsData: RecentApplication[] = [];

                if (jobIds.length > 0) {
                    // A. Total Count
                    const { count, error: countError } = await supabase
                        .from('applications')
                        .select('id', { count: 'exact', head: true })
                        .in('job_id', jobIds);

                    if (!countError) totalCandidatesCount = count || 0;

                    // B. Recent Activity (Limit 5)
                    // Note: We need to join with profiles (student) and jobs
                    const { data: apps, error: appsError } = await supabase
                        .from('applications')
                        .select(`
                    id, created_at, status,
                    job:jobs(title),
                    student:profiles!student_id(full_name, photo_url)
                `)
                        .in('job_id', jobIds)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    if (!appsError && apps) {
                        // Cast the data to match our type (Supabase types can be tricky with joins)
                        recentAppsData = apps as unknown as RecentApplication[];
                    }
                }

                setStats({
                    activeJobs: activeJobCount,
                    totalCandidates: totalCandidatesCount,
                    newCandidates: 0 // Logic for "new this week" requires more complex date filtering, leaving as 0 or static for MVP
                });
                setRecentApplications(recentAppsData);

            } catch (err) {
                console.error('Error loading dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [supabase, router]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, {companyName} 👋</h1>
                <p className="text-slate-500 mt-1">Here's what's happening with your job postings today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* Active Jobs Card */}
                <Link href="/dashboard/company/listings" className="group">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-secondary hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <span className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-1">{stats.activeJobs}</h3>
                            <p className="text-slate-500 font-medium">Active Job Listings</p>
                        </div>
                    </div>
                </Link>

                {/* Total Candidates Card */}
                <Link href="/dashboard/company/candidates" className="group">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="flex items-center text-sm font-semibold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold text-slate-900 mb-1">{stats.totalCandidates}</h3>
                            <p className="text-slate-500 font-medium">Total Applications</p>
                        </div>
                    </div>
                </Link>

                {/* Action Items / Static Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="font-semibold text-emerald-400">Pro Tip</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Boost your reach</h3>
                        <p className="text-slate-300 text-sm mb-4">Complete your Company Brand Profile to attract 2x more active candidates.</p>
                        <Link
                            href="/dashboard/company/profile/edit"
                            className="inline-flex items-center text-sm font-bold text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                        >
                            Update Profile
                        </Link>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                </div>

            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Latest Applications</h2>
                    <Link href="/dashboard/company/candidates" className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline">
                        View All Candidates
                    </Link>
                </div>

                <div>
                    {recentApplications.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {recentApplications.map((app) => (
                                <div key={app.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">

                                    {/* Student Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                            {app.student?.photo_url ? (
                                                <img src={app.student.photo_url} alt={app.student.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{app.student?.full_name || 'Unknown Student'}</div>
                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                Applied for <span className="font-medium text-secondary">{app.job?.title}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date & Action */}
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </div>

                                        <Link
                                            href="/dashboard/company/candidates"
                                            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white hover:border-secondary hover:text-primary hover:shadow-sm transition-all bg-slate-50"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500 bg-slate-50/50">
                            <div className="w-16 h-16 bg-[#0B1C38]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-[#0B1C38]" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
                            <p className="mt-1 mb-6">Once students apply to your jobs, they'll appear here.</p>
                            <Link
                                href="/dashboard/company/post-job"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FBBF24] text-[#0B1C38] rounded-xl font-bold hover:bg-[#FBBF24]/90 transition-colors shadow-md"
                            >
                                Post a Job
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
