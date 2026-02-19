import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* Page Header (Hero Light) */}
            <section className="bg-primary pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
                    <p className="text-xl text-gray-300 max-w-2xl">
                        Building the bridge between academic excellence and professional success.
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100">

                    {/* Mission Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-2">Our Mission</h2>
                        {/* Gold Divider */}
                        <div className="w-20 h-1 bg-secondary rounded mb-6"></div>

                        <p className="text-lg text-primary leading-relaxed mb-6">
                            At Apprenticeship, we believe that talent is universal, but opportunity is not.
                            Our mission is to connect ambitious students with forward-thinking companies
                            to create meaningful professional apprenticeships.
                        </p>
                        <p className="text-lg text-primary leading-relaxed">
                            We are redefining how students enter the workforce, moving beyond traditional
                            internships to structured, skill-based apprenticeships that provide real value
                            to both the learner and the employer.
                        </p>
                    </div>

                    {/* Values Section */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-bold text-primary mb-6">Core Values</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                                <span className="text-primary text-lg">Excellence in every connection.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                                <span className="text-primary text-lg">Transparency and trust in verification.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                                <span className="text-primary text-lg">Empowerment through practical skills.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
                        <h3 className="text-xl font-bold text-primary mb-2">Join the Movement</h3>
                        <p className="text-primary mb-0">
                            Whether you are a student ready to launch your career or a company looking for
                            top talent, we have a place for you.
                        </p>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
