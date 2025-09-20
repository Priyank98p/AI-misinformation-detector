const express = require('express');
const GeminiService = require('../utils/gemini');

const router = express.Router();

// POST /api/analyze-text
router.post('/analyze-text', async (req, res) => {
    try {
        const { text, url } = req.body;

        // Input validation
        if (!text && !url) {
            return res.status(400).json({
                error: 'Either text or URL is required',
                message: 'Please provide either text content or a URL to analyze'
            });
        }

        // Validate text length
        if (text && text.length > 10000) {
            return res.status(400).json({
                error: 'Text too long',
                message: 'Text content must be 10,000 characters or less'
            });
        }

        // Basic URL validation
        if (url && !isValidUrl(url)) {
            return res.status(400).json({
                error: 'Invalid URL',
                message: 'Please provide a valid URL (e.g., https://example.com)'
            });
        }

        // Create GeminiService instance when needed
        const geminiService = new GeminiService();

        // If URL is provided, we could fetch the content here
        // For now, we'll just analyze the text directly
        const contentToAnalyze = text || `Content from URL: ${url}`;

        const analysis = await geminiService.analyzeText(contentToAnalyze);

        res.json({
            ...analysis,
            analyzed_content: contentToAnalyze,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Analysis error:', error);

        // Handle specific error types
        if (error.message.includes('quota')) {
            res.status(429).json({
                error: 'API quota exceeded',
                message: 'Analysis service is temporarily unavailable due to high demand. Please try again later.'
            });
        } else if (error.message.includes('API key')) {
            res.status(500).json({
                error: 'Configuration error',
                message: 'Analysis service is temporarily unavailable. Please try again later.'
            });
        } else {
            res.status(500).json({
                error: 'Failed to analyze content',
                message: 'An unexpected error occurred. Please try again later.'
            });
        }
    }
});

// URL validation helper
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// GET /api/analyze-text (for testing)
router.get('/analyze-text', (req, res) => {
    res.json({
        message: 'Use POST method to analyze text',
        example: {
            text: "Your text content here",
            url: "Optional URL to analyze"
        }
    });
});

module.exports = router;
