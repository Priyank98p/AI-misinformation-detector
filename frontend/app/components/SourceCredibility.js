'use client';

import { useState } from 'react';
import { Link, ExternalLink, CheckCircle, AlertTriangle, XCircle, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SourceCredibility() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        // Input validation
        if (!url.trim()) {
            setError('Please enter a URL to analyze');
            return;
        }

        // URL validation
        if (!isValidUrl(url.trim())) {
            setError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            // For this prototype, we'll analyze the URL as text content
            // In a real implementation, you'd fetch the actual content
            const response = await axios.post(`${API_URL}/api/analyze-text`, {
                text: `Analyze the credibility of this source: ${url}`,
                url: url.trim()
            }, {
                timeout: 30000 // 30 second timeout
            });

            setResult(response.data);
        } catch (err) {
            console.error('Source analysis error:', err);

            // Handle different types of errors
            if (err.code === 'ECONNABORTED') {
                setError('Request timed out. The analysis is taking longer than expected. Please try again.');
            } else if (err.response?.status === 429) {
                setError('Too many requests. Please wait a moment and try again.');
            } else if (err.response?.status === 400) {
                setError(err.response.data.error || 'Invalid URL. Please check your input.');
            } else if (err.response?.status >= 500) {
                setError('Server error. Our analysis service is temporarily unavailable. Please try again later.');
            } else if (!err.response) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(err.response?.data?.message || 'Failed to analyze source. Please try again.');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    // URL validation helper
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const getCredibilityBadge = (riskScore) => {
        const badges = {
            'Low': { icon: CheckCircle, className: 'badge-success', text: 'Credible Source' },
            'Medium': { icon: AlertTriangle, className: 'badge-warning', text: 'Questionable Source' },
            'High': { icon: XCircle, className: 'badge-danger', text: 'Unreliable Source' },
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

    const getDomainInfo = (url) => {
        try {
            const domain = new URL(url).hostname;
            const isNews = /\.(com|org|net|edu|gov)$/.test(domain);
            const isSubdomain = domain.split('.').length > 2;

            return {
                domain,
                isNews,
                isSubdomain,
                type: isNews ? 'News Domain' : 'Other Domain'
            };
        } catch {
            return {
                domain: url,
                isNews: false,
                isSubdomain: false,
                type: 'Invalid URL'
            };
        }
    };

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Analyze Source Credibility</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                            Source URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Link className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                id="url"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter the URL of the source to analyze..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Analyzing Source...</span>
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span>Analyze Source</span>
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
                    {/* Source Information */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Source Analysis</h3>
                            {getCredibilityBadge(result.risk_score)}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <ExternalLink className="w-5 h-5 text-gray-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{url}</p>
                                    <p className="text-xs text-gray-500">{getDomainInfo(url).domain}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">{(result.score * 100).toFixed(1)}%</p>
                                    <p className="text-sm text-gray-600">Credibility Score</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">{getDomainInfo(url).type}</p>
                                    <p className="text-sm text-gray-600">Domain Type</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">
                                        {getDomainInfo(url).isSubdomain ? 'Yes' : 'No'}
                                    </p>
                                    <p className="text-sm text-gray-600">Subdomain</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Details */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credibility Assessment</h3>
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
                            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Source Verification Tips</h4>
                                <p className="text-blue-800">{result.educational_tip}</p>
                            </div>
                        </div>
                    </div>

                    {/* Alternative Sources */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Credible Sources</h3>
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

                    {/* Source Verification Checklist */}
                    <div className="card bg-green-50 border-green-200">
                        <h3 className="text-lg font-semibold text-green-900 mb-4">Source Verification Checklist</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800">Check the domain and publisher reputation</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800">Look for author credentials and contact information</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800">Verify publication date and check for updates</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800">Cross-reference with other credible sources</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-green-800">Check for bias and potential conflicts of interest</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
