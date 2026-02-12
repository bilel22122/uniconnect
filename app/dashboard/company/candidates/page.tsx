'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    AlertCircle, CheckCircle, XCircle, User, Briefcase,
    School, ExternalLink, ThumbsUp, ThumbsDown, Loader2, Eye, MessageSquare
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

type Application = {
    id: string;
    status: string;
    created_at: string;
    job: {
        title: string;
    };
    student: {
        id: string;
        full_name: string;
        email: string;
        photo_url: string | null;
        university: string | null;
        major: string | null;
        skills: string | null;
        portfolio_url: string | null;
        is_verified?: boolean;
    };
};

export default function CompanyCandidatesPage() {
    const supabase = createClient();
    const router = useRouter();
    const [candidates, setCandidates] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Get all jobs for this company first
                const { data: jobs } = await supabase
                    .from('jobs')
                    .select('id')
                    .eq('company_id', user.id);

                if (jobs && jobs.length > 0) {
                    const jobIds = jobs.map(j => j.id);

                    const { data, error } = await supabase
                        .from('applications')
                        .select(`
              id,
              status,
              created_at,
              job:jobs!job_id(title),
              student:profiles!student_id(
                id,
                full_name, 
                email, 
                photo_url, 
                university, 
                major,
                skills,
                portfolio_url,
                is_verified
              )
            `)
                        .in('job_id', jobIds)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    // Cast the complex join result to our type safely
                    setCandidates(data as any[] || []);
                }
            } catch (err) {
                console.error('Error fetching candidates:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [supabase]);

    const updateStatus = async (applicationId: string, studentId: string, jobTitle: string, newStatus: 'Accepted' | 'Rejected') => {
        setUpdatingId(applicationId);

        // 1. Optimistic Update
        const previousCandidates = [...candidates];
        setCandidates(prev => prev.map(c =>
            c.id === applicationId ? { ...c, status: newStatus } : c
        ));

        try {
            // Update Application Status
            const { error: updateError } = await supabase
                .from('applications')
                .update({ status: newStatus })
                .eq('id', applicationId);

            if (updateError) throw updateError;

            // 2. Send Notification
            const notification = newStatus === 'Accepted'
                ? {
                    title: 'Application Accepted! 🎉',
                    message: `Congratulations! You have been accepted for the ${jobTitle} position.`,
                    link: '/dashboard/student/applications'
                }
                : {
                    title: 'Application Update',
                    message: `Your application for ${jobTitle} was not selected.`,
                    link: '/dashboard/student/applications'
                };

            const { error: notifyError } = await supabase
                .from('notifications')
                .insert({
                    user_id: studentId,
                    title: notification.title,
                    message: notification.message,
                    link: notification.link
                });

            if (notifyError) console.error("Error sending notification:", notifyError);

        } catch (err) {
            console.error('Error updating status:', err);
            // Revert on error
            setCandidates(previousCandidates);
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleMessage = async (studentId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if conversation exists
            const { data: existingConvo, error: fetchError } = await supabase
                .from('conversations')
                .select('id')
                .eq('company_id', user.id)
                .eq('student_id', studentId)
                .maybeSingle();

            if (fetchError) {
                console.error("Error checking conversation:", fetchError);
                return;
            }

            let conversationId = existingConvo?.id;

            if (!conversationId) {
                // Create new conversation
                const { data: newConvo, error: createError } = await supabase
                    .from('conversations')
                    .insert({
                        company_id: user.id,
                        student_id: studentId
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error("Error creating conversation:", createError);
                    alert("Failed to start conversation.");
                    return;
                }
                conversationId = newConvo.id;
            }

            router.push(`/dashboard/company/messages/${conversationId}`);

        } catch (err) {
            console.error("Error in handleMessage:", err);
        }
    };


    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
                <p className="text-slate-500 mt-1">Manage applications for your posted jobs.</p>
            </div>

            {candidates.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No candidates yet</h3>
                    <p className="text-slate-500">Wait for students to apply to your jobs.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {candidates.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">

                            {/* Left: Avatar & Info */}
                            <div className="flex-1 flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden">
                                    {app.student.photo_url ? (
                                        <img src={app.student.photo_url} alt={app.student.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-slate-400 m-auto mt-4" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                        {app.student.full_name}
                                        {app.student.is_verified && <VerifiedBadge size={20} className="ml-1.5" />}
                                    </h3>
                                    <div className="text-slate-600 font-medium mb-1">
                                        Applied for <span className="text-blue-600">{app.job?.title}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                                        {app.student.university && (
                                            <div className="flex items-center gap-1.5">
                                                <School className="w-4 h-4 text-slate-400" />
                                                {app.student.university} • {app.student.major}
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills Badges */}
                                    {app.student.skills && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {app.student.skills.split(',').slice(0, 4).map((skill: string, i: number) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Portfolio Link */}
                                    {app.student.portfolio_url && (
                                        <div className="mt-3">
                                            <a href={app.student.portfolio_url} target="_blank" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                View Portfolio / Profile
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Status & Actions */}
                            <div className="flex flex-col items-end justify-between min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                <div className="text-xs text-slate-400 mb-4">
                                    Applied {new Date(app.created_at).toLocaleDateString()}
                                </div>

                                <div className="w-full flex flex-col gap-2 md:items-end">

                                    {/* Action Row */}
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Link
                                            href={`/dashboard/company/candidates/${app.student.id}`}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </Link>

                                        {app.status === 'Accepted' ? (
                                            <>
                                                <div className="flex-1 md:flex-none flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-bold justify-center border border-emerald-100">
                                                    <CheckCircle className="w-5 h-5" />
                                                    Accepted
                                                </div>
                                                <button
                                                    onClick={() => handleMessage(app.student.id)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                                                >
                                                    <MessageSquare className="w-5 h-5" />
                                                    Message
                                                </button>
                                            </>
                                        ) : app.status === 'Rejected' ? (
                                            <div className="flex-1 md:flex-none flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg font-bold justify-center border border-red-100">
                                                <XCircle className="w-5 h-5" />
                                                Rejected
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(app.id, app.student.id, app.job?.title || 'Job', 'Rejected')}
                                                    disabled={updatingId === app.id}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-slate-200 text-slate-600 font-bold hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-all disabled:opacity-50"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(app.id, app.student.id, app.job?.title || 'Job', 'Accepted')}
                                                    disabled={updatingId === app.id}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                                >
                                                    {updatingId === app.id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-5 h-5" />
                                                            Accept
                                                        </>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
