'use client';

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function GrowthChart() {
    const [data, setData] = useState<{ date: string; users: number; jobs: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profiles created data
                const { data: profiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('created_at');

                if (profilesError) throw profilesError;

                // Fetch jobs created data
                const { data: jobs, error: jobsError } = await supabase
                    .from('jobs')
                    .select('created_at');

                if (jobsError) throw jobsError;

                // Process Data Logic
                const datesMap = new Map<string, { users: number; jobs: number }>();
                const sortedData: { date: string; users: number; jobs: number }[] = [];

                // Helper to get date string (e.g. "Feb 10")
                const getFormattedDate = (dateObj: Date) => {
                    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                };

                // Helper to compare dates (YYYY-MM-DD for easier key usage)
                const getISODate = (dateObj: Date) => {
                    return dateObj.toISOString().split('T')[0];
                };

                // 1. Initialize last 30 days
                const today = new Date();
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const isoKey = getISODate(d);
                    const label = getFormattedDate(d);

                    datesMap.set(isoKey, { users: 0, jobs: 0 });
                    // Provide a reference to fill later, but rebuild array at end
                }

                // 2. Count Users
                profiles?.forEach(profile => {
                    if (!profile.created_at) return;
                    const d = new Date(profile.created_at);
                    const key = getISODate(d);
                    if (datesMap.has(key)) {
                        const current = datesMap.get(key)!;
                        datesMap.set(key, { ...current, users: current.users + 1 });
                    }
                });

                // 3. Count Jobs
                jobs?.forEach(job => {
                    if (!job.created_at) return;
                    const d = new Date(job.created_at);
                    const key = getISODate(d);
                    if (datesMap.has(key)) {
                        const current = datesMap.get(key)!;
                        datesMap.set(key, { ...current, jobs: current.jobs + 1 });
                    }
                });

                // 4. Convert map to array
                // We want to preserve the order of the last 30 days
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const isoKey = getISODate(d);
                    const label = getFormattedDate(d);
                    const counts = datesMap.get(isoKey) || { users: 0, jobs: 0 };

                    sortedData.push({
                        date: label,
                        users: counts.users,
                        jobs: counts.jobs
                    });
                }

                setData(sortedData);
            } catch (error) {
                console.error('Error fetching growth data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm h-[380px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Platform Growth (Last 30 Days)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                            labelStyle={{ color: '#64748B', marginBottom: '8px', fontSize: '12px' }}
                            cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="users"
                            name="New Users"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="jobs"
                            name="New Jobs"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
