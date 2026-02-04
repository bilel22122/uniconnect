'use client';

import TopNav from '@/components/dashboard/TopNav';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopNav role="student" />
            <main className="pt-20 max-w-7xl mx-auto px-4">
                {children}
            </main>
        </div>
    );
}
