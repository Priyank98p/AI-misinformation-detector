'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Search, Link, TrendingUp, ExternalLink, Shield, Lightbulb } from 'lucide-react';
import TextAnalyzer from './components/TextAnalyzer';
import SourceCredibility from './components/SourceCredibility';
import MisinformationTrends from './components/MisinformationTrends';

export default function Home() {
    const [activeTab, setActiveTab] = useState('check-text');

    const tabs = [
        { id: 'check-text', label: 'Check Text', icon: Search },
        { id: 'source-credibility', label: 'Source Credibility', icon: Link },
        { id: 'misinformation-trends', label: 'Misinformation Trends', icon: TrendingUp },
    ];

    const getRiskBadge = (riskScore) => {
        const badges = {
            'Low': { icon: CheckCircle, className: 'badge-success', text: 'Low Risk' },
            'Medium': { icon: AlertTriangle, className: 'badge-warning', text: 'Medium Risk' },
            'High': { icon: XCircle, className: 'badge-danger', text: 'High Risk' },
        };

        const badge = badges[riskScore] || badges['Low'];
        const Icon = badge.icon;

        return (
            <span className={`badge ${badge.className}`}>
                <Icon className="w-4 h-4 mr-1" />
                {badge.text}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">AI Misinformation Detector</h1>
                                <p className="text-sm text-gray-600">Powered by Google Cloud AI</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Lightbulb className="w-4 h-4" />
                            <span>Prototype</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Main Content - Flex grow to push footer down */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {activeTab === 'check-text' && <TextAnalyzer />}
                {activeTab === 'source-credibility' && <SourceCredibility />}
                {activeTab === 'misinformation-trends' && <MisinformationTrends />}
            </main>

            {/* Footer - Always at bottom */}
            <footer className="bg-gray-100 border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                        AI Misinformation Detector – Empowering Users to Verify Facts<br />
                        Built by Team VisionFlux
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Powered by Google Cloud AI (Gemini)</span>
                        <ExternalLink className="w-4 h-4" />
                    </div>
                </div>
            </footer>

        </div>
    );
}
