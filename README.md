# Aurevia AI - Intelligent Job Application Tracking Platform

A premium AI-powered job application tracking system that transforms your job search journey with intelligent insights at every stage.

## ✨ Features

### Core Job Tracking
- 📊 **Application Dashboard** - Track all job applications in one beautiful interface
- 🎯 **Status Pipeline** - Applied → Interview → Offer → Rejected
- 📝 **Job Details** - Store company, role, location, and job descriptions
- 📈 **Analytics** - Visualize your job search metrics and trends

### 🤖 AI-Powered Intelligence

Aurevia AI generates **status-specific insights** powered by Google Gemini:

#### APPLIED Status
- Resume alignment suggestions
- Key skills to highlight
- Missing keywords analysis
- Shortlisting improvement tips

#### INTERVIEW Status
- Interview preparation checklist
- Expected interview questions
- Company culture research
- Salary expectations & negotiation tips

#### OFFER Status  
- Salary competitiveness analysis
- Pros and cons evaluation
- Negotiation talking points
- Offer evaluation checklist

#### REJECTED Status
- Constructive feedback on why
- Skill gap analysis
- Resume improvement suggestions
- Similar roles to target next

### 🔐 Security & Authentication
- Email/Password authentication with Supabase
- Secure session management
- Personal dashboard per user
- Password reset functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd job-tracker-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start using Aurevia AI.

## 📱 User Interface

### Dashboard
- Main hub for job application management
- Add new applications with one click
- View all applications in list format with statuses
- Quick stats: Applied, Interview, Offers, Total

### Jobs Page
- Detailed job listings with expandable descriptions
- Filter by status
- Desktop and mobile optimized views

### Analytics
- Visual metrics and trends
- Track application success rates
- Timeline insights

### Settings
- User preferences
- Theme customization
- Account management

## 🔧 Technology Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling

### Backend
- **Supabase** - PostgreSQL database + Authentication
- **Google Gemini 2.5 Flash** - AI analysis engine

### Development Tools
- ESLint - Code quality
- PostCSS - CSS processing

## 📚 Documentation

- **[AI Analysis System](./docs/AI_ANALYSIS_SYSTEM.md)** - Complete guide to status-based AI insights
- **[System Documentation](./docs/SystemDocumentation.txt)** - Architecture and detailed specifications
- **[Changelog](../docs/CHANGELOG.md)** - Version history and update logs
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Folder organization

## 🏗️ Project Structure

```
job-tracker-ai/
├── app/                    # Next.js pages and routes
│   ├── api/               # API endpoints
│   │   └── ai/           # AI analysis API
│   ├── dashboard/        # Dashboard pages
│   ├── login/           # Authentication
│   └── signup/
├── components/           # Reusable React components
│   ├── ui/              # Form and UI components
│   ├── shared/          # Shared components
│   └── layout/          # Layout components
├── lib/                 # Utilities and configs
│   ├── gemini.ts       # AI analysis engine
│   ├── supabase.ts     # Database client
│   ├── theme.ts        # Theme configuration
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
├── public/             # Static assets
└── docs/               # Documentation
```

## 🔌 API Endpoints

### AI Analysis
```
POST /api/ai/analyze

Request:
{
  "description": "Job description text",
  "status": "Applied|Interview|Offer|Rejected",
  "role": "Job title (optional)",
  "company": "Company name (optional)"
}

Response:
{
  "result": "AI-generated insights based on status..."
}
```

## 🎨 Customization

### Theme Configuration
Edit `lib/theme.ts` to customize:
- Color schemes (light/dark mode)
- Typography
- Spacing and layout

### AI Prompts
Modify `lib/gemini.ts` to adjust:
- Analysis depth and detail
- Output format and style
- Status-specific prompts

## 🐛 Troubleshooting

### "GEMINI_API_KEY is required"
- Add your Gemini API key to `.env.local`
- Get one from [Google AI Studio](https://aistudio.google.com)

### "supabaseUrl is required"
- Ensure `NEXT_PUBLIC_SUPABASE_URL` is set in `.env.local`
- Get your URL from your Supabase project settings

### AI Analysis not working
- Check that GEMINI_API_KEY has sufficient quota
- Verify job description field is populated
- Check browser console for error details

## 📋 Requirements

- **Database Schema**: Jobs table with columns: id, user_id, company, role, status, location, job_description, created_at
- **Authentication**: Supabase Auth enabled with email/password provider
- **API Keys**: Valid Gemini API key with generateContent endpoint access

## 🆚 Version History

- **v0.2.0** - Status-based AI analysis system
- **v0.1.1** - Job descriptions and enhanced UI
- **v0.1.0** - Initial release with core tracking features

## 🚀 Future Enhancements

- [ ] Interview preparation drills
- [ ] Resume analysis and optimization
- [ ] Salary benchmark integration
- [ ] Multi-language support
- [ ] Export reports and insights
- [ ] Team collaboration features
- [ ] Calendar integration for interview scheduling
- [ ] Follow-up reminders and notifications

## 📞 Support

For issues, feature requests, or questions:
1. Check the [documentation](./docs/)
2. Review the [troubleshooting guide](./docs/AI_ANALYSIS_SYSTEM.md#troubleshooting)
3. Create an issue in the repository

## 📄 License

This project is part of the Aurevia AI suite.

---

**Aurevia AI v0.2.0** - Built with ❤️ for job seekers
