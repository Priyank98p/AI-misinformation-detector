# AI-Powered Misinformation Detector

A prototype that uses Google Cloud AI (Gemini API) to detect and analyze misinformation in text content and URLs. Built with Next.js frontend and Node.js backend, ready for deployment to Vercel and Cloud Run.

## 🚀 Features

- **Text Analysis**: Analyze articles, claims, or any text content for misinformation
- **Source Credibility**: Evaluate the reliability of news sources and URLs
- **Counter-Narrative Generation**: Create educational content to counter misinformation
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
ai-misinformation-detector/
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
   git clone <repository-url>
   cd ai-misinformation-detector
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
  "sources": ["Credible source URLs"],
  "counter_narrative": {
    "myth": "Misleading claim",
    "fact": "Correct information",
    "shareable_message": "Social media message"
  }
}
```

### POST /api/generate-graphic
Generate counter-narrative visual content.

**Request:**
```json
{
  "myth": "Misleading claim",
  "fact": "Correct information",
  "riskScore": "High"
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

### Counter-Narrative
- Myth vs Fact comparison
- Shareable message generation
- Visual content descriptions
- Best practices guidelines

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url`
3. Deploy automatically on push to main branch

### Backend (Google Cloud Run)
1. Build Docker image:
   ```bash
   cd backend
   docker build -t misinformation-detector-api .
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy misinformation-detector-api \
     --image gcr.io/PROJECT_ID/misinformation-detector-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

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

3. **Counter-Narrative** ✅
   - Myth vs Fact generation
   - Shareable messages
   - Visual descriptions

## 🛡️ Security & Privacy

- No data storage - all analysis is done in real-time
- API keys stored securely in environment variables
- CORS enabled for cross-origin requests
- Input validation and error handling

## 🤝 Contributing

This is a hackathon prototype. For production use, consider:

- Adding user authentication
- Implementing data persistence
- Adding more AI models
- Improving error handling
- Adding comprehensive testing

## 📄 License

MIT License - feel free to use this prototype for your projects!

---

**Built with ❤️ for the hackathon** - Ready for Vercel + Cloud Run deployment!
