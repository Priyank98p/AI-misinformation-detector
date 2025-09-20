const express = require('express');
const GeminiService = require('../utils/gemini');

const router = express.Router();

// POST /api/analyze-text
router.post('/analyze-text', async (req, res) => {
    try {
        const { text, url } = req.body;

        if (!text && !url) {
            return res.status(400).json({
                error: 'Either text or URL is required'
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
        res.status(500).json({
            error: 'Failed to analyze content',
            message: error.message
        });
    }
});

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
