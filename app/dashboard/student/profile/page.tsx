'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
    User, School, Briefcase, Link as LinkIcon, Edit2,
    MapPin, Phone, Mail, Globe, Award, Calendar, ExternalLink,
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

export default function StudentProfileViewPage() {
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.id) throw new Error("No user found");

            const file = event.target.files[0];
            const fileName = `${user.id}/${Date.now()}_${file.name}`; // Unique path

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
            const publicUrl = data.publicUrl;

            // Safety Check: Double verify user.id exists before update
            if (!user?.id) return;

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ photo_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Update local state
            setProfile((prev: any) => ({ ...prev, photo_url: publicUrl }));

        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            alert('Error updating avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (data) {
                        setProfile(data);
                    }
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20">

            {/* 1. Header Hero Section */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                {/* Cover Gradient */}
                <div className="h-48 bg-gradient-to-r from-primary to-slate-900 w-full relative">
                    <Link
                        href="/dashboard/student/profile/edit"
                        className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                    </Link>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 flex flex-col md:flex-row items-start md:items-end gap-6">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 shadow-md overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                            {profile.photo_url ? (
                                <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-slate-300" />
                            )}

                            {/* Upload Overlay */}
                            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <Edit2 className="w-6 h-6 text-white" />
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                {profile.full_name}
                                {profile.is_verified && <VerifiedBadge size={28} className="ml-2" />}
                            </h1>
                            <p className="text-lg text-gray-900 font-medium mt-1">
                                {profile.major || 'Student'}
                                <span className="text-slate-400 mx-2">•</span>
                                {profile.university || 'University Name'}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600">
                                {profile.nationality && (
                                    <span className="flex items-center gap-1.5">
                                        <Globe className="w-4 h-4 text-slate-500" />
                                        {profile.nationality}
                                    </span>
                                )}
                                {profile.mobility && (
                                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide">
                                        {profile.mobility}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Layout */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column */}
                <div className="space-y-6">

                    {/* Contact */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="tex-sm font-bold text-slate-900 uppercase tracking-wider mb-4">About & Contact</h3>
                        <div className="space-y-4 text-sm">
                            {profile.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <div className="text-slate-900 font-medium">Email</div>
                                        <div className="text-slate-500">{profile.email}</div>
                                    </div>
                                </div>
                            )}
                            {profile.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <div className="text-slate-900 font-medium">Phone</div>
                                        <div className="text-slate-500">{profile.phone}</div>
                                    </div>
                                </div>
                            )}
                            {profile.address && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <div className="text-slate-900 font-medium">Location</div>
                                        <div className="text-slate-500">{profile.address}</div>
                                    </div>
                                </div>
                            )}
                            {profile.portfolio_url && (
                                <div className="flex items-start gap-3">
                                    <ExternalLink className="w-4 h-4 text-secondary mt-0.5" />
                                    <div>
                                        <div className="text-slate-900 font-medium">Portfolio</div>
                                        <a href={profile.portfolio_url} target="_blank" className="text-primary hover:underline break-all">
                                            View Website
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="tex-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Skills</h3>
                        <div className="flex flex-col gap-4">
                            {/* Tech */}
                            {profile.skills && (
                                <div>
                                    <div className="text-xs font-semibold text-slate-400 mb-2">TECHNICAL</div>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.split(',').map((skill: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Soft */}
                            {profile.soft_skills && (
                                <div>
                                    <div className="text-xs font-semibold text-slate-400 mb-2">PERSONAL</div>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.soft_skills.split(',').map((skill: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!profile.skills && !profile.soft_skills && (
                                <p className="text-slate-400 italic text-sm">No skills added yet.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column (Main) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Education */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <School className="w-5 h-5 text-secondary" />
                            <h2 className="text-lg font-bold text-slate-900">Education</h2>
                        </div>

                        <div className="pl-2 border-l-2 border-slate-100 ml-2 space-y-6">
                            <div className="relative pl-6">
                                <div className="absolute -left-[1.3rem] top-1 w-3 h-3 rounded-full bg-secondary border-2 border-white shadow-sm" />
                                <h3 className="text-lg font-semibold text-slate-900">{profile.university}</h3>
                                <div className="text-slate-600 font-medium mb-1">{profile.major}</div>

                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                    {profile.current_year && (
                                        <span>Current Year: {profile.current_year}</span>
                                    )}
                                    {profile.expected_graduation && (
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-xs">
                                            <Calendar className="w-3 h-3" />
                                            Graduation: {new Date(profile.expected_graduation).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Briefcase className="w-5 h-5 text-secondary" />
                            <h2 className="text-lg font-bold text-slate-900">Experience</h2>
                        </div>

                        {!profile.part_time_jobs && !profile.freelance_projects ? (
                            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                No experience added yet.
                                <Link href="/dashboard/student/profile/edit" className="ml-1 text-primary hover:underline">Add some?</Link>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {profile.part_time_jobs && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                            Part-Time / Internships
                                        </h4>
                                        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                                            {profile.part_time_jobs}
                                        </p>
                                    </div>
                                )}
                                {profile.freelance_projects && (
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                            Freelance Projects
                                        </h4>
                                        <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                                            {profile.freelance_projects}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Extra */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Award className="w-5 h-5 text-secondary" />
                            <h2 className="text-lg font-bold text-slate-900">Achievements & Activities</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {profile.certifications && (
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Certifications</h4>
                                    <p className="text-slate-600 text-sm">{profile.certifications}</p>
                                </div>
                            )}
                            {profile.clubs && (
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Clubs</h4>
                                    <p className="text-slate-600 text-sm">{profile.clubs}</p>
                                </div>
                            )}
                            {profile.sports && (
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-slate-900 text-sm mb-1">Sports</h4>
                                    <p className="text-slate-600 text-sm">{profile.sports}</p>
                                </div>
                            )}
                        </div>

                        {!profile.certifications && !profile.clubs && !profile.sports && (
                            <div className="text-slate-400 italic text-sm">No activities added.</div>
                        )}
                    </div>

                </div>

            </div>

        </div>
    );
}
