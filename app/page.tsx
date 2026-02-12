import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import Footer from '@/components/Footer';
import { Building2, GraduationCap, ArrowRight, CheckCircle, Briefcase, Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
            Connect with Top <br className="hidden md:block" />
            <span className="text-secondary">Apprenticeship Talent.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            The bridge between academic excellence and professional success.
          </p>

          {/* Split Choice Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            {/* Student Button (Find an Apprenticeship) */}
            <Button variant="secondary" size="lg" className="group relative overflow-hidden p-0 h-auto">
              <div className="relative flex items-center justify-center gap-4 px-8 py-5">
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="text-left text-primary">
                  <div className="text-xs font-medium opacity-80 uppercase tracking-wider group-hover:text-white">I am a Student</div>
                  <div className="text-xl font-bold">Find an Apprenticeship</div>
                </div>
              </div>
            </Button>

            {/* Company Button (Post a Job) */}
            <Button variant="outline" size="lg" className="group relative overflow-hidden p-0 h-auto bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white border-transparent">
              <div className="relative flex items-center justify-center gap-4 px-8 py-5">
                <Building2 className="h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs font-medium text-gray-300 uppercase tracking-wider">I am a Company</div>
                  <div className="text-xl font-bold">Post a Job</div>
                </div>
                <ArrowRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Role-Based Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* For Companies */}
            <div className="relative group rounded-3xl bg-white shadow-xl p-8 lg:p-12 border border-slate-200 hover:border-secondary/50 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 className="w-48 h-48 text-primary" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl text-secondary mb-6">
                  <Building2 className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">For Companies</h2>
                <p className="text-slate-600 mb-8 text-lg">Build your future workforce with top-tier graduates.</p>

                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-secondary shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-lg">Post Jobs & Internships</h3>
                      <p className="text-slate-600">Reach motivated students ready to launch their careers.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-secondary shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-lg">Verified Student Profiles</h3>
                      <p className="text-slate-600">Access talent with verified academic credentials and skills.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* For Students */}
            <div className="relative group rounded-3xl bg-white shadow-xl p-8 lg:p-12 border border-slate-200 hover:border-secondary/50 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <GraduationCap className="w-48 h-48 text-primary" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex p-3 bg-white border border-slate-200 rounded-xl text-secondary mb-6 shadow-sm">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">For Students</h2>
                <p className="text-slate-600 mb-8 text-lg">Launch your career while you study.</p>

                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-secondary shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-lg">Build Your Professional CV</h3>
                      <p className="text-slate-600">Create a profile that showcases your academic achievements.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-1 rounded-full text-secondary shadow-sm">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-lg">Get Paid Work</h3>
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
      <Footer />
    </div>
  );
}
