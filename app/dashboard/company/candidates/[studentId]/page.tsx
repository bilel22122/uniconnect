'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    ArrowLeft, Mail, Phone, MapPin, Globe, User,
    Briefcase, School, Award, Calendar, ExternalLink
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

type Profile = {
    full_name: string;
    email: string;
    photo_url: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    phone: string;
    address: string;
    university: string;
    major: string;
    current_year: string;
    expected_graduation: string;
    portfolio_url: string;
    skills: string;
    soft_skills: string;
    part_time_jobs: string;
    freelance_projects: string;
    clubs: string;
    sports: string;
    certifications: string;
    mobility: string;
    is_verified?: boolean;
};

export default function StudentResumePage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const studentId = params?.studentId as string;

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!studentId) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', studentId)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (err: any) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [studentId, supabase]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-slate-700">Student not found</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Candidates
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border-4 border-white shadow-sm flex items-center justify-center">
                    {profile.photo_url ? (
                        <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-12 h-12 text-slate-300" />
                    )}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start">
                        {profile.full_name}
                        {profile.is_verified && <VerifiedBadge size={24} className="ml-2" />}
                    </h1>
                    <p className="text-lg text-slate-500 mt-1 font-medium">
                        {profile.major ? `${profile.major} Student` : 'Student'}
                        {profile.university && ` at ${profile.university}`}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-slate-600">
                        {profile.current_year && (
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                                <School className="w-4 h-4 text-slate-400" />
                                {profile.current_year}
                            </span>
                        )}
                        {profile.mobility && (
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                                <Globe className="w-4 h-4 text-slate-400" />
                                {profile.mobility}
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    {profile.portfolio_url && (
                        <a
                            href={profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Portfolio
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Contact & Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Contact Info
                        </h3>
                        <div className="space-y-3 text-sm">
                            {profile.email && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <a href={`mailto:${profile.email}`} className="hover:text-blue-600 transition-colors">{profile.email}</a>
                                </div>
                            )}
                            {profile.phone && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {profile.phone}
                                </div>
                            )}
                            {profile.address && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    {profile.address}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-600" />
                            Details
                        </h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <div>
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Nationality</span>
                                {profile.nationality || 'Not specified'}
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Date of Birth</span>
                                {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not specified'}
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Gender</span>
                                {profile.gender}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Academic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <School className="w-5 h-5 text-blue-600" />
                            Education
                        </h3>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                            <div className="font-semibold text-slate-900 text-lg">{profile.university}</div>
                            {profile.expected_graduation && (
                                <div className="text-sm text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Graduation: {new Date(profile.expected_graduation).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        <div className="text-blue-600 font-medium">{profile.major}</div>
                    </div>

                    {/* Experience */}
                    {(profile.part_time_jobs || profile.freelance_projects) && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-orange-600" />
                                Experience
                            </h3>

                            {profile.part_time_jobs && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Part-Time Jobs / Internships</h4>
                                    <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">{profile.part_time_jobs}</p>
                                </div>
                            )}

                            {profile.freelance_projects && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Freelance Projects</h4>
                                    <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">{profile.freelance_projects}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Skills */}
                    {(profile.skills || profile.soft_skills) && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-purple-600" />
                                Skills
                            </h3>

                            {profile.skills && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Technical Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.split(',').map((skill, i) => (
                                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {profile.soft_skills && (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Soft Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.soft_skills.split(',').map((skill, i) => (
                                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Extracurricular */}
                    {(profile.clubs || profile.sports || profile.certifications) && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                Achievements & Activities
                            </h3>
                            {profile.certifications && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Certifications</h4>
                                    <p className="text-slate-600 text-sm">{profile.certifications}</p>
                                </div>
                            )}
                            {profile.clubs && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Clubs & Associations</h4>
                                    <p className="text-slate-600 text-sm">{profile.clubs}</p>
                                </div>
                            )}
                            {profile.sports && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Sports</h4>
                                    <p className="text-slate-600 text-sm">{profile.sports}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
