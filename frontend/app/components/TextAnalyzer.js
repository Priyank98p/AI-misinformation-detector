'use client';

import { useState } from 'react';
import { Search, Link, AlertCircle, CheckCircle, XCircle, Lightbulb, ExternalLink, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TextAnalyzer() {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!text.trim() && !url.trim()) {
            setError('Please enter some text or a URL to analyze');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(`${API_URL}/api/analyze-text`, {
                text: text.trim(),
                url: url.trim()
            });

            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze content. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getRiskBadge = (riskScore) => {
        const badges = {
            'Low': { icon: CheckCircle, className: 'badge-success', text: 'Low Risk' },
            'Medium': { icon: AlertCircle, className: 'badge-warning', text: 'Medium Risk' },
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

    const getScoreColor = (score) => {
        if (score >= 0.7) return 'text-red-600';
        if (score >= 0.4) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Analyze Content for Misinformation</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                            Text Content
                        </label>
                        <textarea
                            id="text"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Paste the article, claim, or text content you want to analyze..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Link className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="url"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Or enter a URL to analyze..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span>Analyze Content</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="card border-red-200 bg-red-50">
                    <div className="flex items-center space-x-2 text-red-800">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Error</span>
                    </div>
                    <p className="mt-2 text-red-700">{error}</p>
                </div>
            )}

            {/* Results Display */}
            {result && (
                <div className="space-y-6">
                    {/* Risk Assessment */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
                            {getRiskBadge(result.risk_score)}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Credibility Score</span>
                                <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                                    {(result.score * 100).toFixed(1)}%
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${result.score >= 0.7 ? 'bg-red-500' :
                                        result.score >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${result.score * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Analysis Reasons */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Details</h3>
                        <div className="space-y-3">
                            {result.reason.map((reason, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2" />
                                    <p className="text-gray-700">{reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Educational Tip */}
                    <div className="card bg-blue-50 border-blue-200">
                        <div className="flex items-start space-x-3">
                            <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Educational Tip</h4>
                                <p className="text-blue-800">{result.educational_tip}</p>
                            </div>
                        </div>
                    </div>

                    {/* Credible Sources */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credible Sources</h3>
                        <div className="space-y-3">
                            {result.sources.map((source, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <a
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-800 text-sm break-all"
                                    >
                                        {source}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
