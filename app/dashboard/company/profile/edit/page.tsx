'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    Building2, Globe, MapPin, Calendar, Users,
    FileText, Save, Loader2, ArrowLeft, Image as ImageIcon,
    Rocket, History, Briefcase, UserCircle, Share2
} from 'lucide-react';
import AvatarUpload from '@/components/ui/AvatarUpload';

type CompanyProfile = {
    // Brand Identity
    company_name: string;
    photo_url: string;
    website: string;
    tagline: string;
    industry: string;
    company_size: string;
    founded_year: string;

    // The Story
    bio: string; // About Us
    history_milestones: string;
    markets_served: string;

    // Products & Services
    products_services: string;

    // Team
    leadership_info: string;

    // Contact & Social
    headquarters: string;
    contact_phone: string;
    public_email: string;
    linkedin_url: string;
    twitter_url: string;
};

export default function CompanyProfileEditPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const [formData, setFormData] = useState<CompanyProfile>({
        company_name: '', photo_url: '', website: '', tagline: '',
        industry: '', company_size: '', founded_year: '',
        bio: '', history_milestones: '', markets_served: '',
        products_services: '',
        leadership_info: '',
        headquarters: '', contact_phone: '', public_email: '', linkedin_url: '', twitter_url: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                setUserId(user.id);

                const { data, error } = await supabase
                    .from('profiles')
                    .select(`
            company_name, photo_url, website, tagline, industry, company_size, founded_year,
            bio, history_milestones, markets_served,
            products_services,
            leadership_info,
            headquarters, contact_phone, public_email, linkedin_url, twitter_url
          `)
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setFormData({
                        company_name: data.company_name || '',
                        photo_url: data.photo_url || '',
                        website: data.website || '',
                        tagline: data.tagline || '',
                        industry: data.industry || '',
                        company_size: data.company_size || '',
                        founded_year: data.founded_year || '',

                        bio: data.bio || '',
                        history_milestones: data.history_milestones || '',
                        markets_served: data.markets_served || '',

                        products_services: data.products_services || '',

                        leadership_info: data.leadership_info || '',

                        headquarters: data.headquarters || '',
                        contact_phone: data.contact_phone || '',
                        public_email: data.public_email || '',
                        linkedin_url: data.linkedin_url || '',
                        twitter_url: data.twitter_url || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [supabase, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update(formData)
                .eq('id', userId);

            if (error) throw error;

            router.push('/dashboard/company/profile');
            router.refresh();

        } catch (err: any) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile: ' + err.message);
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
        <div className="max-w-4xl mx-auto px-4 py-8 pb-40">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 bg-slate-50/95 backdrop-blur-sm py-4 z-10 border-b border-slate-200/50">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Edit Brand Profile</h1>
                    <p className="text-slate-500 mt-1">Build a comprehensive identity for students.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/company/profile')}
                        className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors font-medium border border-slate-300 bg-white"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        // Form is connected via ID or wrapped, but since specific sections are split, we trigger form submit or put form outside
                        // Best practice: wrap everything in form
                        form="profile-form"
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
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

            <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">

                {/* Card 1: Brand Identity */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <Rocket className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-900">Brand Identity</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tagline / Mission</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleInputChange}
                                    placeholder="Innovating for a better tomorrow"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Logo</label>
                            <div className="flex flex-col items-start gap-4">
                                <AvatarUpload
                                    url={formData.photo_url}
                                    onUpload={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
                                    size={100}
                                />
                                <p className="text-xs text-slate-500">
                                    Upload a square image (PNG, JPG) for best results.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Fintech"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Size</label>
                                <select
                                    name="company_size"
                                    value={formData.company_size}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select Size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="500+">500+ employees</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Founded Year</label>
                                <input
                                    type="text"
                                    name="founded_year"
                                    value={formData.founded_year}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2015"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://company.com"
                                        className="block w-full pl-10 rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: The Story */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <History className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-slate-900">The Story</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">About Us</label>
                            <textarea
                                name="bio"
                                rows={4}
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="General overview..."
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">History & Milestones</label>
                            <textarea
                                name="history_milestones"
                                rows={4}
                                value={formData.history_milestones}
                                onChange={handleInputChange}
                                placeholder="Founded in a garage... Raised Series A in 2024..."
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Markets Served</label>
                            <input
                                type="text"
                                name="markets_served"
                                value={formData.markets_served}
                                onChange={handleInputChange}
                                placeholder="e.g. North America, Europe, Asia"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Card 3: Products & Services */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <Briefcase className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-bold text-slate-900">Products & Services</h2>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">What do you build/offer?</label>
                        <textarea
                            name="products_services"
                            rows={4}
                            value={formData.products_services}
                            onChange={handleInputChange}
                            placeholder="Our flagship product is..."
                            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                        />
                    </div>
                </div>

                {/* Card 4: Leadership */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <UserCircle className="w-6 h-6 text-amber-600" />
                        <h2 className="text-xl font-bold text-slate-900">Leadership Team</h2>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Meet the Team</label>
                        <textarea
                            name="leadership_info"
                            rows={4}
                            value={formData.leadership_info}
                            onChange={handleInputChange}
                            placeholder="Jane Doe (CEO)... John Smith (CTO)..."
                            className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none resize-y"
                        />
                    </div>
                </div>

                {/* Card 5: Contact & Social */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                        <Share2 className="w-6 h-6 text-pink-600" />
                        <h2 className="text-xl font-bold text-slate-900">Contact & Social</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Headquarters Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="headquarters"
                                    value={formData.headquarters}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                            <input
                                type="text"
                                name="contact_phone"
                                value={formData.contact_phone}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Public Email</label>
                            <input
                                type="email"
                                name="public_email"
                                value={formData.public_email}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Twitter URL</label>
                            <input
                                type="url"
                                name="twitter_url"
                                value={formData.twitter_url}
                                onChange={handleInputChange}
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
