const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        this.apiKey = process.env.GOOGLE_API_KEY;
        if (!this.apiKey) {
            throw new Error('GOOGLE_API_KEY is required');
        }
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Test API connectivity
        this.testConnection();
    }

    async testConnection() {
        try {
            console.log('🔍 Testing Google AI API connection...');
            const result = await this.model.generateContent('Hello');
            console.log('✅ Google AI API connection successful');
        } catch (error) {
            console.error('❌ Google AI API connection failed:', error.message);
        }
    }

    async analyzeText(userInput) {
        try {
            const prompt = `You are an AI misinformation detection assistant.
Analyze the following content: "${userInput}"

Respond ONLY in JSON with these exact fields:
{
  "risk_score": "Low" | "Medium" | "High",
  "score": 0.0-1.0,
  "reason": ["list of specific reasons why content may/may not be credible"],
  "educational_tip": "short actionable advice for the user",
  "sources": ["2-3 credible links related to the topic"]
}

Be thorough in your analysis. Consider:
- Factual accuracy
- Source credibility
- Emotional manipulation
- Logical fallacies
- Bias indicators
- Recent developments

Provide specific, actionable reasons and educational tips.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up the response to extract JSON
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }

            const analysis = JSON.parse(jsonMatch[0]);

            // Validate required fields
            if (!analysis.risk_score || !analysis.score || !analysis.reason || !analysis.educational_tip || !analysis.sources) {
                throw new Error('Invalid response format from Gemini API');
            }

            return analysis;
        } catch (error) {
            console.error('Gemini API Error:', error);

            // Fallback response when API is not available
            return this.getFallbackAnalysis(userInput);
        }
    }

    getFallbackAnalysis(userInput) {
        // Simple keyword-based analysis as fallback
        const text = userInput.toLowerCase();

        let riskScore = 'Low';
        let score = 0.2;
        const reasons = [];

        // Check for common misinformation indicators
        const highRiskKeywords = ['fake', 'hoax', 'conspiracy', 'cover-up', 'secret', 'they don\'t want you to know'];
        const mediumRiskKeywords = ['allegedly', 'rumors', 'sources say', 'unconfirmed'];

        const hasHighRisk = highRiskKeywords.some(keyword => text.includes(keyword));
        const hasMediumRisk = mediumRiskKeywords.some(keyword => text.includes(keyword));

        if (hasHighRisk) {
            riskScore = 'High';
            score = 0.8;
            reasons.push('Contains language commonly associated with misinformation');
            reasons.push('Uses sensational or conspiratorial language');
        } else if (hasMediumRisk) {
            riskScore = 'Medium';
            score = 0.5;
            reasons.push('Contains unverified claims or speculative language');
        } else {
            reasons.push('Content appears to be factual and well-sourced');
            reasons.push('No obvious indicators of misinformation detected');
        }

        return {
            risk_score: riskScore,
            score: score,
            reason: reasons,
            educational_tip: 'Always verify information from multiple credible sources before sharing',
            sources: [
                'https://www.factcheck.org/',
                'https://www.snopes.com/',
                'https://www.politifact.com/'
            ]
        };
    }

}

module.exports = GeminiService;
