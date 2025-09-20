import './globals.css'

export const metadata = {
    title: 'AI Misinformation Detector',
    description: 'AI-powered tool to detect and analyze misinformation using Google Cloud AI',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gray-50">
                {children}
            </body>
        </html>
    )
}
