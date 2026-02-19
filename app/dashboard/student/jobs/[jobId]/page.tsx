'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
    Building2, MapPin, Briefcase, DollarSign, Calendar,
    CheckCircle, Globe, Mail, ArrowLeft, Send, Loader2, Share2
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

type JobDetails = {
    id: string;
    title: string;
    description: string; // Legacy fallback
    department?: string;
    employment_type?: string;
    job_location_type?: string;
    location_address?: string;
    application_deadline?: string;
    salary_range?: string;
    created_at: string;

    role_overview?: string;
    responsibilities?: string;
    skills_required?: string;
    skills_preferred?: string;
    education_requirements?: string;

    company_display_name?: string;
    company_overview?: string;
    company_website?: string;

    company: {
        id: string;
        name: string;
        logo_url: string;
        email: string;
        is_verified?: boolean;
    } | null;
};

export default function StudentJobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const jobId = params.jobId as string;

    const [job, setJob] = useState<JobDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJobAndStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; // Should be handled by middleware essentially

                // 1. Fetch Job + Company
                const { data: jobData, error: jobError } = await supabase
                    .from('jobs')
                    .select('*, company:profiles!company_id(id, name:company_name, logo_url:photo_url, email, is_verified)')
                    .eq('id', jobId)
                    .single();

                if (jobError) throw jobError;
                setJob(jobData);

                // 2. Check Application Status
                const { data: appData, error: appError } = await supabase
                    .from('applications')
                    .select('id')
                    .eq('job_id', jobId)
                    .eq('student_id', user.id)
                    .single();

                if (!appError && appData) {
                    setHasApplied(true);
                }

            } catch (err) {
                console.error('Error fetching details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchJobAndStatus();
        }
    }, [jobId, supabase]);

    const handleApply = async () => {
        if (!job) return;
        setApplying(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('applications')
                .insert({
                    job_id: job.id,
                    student_id: user.id,
                    status: 'Pending'
                });

            if (error) throw error;

            setHasApplied(true);
            // Optional: Add toast notification here
            alert('Application sent successfully!');

        } catch (err: any) {
            console.error('Error applying:', err);
            alert('Failed to apply: ' + err.message);
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="p-8 text-center text-slate-500">
                Job not found. <Link href="/dashboard/student/jobs" className="text-primary underline">Go back</Link>
            </div>
        );
    }

    // Display Logic Helpers
    const companyName = job.company_display_name || job.company?.name || 'Confidential Company';
    const companyBio = job.company_overview || 'No company description provided.';
    const website = job.company_website;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* 1. Header (Hero) */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <Link
                        href="/dashboard/student/jobs"
                        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Jobs
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                            {/* Company Logo/Avatar could go here if we had one separate from user profile, using profile photo for now */}
                            <div className="flex items-center gap-4 mb-4">
                                {job.company?.logo_url ? (
                                    <img src={job.company.logo_url} alt={companyName} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-white" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-700 flex items-center">
                                        {job.company?.id ? (
                                            <Link href={`/dashboard/student/companies/${job.company.id}`} className="hover:text-secondary hover:underline transition-colors">
                                                {companyName}
                                            </Link>
                                        ) : (
                                            companyName
                                        )}
                                        {job.company?.is_verified && <VerifiedBadge size={18} className="ml-1.5" />}
                                    </h2>
                                    {job.department && <span className="text-sm text-slate-500">{job.department}</span>}
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{job.title}</h1>

                            <div className="flex flex-wrap items-center gap-3">
                                {job.job_location_type && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {job.job_location_type}
                                    </span>
                                )}
                                {job.employment_type && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/5 text-primary border border-primary/10">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {job.employment_type}
                                    </span>
                                )}
                                {job.salary_range && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        {job.salary_range}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Apply Action */}
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <button
                                onClick={handleApply}
                                disabled={hasApplied || applying}
                                className={`
                        w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md
                        ${hasApplied
                                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-200'
                                        : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
                                    }
                    `}
                            >
                                {hasApplied ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Applied
                                    </>
                                ) : applying ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Apply Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column (Details) */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Overview */}
                    <section>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Role Overview</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {job.role_overview || job.description || 'No detailed overview provided.'}
                        </p>
                    </section>

                    {/* Responsibilities */}
                    {job.responsibilities && (
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Key Responsibilities</h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {job.responsibilities}
                            </div>
                        </section>
                    )}

                    {/* Application Requirements */}
                    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Requirements</h3>
                        <div className="space-y-6">
                            {job.skills_required && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Required Skills</h4>
                                    <p className="text-slate-600">{job.skills_required}</p>
                                </div>
                            )}
                            {job.skills_preferred && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Preferred Qualifications</h4>
                                    <p className="text-slate-600">{job.skills_preferred}</p>
                                </div>
                            )}
                            {job.education_requirements && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Education</h4>
                                    <div className="flex items-start gap-2 text-slate-600">
                                        <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                                        <span>{job.education_requirements}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* About Company */}
                    <section>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">About {companyName}</h3>
                        <p className="text-slate-600 leading-relaxed mb-4">{companyBio}</p>
                        {website && (
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary font-medium hover:underline"
                            >
                                <Globe className="w-4 h-4 mr-2" />
                                Visit Website
                            </a>
                        )}
                    </section>

                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">

                    {/* Key Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Job Summary</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-slate-900">Location</div>
                                    <div className="text-sm text-slate-500">
                                        {job.location_address || 'Not specified'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-slate-900">Posted On</div>
                                    <div className="text-sm text-slate-500">
                                        {new Date(job.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {job.application_deadline && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-red-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">Deadline</div>
                                        <div className="text-sm text-slate-500">
                                            {new Date(job.application_deadline).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Company Profile Link */}
                            {job.company?.id && (
                                <div className="pt-4 mt-4 border-t border-slate-100">
                                    <Link
                                        href={`/dashboard/student/companies/${job.company.id}`}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        View Company Profile
                                    </Link>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
