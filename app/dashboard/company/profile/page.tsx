'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
  Building2, Globe, MapPin, Calendar, Users,
  Mail, Edit, Loader2, ExternalLink,
  Linkedin, Twitter, Phone, Rocket, History, Briefcase, UserCircle, Share2
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

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
  bio: string;
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
  is_verified?: boolean;
};

export default function CompanyProfileViewPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select(`
            company_name, photo_url, website, tagline, industry, company_size, founded_year,
            bio, history_milestones, markets_served,
            products_services,
            leadership_info,
            leadership_info,
            headquarters, contact_phone, public_email, linkedin_url, twitter_url,
            is_verified
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);

      } catch (err) {
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 mt-8 mx-auto max-w-lg">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Profile Not Found</h3>
        <p className="text-slate-500 mt-2 mb-6">It looks like your company profile is missing.</p>
        <Link
          href="/dashboard/company/profile/edit"
          className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-20">

      {/* 1. Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 relative">
        {/* Banner Background (Optional - using a gradient for now) */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end -mt-12 gap-6 relative z-10">
            {/* Logo */}
            <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.photo_url ? (
                <img src={profile.photo_url} alt={profile.company_name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-slate-300" />
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 text-center md:text-left pt-2 md:pt-0 pb-2">
              <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start">
                {profile.company_name || 'Your Company Name'}
                {profile.is_verified && <VerifiedBadge size={28} className="ml-2" />}
              </h1>
              {profile.tagline && (
                <p className="text-lg text-slate-600 mt-1 font-medium italic">"{profile.tagline}"</p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-slate-500 text-sm">
                <span>{profile.industry || 'Industry N/A'}</span>
                <span>•</span>
                <span>{profile.headquarters || 'Location N/A'}</span>
              </div>
            </div>

            {/* Actions & Social */}
            <div className="flex flex-col items-center md:items-end gap-3 pb-2 w-full md:w-auto">
              <Link
                href="/dashboard/company/profile/edit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md w-full md:w-auto justify-center"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>

              <div className="flex items-center gap-2">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {profile.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-full transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Sidebar: Quick Info & Contact */}
        <div className="space-y-6">

          {/* At a Glance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-blue-600" />
              At a Glance
            </h3>

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-500 text-sm">Founded</span>
                <span className="font-medium text-slate-900">{profile.founded_year || '-'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-500 text-sm">Company Size</span>
                <span className="font-medium text-slate-900">{profile.company_size || '-'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <span className="text-slate-500 text-sm">Headquarters</span>
                <span className="font-medium text-slate-900 text-right truncate max-w-[150px]">{profile.headquarters || '-'}</span>
              </div>
            </div>
          </div>

          {/* Markets */}
          {profile.markets_served && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                Markets Served
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.markets_served.split(',').map((market, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">
                    {market.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-green-600" />
              Contact Info
            </h3>

            <div className="space-y-4">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">Website</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}

              {profile.public_email && (
                <a href={`mailto:${profile.public_email}`} className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{profile.public_email}</span>
                </a>
              )}

              {profile.contact_phone && (
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{profile.contact_phone}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Main Column: Narrative */}
        <div className="lg:col-span-2 space-y-8">

          {/* About Us */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">About Us</h2>
            </div>
            {profile.bio ? (
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </div>
            ) : (
              <div className="text-slate-400 italic bg-slate-50 p-6 rounded-lg text-center">
                Introduction not added yet.
              </div>
            )}
          </div>

          {/* Products & Services */}
          {profile.products_services && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">What We Do</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.products_services}
              </div>
            </div>
          )}

          {/* History & Milestones */}
          {profile.history_milestones && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <History className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Our Story</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap border-l-4 border-amber-100 pl-4">
                {profile.history_milestones}
              </div>
            </div>
          )}

          {/* Leadership */}
          {profile.leadership_info && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <UserCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Leadership</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.leadership_info}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
