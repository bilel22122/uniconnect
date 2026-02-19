'use client';

import CompanyNavbar from '@/components/CompanyNavbar';

export default function CompanyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <CompanyNavbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
