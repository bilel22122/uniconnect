import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Building2, GraduationCap, ArrowRight, CheckCircle, Briefcase, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            Connect with Top <br className="hidden md:block" />
            <span className="text-blue-600">University Talent.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The bridge between academic excellence and professional success.
          </p>

          {/* Split Choice Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            {/* Company Button */}
            <button className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-blue-600 p-1 transition-all hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center gap-4 bg-blue-600 px-8 py-5 text-white">
                <Building2 className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs font-medium text-blue-100 uppercase tracking-wider">I am a Company</div>
                  <div className="text-xl font-bold">Hire Talent</div>
                </div>
                <ArrowRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </button>

            {/* Student Button */}
            <button className="group relative w-full sm:w-auto overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-1 transition-all hover:border-blue-600 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center gap-4 px-8 py-5">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="text-left text-slate-900">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider group-hover:text-blue-600">I am a Student</div>
                  <div className="text-xl font-bold">Find Work</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Role-Based Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* For Companies */}
            <div className="relative group rounded-3xl bg-slate-50 p-8 lg:p-12 border border-slate-100 hover:border-blue-100 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 className="w-48 h-48 text-blue-600" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex p-3 bg-blue-100 rounded-xl text-blue-600 mb-6">
                  <Building2 className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">For Companies</h2>
                <p className="text-slate-600 mb-8 text-lg">Build your future workforce with top-tier graduates.</p>

                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Post Jobs & Internships</h3>
                      <p className="text-slate-600">Reach motivated students ready to launch their careers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Verified Student Profiles</h3>
                      <p className="text-slate-600">Access talent with verified academic credentials and skills.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* For Students */}
            <div className="relative group rounded-3xl bg-slate-50 p-8 lg:p-12 border border-slate-100 hover:border-blue-100 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <GraduationCap className="w-48 h-48 text-blue-600" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex p-3 bg-white border border-slate-200 rounded-xl text-blue-600 mb-6 shadow-sm">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">For Students</h2>
                <p className="text-slate-600 mb-8 text-lg">Launch your career while you study.</p>

                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Build Your Professional CV</h3>
                      <p className="text-slate-600">Create a profile that showcases your academic achievements.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Get Paid Work</h3>
                      <p className="text-slate-600">Find paid internships, part-time jobs, and freelance gigs.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-slate-900">UniConnect</span>
              </div>
              <p className="text-slate-500 text-sm">Empowering the next generation of professionals.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Find Talent</Link>
              <Link href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Find Work</Link>
              <Link href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About Us</Link>
              <Link href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>
            </div>

            <div className="text-slate-400 text-sm">
              © 2026 UniConnect Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
