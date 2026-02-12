import Link from 'next/link';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

type Company = {
    id: string;
    company_name: string;
    photo_url: string | null;
    industry: string | null;
    headquarters: string | null;
    website: string | null;
    is_verified?: boolean;
};

interface CompanyCardProps {
    company: Company;
    hrefPrefix?: string; // e.g. "/dashboard/student/companies"
}

export default function CompanyCard({ company, hrefPrefix = "/dashboard/student/companies" }: CompanyCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-6 flex flex-col h-full group">

            <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {company.photo_url ? (
                        <img src={company.photo_url} alt={company.company_name} className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="w-8 h-8 text-slate-300" />
                    )}
                </div>
            </div>

            <div className="mb-6 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 flex items-center">
                    {company.company_name}
                    {company.is_verified && <VerifiedBadge size={18} className="ml-1.5" />}
                </h3>
                <div className="flex flex-col gap-2">
                    {company.industry ? (
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md w-fit">
                            {company.industry}
                        </span>
                    ) : (
                        <span className="text-xs font-semibold text-slate-300 bg-slate-50 px-2.5 py-1 rounded-md w-fit">
                            No Industry
                        </span>
                    )}
                    {company.headquarters && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {company.headquarters}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-50 mt-auto">
                <Link
                    href={`${hrefPrefix}/${company.id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm"
                >
                    Visit Profile
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

        </div>
    );
}
