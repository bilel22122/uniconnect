import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-primary border-t border-slate-800 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-secondary" />
                            <span className="text-xl font-bold text-white">Apprenticeship</span>
                        </div>
                        <p className="text-gray-300 text-sm">Empowering the next generation of professionals.</p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Find Talent</Link>
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Find Work</Link>
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About Us</Link>
                        <Link href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Contact</Link>
                    </div>

                    {/* Copyright */}
                    <div className="text-gray-500 text-xs">
                        © 2026 Apprenticeship Inc. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
