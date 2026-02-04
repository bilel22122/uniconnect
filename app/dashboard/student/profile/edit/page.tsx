'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    User, School, Briefcase, Link as LinkIcon, Save, Loader2,
    MapPin, Phone, Award, ArrowLeft, X
} from 'lucide-react';
import AvatarUpload from '@/components/ui/AvatarUpload';

export default function EditProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        // Standard
        full_name: '',
        email: '',
        // Personal
        photo_url: '',
        date_of_birth: '',
        gender: 'Prefer not to say',
        nationality: '',
        phone: '',
        address: '',
        // Academic
        university: '',
        student_id: '',
        major: '',
        current_year: '',
        expected_graduation: '',
        portfolio_url: '',
        // Skills & Exp
        skills: '', // Tech skills
        soft_skills: '',
        certifications: '',
        part_time_jobs: '',
        freelance_projects: '',
        // Extra
        clubs: '',
        sports: '',
        references_list: '',
        mobility: 'Flexible',
    });

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

                    if (error) throw error;

                    if (data) {
                        setProfile({
                            full_name: data.full_name || '',
                            email: data.email || user.email || '',
                            photo_url: data.photo_url || '',
                            date_of_birth: data.date_of_birth || '',
                            gender: data.gender || 'Prefer not to say',
                            nationality: data.nationality || '',
                            phone: data.phone || '',
                            address: data.address || '',
                            university: data.university || '',
                            student_id: data.student_id || '',
                            major: data.major || '',
                            current_year: data.current_year || '',
                            expected_graduation: data.expected_graduation || '',
                            portfolio_url: data.portfolio_url || '',
                            skills: data.skills || '',
                            soft_skills: data.soft_skills || '',
                            certifications: data.certifications || '',
                            part_time_jobs: data.part_time_jobs || '',
                            freelance_projects: data.freelance_projects || '',
                            clubs: data.clubs || '',
                            sports: data.sports || '',
                            references_list: data.references_list || '',
                            mobility: data.mobility || 'Flexible',
                        });
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    photo_url: profile.photo_url,
                    date_of_birth: profile.date_of_birth || null,
                    gender: profile.gender,
                    nationality: profile.nationality,
                    phone: profile.phone,
                    address: profile.address,
                    university: profile.university,
                    student_id: profile.student_id,
                    major: profile.major,
                    current_year: profile.current_year,
                    expected_graduation: profile.expected_graduation || null,
                    portfolio_url: profile.portfolio_url,
                    skills: profile.skills,
                    soft_skills: profile.soft_skills,
                    certifications: profile.certifications,
                    part_time_jobs: profile.part_time_jobs,
                    freelance_projects: profile.freelance_projects,
                    clubs: profile.clubs,
                    sports: profile.sports,
                    references_list: profile.references_list,
                    mobility: profile.mobility,
                })
                .eq('id', user.id);

            if (error) throw error;
            // Redirect back to view profile on success
            router.push('/dashboard/student/profile');

        } catch (err: any) {
            console.error("Error saving profile:", err);
            alert(`Failed to save profile: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
            <form onSubmit={handleSave}>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-4 z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Edit Your Profile</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Update your resume information</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard/student/profile')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm disabled:opacity-70"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">

                    {/* 1. Personal Identity */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                            <User className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-slate-900">Personal Identity</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <label className="block text-sm font-medium text-slate-700 mb-4">Profile Photo</label>
                                <AvatarUpload
                                    url={profile.photo_url}
                                    onUpload={(url) => setProfile(prev => ({ ...prev, photo_url: url }))}
                                    size={120}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={profile.full_name}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={profile.date_of_birth}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="Prefer not to say">Prefer not to say</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={profile.nationality}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Contact & Mobility */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                            <MapPin className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-bold text-slate-900">Contact & Mobility</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute top-2.5 left-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio / Link</label>
                                <div className="relative">
                                    <LinkIcon className="absolute top-2.5 left-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="url"
                                        name="portfolio_url"
                                        value={profile.portfolio_url}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleInputChange}
                                    placeholder="Street, City, Country"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Geographic Mobility</label>
                                <select
                                    name="mobility"
                                    value={profile.mobility}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="Flexible">Flexible / Willing to Relocate</option>
                                    <option value="Local Only">Local Only</option>
                                    <option value="Remote Only">Remote Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Academic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                            <School className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-slate-900">Academic Background</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
                                <input
                                    type="text"
                                    name="university"
                                    value={profile.university}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Major / Degree</label>
                                <input
                                    type="text"
                                    name="major"
                                    value={profile.major}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Computer Science"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Student ID - (Matricule)</label>
                                <input
                                    type="text"
                                    name="student_id"
                                    value={profile.student_id}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Year</label>
                                <input
                                    type="text"
                                    name="current_year"
                                    value={profile.current_year}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 3rd Year / Senior"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Graduation</label>
                                <input
                                    type="date"
                                    name="expected_graduation"
                                    value={profile.expected_graduation}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Experience & Skills */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                            <Briefcase className="w-6 h-6 text-orange-600" />
                            <h2 className="text-xl font-bold text-slate-900">Experience & Skills</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Technical Skills</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={profile.skills}
                                        onChange={handleInputChange}
                                        placeholder="e.g. React, SQL, Python"
                                        className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Soft Skills</label>
                                    <input
                                        type="text"
                                        name="soft_skills"
                                        value={profile.soft_skills}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Leadership, Communication"
                                        className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Part-Time Jobs / Internships</label>
                                <textarea
                                    name="part_time_jobs"
                                    rows={4}
                                    value={profile.part_time_jobs}
                                    onChange={handleInputChange}
                                    placeholder="Describe your previous work experience..."
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Freelance Projects</label>
                                <textarea
                                    name="freelance_projects"
                                    rows={4}
                                    value={profile.freelance_projects}
                                    onChange={handleInputChange}
                                    placeholder="Detail any freelance or personal projects..."
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 5. Extra Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                            <Award className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-bold text-slate-900">Achievements & Extra</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Certifications</label>
                                <input
                                    type="text"
                                    name="certifications"
                                    value={profile.certifications}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">References</label>
                                <input
                                    type="text"
                                    name="references_list"
                                    value={profile.references_list}
                                    onChange={handleInputChange}
                                    placeholder="Name & Contact of references"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Clubs & Associations</label>
                                <input
                                    type="text"
                                    name="clubs"
                                    value={profile.clubs}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sports & Hobbies</label>
                                <input
                                    type="text"
                                    name="sports"
                                    value={profile.sports}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}
