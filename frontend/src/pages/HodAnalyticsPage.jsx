// src/pages/HodAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const HodAnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/analytics/hod');
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-white">Loading Analytics...</div>;
    if (!data) return <div className="p-8 text-white">Could not load analytics data.</div>;

    const eventsPerClubData = {
        labels: data.eventsPerClub.map(d => d.clubName),
        datasets: [{
            label: '# of Events',
            data: data.eventsPerClub.map(d => d.count),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
        }],
    };
    
    const statusDistributionData = {
        labels: data.statusDistribution.map(d => d.status.replace(/_/g, ' ')),
        datasets: [{
            data: data.statusDistribution.map(d => d.count),
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#6B7280'],
        }],
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-50 mb-8">HOD Analytics Dashboard</h1>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-gray-400 text-lg">Total Events</h2>
                    <p className="text-4xl font-bold text-white">{data.kpi.totalEvents}</p>
                </div>
                {/* Add other KPI cards for totalClubs and pendingEvents */}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-white mb-4">Events Per Club</h2>
                    <Bar data={eventsPerClubData} />
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-white mb-4">Event Status Distribution</h2>
                    <Doughnut data={statusDistributionData} />
                </div>
            </div>
        </div>
    );
};

export default HodAnalyticsPage;