const express = require('express');
const GeminiService = require('../utils/gemini');

const router = express.Router();

// Mock sample posts data for prototype
const samplePosts = [
    {
        id: 1,
        text: "Drinking bleach cures COVID-19. Doctors don't want you to know this secret!",
        source: "Social Media",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
        id: 2,
        text: "The 2024 election was rigged! Millions of fake votes were counted.",
        source: "Twitter",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
        id: 3,
        text: "5G towers cause cancer and spread COVID-19. They're being installed everywhere!",
        source: "Facebook",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
    },
    {
        id: 4,
        text: "Vaccines contain microchips to track people. Bill Gates is behind this conspiracy.",
        source: "YouTube",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
    },
    {
        id: 5,
        text: "Climate change is a hoax created by scientists to get funding. The Earth is actually cooling.",
        source: "Reddit",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
    },
    {
        id: 6,
        text: "The moon landing was faked in a Hollywood studio. NASA has been lying for decades.",
        source: "TikTok",
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() // 18 hours ago
    },
    {
        id: 7,
        text: "Drinking bleach cures COVID-19. I tried it and felt better immediately!",
        source: "Instagram",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 hours ago
    },
    {
        id: 8,
        text: "The election was stolen! We need to audit every single vote.",
        source: "Parler",
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString() // 30 hours ago
    },
    {
        id: 9,
        text: "5G radiation is dangerous and causes health problems. Remove all towers!",
        source: "Telegram",
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() // 36 hours ago
    },
    {
        id: 10,
        text: "Vaccines are experimental and unsafe. Don't let them inject you with unknown chemicals.",
        source: "Gab",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 48 hours ago
    }
];

// Function to extract topic from post text
function extractTopic(text) {
    const textLower = text.toLowerCase();

    if (textLower.includes('covid') || textLower.includes('vaccine') || textLower.includes('bleach')) {
        return 'Health Misinformation';
    }
    if (textLower.includes('election') || textLower.includes('vote') || textLower.includes('rigged')) {
        return 'Election Misinformation';
    }
    if (textLower.includes('5g') || textLower.includes('tower') || textLower.includes('radiation')) {
        return '5G Conspiracy';
    }
    if (textLower.includes('climate') || textLower.includes('global warming') || textLower.includes('hoax')) {
        return 'Climate Denial';
    }
    if (textLower.includes('moon') || textLower.includes('nasa') || textLower.includes('landing')) {
        return 'Space Conspiracy';
    }
    if (textLower.includes('microchip') || textLower.includes('track') || textLower.includes('gates')) {
        return 'Vaccine Conspiracy';
    }

    return 'General Misinformation';
}

// GET /api/misinformation-trends
router.get('/misinformation-trends', async (req, res) => {
    try {
        console.log('🔍 Analyzing misinformation trends...');

        // Create GeminiService instance
        const geminiService = new GeminiService();

        // Analyze each sample post
        const analyzedPosts = [];

        for (const post of samplePosts) {
            try {
                const analysis = await geminiService.analyzeText(post.text);
                analyzedPosts.push({
                    ...post,
                    analysis: analysis,
                    topic: extractTopic(post.text)
                });
            } catch (error) {
                console.error(`Error analyzing post ${post.id}:`, error.message);
                // Use fallback analysis for failed posts
                analyzedPosts.push({
                    ...post,
                    analysis: {
                        risk_score: 'High',
                        score: 0.8,
                        reason: ['Content requires verification']
                    },
                    topic: extractTopic(post.text)
                });
            }
        }

        // Aggregate results by topic
        const topicMap = new Map();

        analyzedPosts.forEach(post => {
            const topic = post.topic;
            const score = post.analysis.score;

            if (topicMap.has(topic)) {
                const existing = topicMap.get(topic);
                existing.frequency += 1;
                existing.totalScore += score;
                existing.posts.push({
                    text: post.text,
                    source: post.source,
                    timestamp: post.timestamp,
                    risk_score: post.analysis.risk_score,
                    score: score
                });
            } else {
                topicMap.set(topic, {
                    topic: topic,
                    frequency: 1,
                    totalScore: score,
                    posts: [{
                        text: post.text,
                        source: post.source,
                        timestamp: post.timestamp,
                        risk_score: post.analysis.risk_score,
                        score: score
                    }]
                });
            }
        });

        // Convert to trends array and calculate average scores
        const trends = Array.from(topicMap.values()).map(topicData => ({
            topic: topicData.topic,
            frequency: topicData.frequency,
            average_risk_score: Math.round((topicData.totalScore / topicData.frequency) * 100) / 100,
            posts: topicData.posts
        }));

        // Sort by frequency (most frequent first)
        trends.sort((a, b) => b.frequency - a.frequency);

        // Get top 5 trends
        const topTrends = trends.slice(0, 5);

        console.log(`✅ Generated trends for ${topTrends.length} topics`);

        res.json({
            trends: topTrends,
            total_posts_analyzed: analyzedPosts.length,
            generated_at: new Date().toISOString(),
            time_range: "Last 48 hours"
        });

    } catch (error) {
        console.error('Trends analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze misinformation trends',
            message: error.message
        });
    }
});

// GET /api/misinformation-trends (for testing)
router.get('/misinformation-trends', (req, res) => {
    res.json({
        message: 'Use GET method to fetch misinformation trends',
        endpoint: '/api/misinformation-trends'
    });
});

module.exports = router;

