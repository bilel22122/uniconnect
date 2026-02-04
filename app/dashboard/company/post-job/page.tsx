'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    Building2, MapPin, Briefcase, FileText, Globe,
    Calendar, CheckCircle, AlertCircle, Loader2, Save
} from 'lucide-react';

export default function PostJobPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        // Basics
        title: '',
        department: '',
        employment_type: 'Full-time',
        application_deadline: '',

        // Location
        job_location_type: 'On-site',
        location_address: '', // Specific address or city

        // Role Details
        role_overview: '',
        responsibilities: '',

        // Requirements
        skills_required: '',
        skills_preferred: '',
        education_requirements: '',

        // Legacy/Simple fields (kept for backward compatibility if needed, or mapped)
        category: 'Engineering', // Default
        salary_range: '',

        // Company Overrides
        company_display_name: '',
        company_overview: '',
        company_website: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('You must be logged in as a company to post a job.');
            }

            const { error: insertError } = await supabase
                .from('jobs')
                .insert({
                    company_id: user.id,
                    title: formData.title,
                    description: formData.role_overview, // Reuse role_overview for description to satisfy constraint
                    department: formData.department,
                    employment_type: formData.employment_type,
                    application_deadline: formData.application_deadline || null,

                    job_location_type: formData.job_location_type,
                    location_address: formData.location_address,

                    role_overview: formData.role_overview,
                    responsibilities: formData.responsibilities,

                    skills_required: formData.skills_required,
                    skills_preferred: formData.skills_preferred,
                    education_requirements: formData.education_requirements,

                    category: formData.category,
                    salary_range: formData.salary_range,

                    company_display_name: formData.company_display_name,
                    company_overview: formData.company_overview,
                    company_website: formData.company_website,
                });

            if (insertError) throw insertError;

            router.push('/dashboard/company/listings');
            router.refresh();

        } catch (err: any) {
            console.error('Error posting job:', err);
            setError(err.message || 'Failed to post job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Post a New Job</h1>
                <p className="text-slate-500 mt-1">Create a detailed job listing to attract the best student talent.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section 1: The Basics */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-900">The Basics</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Junior Frontend Developer"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                placeholder="e.g. Engineering, Marketing"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category (Search)</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Business">Business</option>
                                <option value="Data">Data Science</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                            <select
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                            <input
                                type="date"
                                name="application_deadline"
                                value={formData.application_deadline}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range (Optional)</label>
                            <input
                                type="text"
                                name="salary_range"
                                value={formData.salary_range}
                                onChange={handleInputChange}
                                placeholder="e.g. $50k - $70k or 'Market Rate'"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Location */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <MapPin className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-bold text-slate-900">Location</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Work Mode</label>
                            <select
                                name="job_location_type"
                                value={formData.job_location_type}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location Details / Address</label>
                            <input
                                type="text"
                                name="location_address"
                                value={formData.location_address}
                                onChange={handleInputChange}
                                placeholder={formData.job_location_type === 'Remote' ? 'e.g. Remote (US Only)' : 'e.g. New York, NY or Full Address'}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Role Details */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <FileText className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-slate-900">Role Details</h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role Overview (Short Summary)</label>
                            <textarea
                                name="role_overview"
                                rows={3}
                                value={formData.role_overview}
                                onChange={handleInputChange}
                                placeholder="Briefly describe what this role entails..."
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Key Responsibilities</label>
                            <textarea
                                name="responsibilities"
                                rows={6}
                                value={formData.responsibilities}
                                onChange={handleInputChange}
                                placeholder="• Lead the development of..."
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y font-mono text-sm"
                            />
                            <p className="mt-1 text-xs text-slate-500">Tip: Use bullet points (• or -) for better readability.</p>
                        </div>
                    </div>
                </div>

                {/* Section 4: Requirements */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <CheckCircle className="w-6 h-6 text-orange-600" />
                        <h2 className="text-xl font-bold text-slate-900">Requirements</h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills</label>
                            <textarea
                                name="skills_required"
                                rows={3}
                                value={formData.skills_required}
                                onChange={handleInputChange}
                                placeholder="e.g. React, Node.js, TypeScript (Comma separated or new lines)"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Skills</label>
                            <textarea
                                name="skills_preferred"
                                rows={3}
                                value={formData.skills_preferred}
                                onChange={handleInputChange}
                                placeholder="Nice-to-haves..."
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Education Requirements</label>
                            <input
                                type="text"
                                name="education_requirements"
                                value={formData.education_requirements}
                                onChange={handleInputChange}
                                placeholder="e.g. Pursuing BS in Computer Science or related field"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 5: Company Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <Building2 className="w-6 h-6 text-slate-600" />
                        <h2 className="text-xl font-bold text-slate-900">Company Info (Overrides)</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">Leave these blank to use your company profile defaults.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Display Name</label>
                            <input
                                type="text"
                                name="company_display_name"
                                value={formData.company_display_name}
                                onChange={handleInputChange}
                                placeholder="Override profile name if needed"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Website</label>
                            <input
                                type="url"
                                name="company_website"
                                value={formData.company_website}
                                onChange={handleInputChange}
                                placeholder="https://company.com"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">About Us (Specific for this role)</label>
                            <textarea
                                name="company_overview"
                                rows={3}
                                value={formData.company_overview}
                                onChange={handleInputChange}
                                placeholder="A short blurb about the company or specific team..."
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 pb-20">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Publish Job
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
