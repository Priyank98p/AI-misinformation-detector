'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Search, Link, Lightbulb, Shield, ExternalLink } from 'lucide-react';
import TextAnalyzer from './components/TextAnalyzer';
import SourceCredibility from './components/SourceCredibility';

export default function Home() {
    const [activeTab, setActiveTab] = useState('check-text');

    const tabs = [
        { id: 'check-text', label: 'Check Text', icon: Search },
        { id: 'source-credibility', label: 'Source Credibility', icon: Link },
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                            <span>Hackathon Prototype</span>
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'check-text' && <TextAnalyzer />}
                {activeTab === 'source-credibility' && <SourceCredibility />}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Built with Next.js, TailwindCSS, and Google Cloud AI
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Ready for Vercel + Cloud Run deployment</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
