'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, BarChart3, Clock, ExternalLink } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function MisinformationTrends() {
    const [trends, setTrends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(() => {
        fetchTrends();
    }, []);

    const fetchTrends = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`${API_URL}/api/misinformation-trends`, {
                timeout: 45000 // 45 second timeout for trends analysis
            });
            setTrends(response.data.trends || []);
        } catch (err) {
            console.error('Trends fetch error:', err);

            // Handle different types of errors
            if (err.code === 'ECONNABORTED') {
                setError('Request timed out. Trends analysis is taking longer than expected. Please try again.');
            } else if (err.response?.status === 429) {
                setError('Too many requests. Please wait a moment and try again.');
            } else if (err.response?.status >= 500) {
                setError('Server error. Our trends analysis service is temporarily unavailable. Please try again later.');
            } else if (!err.response) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(err.response?.data?.message || 'Failed to fetch trends. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getRiskBadge = (score) => {
        if (score >= 0.8) {
            return { icon: XCircle, className: 'badge-danger', text: 'High Risk' };
        } else if (score >= 0.5) {
            return { icon: AlertTriangle, className: 'badge-warning', text: 'Medium Risk' };
        } else {
            return { icon: CheckCircle, className: 'badge-success', text: 'Low Risk' };
        }
    };

    const getRiskColor = (score) => {
        if (score >= 0.8) return 'text-red-600';
        if (score >= 0.5) return 'text-yellow-600';
        return 'text-green-600';
    };

    const getBarWidth = (frequency, maxFrequency) => {
        return (frequency / maxFrequency) * 100;
    };

    const maxFrequency = trends.length > 0 ? Math.max(...trends.map(t => t.frequency)) : 1;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="card">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <span className="ml-4 text-gray-600">Analyzing misinformation trends...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="card border-red-200 bg-red-50">
                    <div className="flex items-center space-x-2 text-red-800">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Error</span>
                    </div>
                    <p className="mt-2 text-red-700">{error}</p>
                    <button
                        onClick={fetchTrends}
                        className="mt-4 btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Misinformation Trends & Insights</h2>
                        <p className="text-gray-600">Real-time analysis of trending misinformation topics</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Last 48 hours</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>{trends.length} trending topics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>AI-powered analysis</span>
                    </div>
                </div>
            </div>

            {/* Trends Overview */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Misinformation Trends</h3>

                <div className="space-y-4">
                    {trends.map((trend, index) => {
                        const badge = getRiskBadge(trend.average_risk_score);
                        const BadgeIcon = badge.icon;

                        return (
                            <div
                                key={index}
                                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedTopic(selectedTopic === trend.topic ? null : trend.topic)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{trend.topic}</h4>
                                            <p className="text-sm text-gray-600">{trend.frequency} posts detected</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span className={`badge ${badge.className}`}>
                                            <BadgeIcon className="w-4 h-4 mr-1" />
                                            {badge.text}
                                        </span>
                                        <span className={`text-lg font-bold ${getRiskColor(trend.average_risk_score)}`}>
                                            {(trend.average_risk_score * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Frequency Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${trend.average_risk_score >= 0.8 ? 'bg-red-500' :
                                            trend.average_risk_score >= 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${getBarWidth(trend.frequency, maxFrequency)}%` }}
                                    />
                                </div>

                                {/* Expandable Posts */}
                                {selectedTopic === trend.topic && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h5 className="font-medium text-gray-900 mb-3">Sample Posts:</h5>
                                        <div className="space-y-2">
                                            {trend.posts.slice(0, 3).map((post, postIndex) => (
                                                <div key={postIndex} className="p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-800 mb-1">"{post.text}"</p>
                                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                                <span className="flex items-center space-x-1">
                                                                    <ExternalLink className="w-3 h-3" />
                                                                    <span>{post.source}</span>
                                                                </span>
                                                                <span className="flex items-center space-x-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{new Date(post.timestamp).toLocaleString()}</span>
                                                                </span>
                                                                <span className={`font-medium ${post.risk_score === 'High' ? 'text-red-600' :
                                                                    post.risk_score === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                                                    }`}>
                                                                    {post.risk_score} Risk
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chart Visualization */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequency Chart</h3>

                <div className="space-y-4">
                    {trends.map((trend, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="w-32 text-sm font-medium text-gray-700 truncate">
                                {trend.topic}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                <div
                                    className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-medium text-white ${trend.average_risk_score >= 0.8 ? 'bg-red-500' :
                                        trend.average_risk_score >= 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${getBarWidth(trend.frequency, maxFrequency)}%` }}
                                >
                                    {trend.frequency}
                                </div>
                            </div>
                            <div className="w-16 text-sm text-gray-600 text-right">
                                {(trend.average_risk_score * 100).toFixed(0)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center">
                <button
                    onClick={fetchTrends}
                    className="btn-primary flex items-center space-x-2"
                >
                    <TrendingUp className="w-4 h-4" />
                    <span>Refresh Trends</span>
                </button>
            </div>
        </div>
    );
}
