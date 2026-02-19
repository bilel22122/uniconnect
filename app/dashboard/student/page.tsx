export default function StudentDashboard() {
    return (
        <div className="w-full h-full p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here is your overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-700">Total Applications</h3>
                    <p className="text-3xl font-bold text-primary mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-700">Interviews</h3>
                    <p className="text-3xl font-bold text-primary mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-semibold text-slate-700">Profile Views</h3>
                    <p className="text-3xl font-bold text-primary mt-2">0</p>
                </div>
            </div>
        </div>
    );
}
