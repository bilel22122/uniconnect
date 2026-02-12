import Link from 'next/link';
import { Building2, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

type Job = {
    id: string;
    title: string;
    company_id: string;
    category: string;
    job_location_type: string;
    employment_type: string;
    salary_range: string;
    location?: string;
    location_address?: string;
    salary_min?: number;
    salary_max?: number;
    created_at: string;
    company: {
        company_name: string;
        photo_url: string;
        is_verified?: boolean;
    }
};

interface JobCardProps {
    job: Job;
    hrefPrefix?: string; // e.g. "/dashboard/student/jobs" or "/jobs"
}

export default function JobCard({ job, hrefPrefix = "/dashboard/student/jobs" }: JobCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full">

            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                        {job.company?.photo_url ? (
                            <img src={job.company.photo_url} alt={job.company.company_name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <Building2 className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            <Link href={`${hrefPrefix}/${job.id}`}>
                                {job.title}
                            </Link>
                        </h3>
                        <div className="text-sm text-slate-500 flex items-center">
                            {job.company?.company_name || 'Confidential'}
                            {job.company?.is_verified && <VerifiedBadge size={16} className="ml-1" />}
                        </div>
                    </div>
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                    {job.employment_type || 'Full-time'}
                </span>
            </div>

            {/* Tags/Info */}
            <div className="space-y-2 mb-6 flex-grow">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {job.job_location_type || 'On-site'} {job.location ? `• ${job.location}` : ''}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    {job.salary_min ? `${job.salary_min} - ${job.salary_max}` : (job.salary_range || 'Competitive')}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                <span className="text-xs text-slate-400">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                </span>

                <Link
                    href={`${hrefPrefix}/${job.id}`}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

        </div>
    );
}
