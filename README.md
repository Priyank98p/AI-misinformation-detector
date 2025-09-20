# AI-Powered Misinformation Detector

A prototype that uses Google Cloud AI (Gemini API) to detect and analyze misinformation in text content and URLs. Built with Next.js frontend and Node.js backend, ready for deployment to Vercel and Cloud Run.

## 🚀 Features

- **Text Analysis**: Analyze articles, claims, or any text content for misinformation
- **Source Credibility**: Evaluate the reliability of news sources and URLs
- **Misinformation Trends**: Real-time dashboard showing trending misinformation topics with frequency and risk scores
- **Interactive UI**: Modern, responsive interface built with TailwindCSS
- **Real-time Analysis**: Fast AI-powered analysis using Google Cloud AI

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Google Generative AI** - Gemini API integration
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
AI-misinformation-detector/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── globals.css      # Global styles
│   │   ├── layout.js        # Root layout
│   │   └── page.js          # Main page
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js API server
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── package.json
│   └── server.js
├── package.json             # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Cloud API key with Gemini API access

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/Priyank98p/AI-misinformation-detector.git
   cd AI-misinformation-detector
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Google API key:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=3001
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Individual Commands

- **Frontend only:** `npm run dev:frontend`
- **Backend only:** `npm run dev:backend`
- **Install all:** `npm run install:all`

## 🔧 API Endpoints

### POST /api/analyze-text
Analyze text content for misinformation.

**Request:**
```json
{
  "text": "Your text content here",
  "url": "Optional URL to analyze"
}
```

**Response:**
```json
{
  "risk_score": "Low|Medium|High",
  "score": 0.85,
  "reason": ["List of analysis reasons"],
  "educational_tip": "Actionable advice",
  "sources": ["Credible source URLs"]
}
```

### GET /api/misinformation-trends
Get trending misinformation topics with frequency and risk analysis.

**Response:**
```json
{
  "trends": [
    {
      "topic": "Health Misinformation",
      "frequency": 5,
      "average_risk_score": 0.9,
      "posts": [
        {
          "text": "Sample post text",
          "source": "Social Media",
          "timestamp": "2024-01-01T00:00:00.000Z",
          "risk_score": "High",
          "score": 0.95
        }
      ]
    }
  ],
  "total_posts_analyzed": 10,
  "generated_at": "2024-01-01T00:00:00.000Z",
  "time_range": "Last 48 hours"
}
```

## 🎨 UI Components

### Text Analyzer
- Input text area and URL field
- Real-time analysis with loading states
- Risk assessment with color-coded badges
- Detailed analysis reasons
- Educational tips and credible sources

### Source Credibility
- URL analysis for source reliability
- Domain information and credibility scoring
- Source verification checklist
- Alternative credible sources

### Misinformation Trends
- Real-time trending topics dashboard
- Frequency analysis with interactive charts
- Risk score visualization with color-coded badges
- Expandable sample posts with source attribution
- Best practices guidelines

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Cloud AI API key | Yes |
| `PORT` | Backend server port | No (default: 3001) |
| `NEXT_PUBLIC_API_URL` | Backend API URL for frontend | Yes |

## 🤖 AI Integration

### Gemini API
- **Text Analysis**: Comprehensive misinformation detection
- **Counter-Narrative**: Educational content generation
- **Source Evaluation**: Credibility assessment

### Imagen API (Future)
- **Visual Content**: Myth vs Fact infographics
- **Social Media Graphics**: Shareable educational content

## 📊 Features Overview

1. **Text Analysis** ✅
   - Risk scoring (Low/Medium/High)
   - Detailed reasoning
   - Educational tips
   - Credible sources

2. **Source Credibility** ✅
   - URL analysis
   - Domain evaluation
   - Verification checklist

3. **Misinformation Trends** ✅
   - Trending topics detection
   - Frequency analysis (how often misinformation appears)
   - Risk-level aggregation (average risk scores)
   - Interactive charts & visual insights

## 🛡️ Security & Privacy

- No data storage - all analysis is done in real-time
- API keys stored securely in environment variables
- CORS enabled for cross-origin requests
- Input validation and error handling

## 📄 License

MIT License - feel free to use this prototype for your projects!

---

Built with ❤️ for the hackathon
