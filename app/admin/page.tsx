'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Users, Briefcase, FileText, Trash2, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import GrowthChart from '@/components/admin/GrowthChart';

type Job = {
    id: string;
    title: string;
    company_display_name: string; // Or specific column
    created_at: string;
    company: {
        company_name: string;
    }
};

type Profile = {
    id: string;
    email: string; // Usually not in profiles directly unless added, but let's check auth or assume 'email' column exists if we added it? 
    // Wait, profiles table usually has id, role, full_name, avatar_url, etc. 
    // Does it have email? In some starters yes. If not, we might need to rely on full_name or fetch from auth (which is hard client side for list).
    // Let's assume 'full_name' and 'role'.
    full_name: string;
    role: string;
    is_verified: boolean;
    created_at: string;
    // If email is not in profiles, we can't easily show it without an edge function. 
    // But for now let's show what we have.
};

export default function AdminDashboard() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        users: 0,
        jobs: 0,
        applications: 0
    });

    // Data
    const [jobs, setJobs] = useState<Job[]>([]);
    const [users, setUsers] = useState<Profile[]>([]);

    // Action Loading States
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [verificationLoading, setVerificationLoading] = useState<string | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();

            if (!profile?.is_admin) {
                router.push('/');
                return;
            }

            setIsAdmin(true);
            fetchDashboardData();
        };

        checkAdmin();
    }, [supabase, router]);

    const fetchDashboardData = async () => {
        try {
            // Fetch stats
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
            const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true });

            setStats({
                users: userCount || 0,
                jobs: jobCount || 0,
                applications: appCount || 0
            });

            // Fetch recent jobs
            const { data: recentJobs } = await supabase
                .from('jobs')
                .select('*, company:profiles!company_id(company_name)')
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentJobs) setJobs(recentJobs);

            // Fetch recent users
            const { data: recentUsers } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentUsers) setUsers(recentUsers);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        if (!confirm('Are you sure you want to delete this job? This cannot be undone.')) return;

        setDeleteLoading(jobId);
        try {
            const { error } = await supabase.from('jobs').delete().eq('id', jobId);
            if (error) throw error;

            setJobs(jobs.filter(job => job.id !== jobId));
            setStats(prev => ({ ...prev, jobs: prev.jobs - 1 }));
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job.');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
        setVerificationLoading(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_verified: !currentStatus })
                .eq('id', userId);

            if (error) throw error;

            // Optimistic update
            setUsers(users.map(user =>
                user.id === userId ? { ...user, is_verified: !currentStatus } : user
            ));

            router.refresh();
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Failed to update verification status.');
        } finally {
            setVerificationLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Overview and management.</p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stats.users}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Jobs</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stats.jobs}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Applications</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stats.applications}</h3>
                        </div>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="my-8">
                    <GrowthChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Recent Users</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-900 font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{user.full_name || 'No Name'}</div>
                                                <div className="text-xs text-slate-400">{new Date(user.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'student' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_verified ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                        <CheckCircle className="w-3 h-3" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                        <XCircle className="w-3 h-3" /> Unverified
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleToggleVerification(user.id, user.is_verified || false)}
                                                    disabled={verificationLoading === user.id}
                                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${user.is_verified
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        }`}
                                                >
                                                    {verificationLoading === user.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        user.is_verified ? 'Revoke' : 'Verify'
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Job Management */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Recent Jobs</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-900 font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Job Title</th>
                                        <th className="px-6 py-3">Company</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {jobs.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                                No jobs found.
                                            </td>
                                        </tr>
                                    ) : (
                                        jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {job.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {job.company?.company_name || job.company_display_name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteJob(job.id)}
                                                        disabled={deleteLoading === job.id}
                                                        className="inline-flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Delete Job"
                                                    >
                                                        {deleteLoading === job.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
