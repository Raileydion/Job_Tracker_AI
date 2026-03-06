# AI Analysis System - Aurevia AI

## Overview

The AI Analysis System is a core feature of Aurevia AI v0.2.0 that generates intelligent, job-status-specific insights to help users navigate their job search journey. The system leverages Google's Gemini 2.5 Flash API to provide contextual advice based on where users are in the application timeline.

## Architecture

### Components

1. **lib/gemini.ts** - Core AI prompt generation and API communication
2. **app/api/ai/analyze/route.ts** - API endpoint for analysis requests
3. **app/dashboard/page.tsx** - UI integration for triggering analysis

### Data Flow

```
User clicks "Analyze" on job card
    ↓
handleAnalyze() sends job details (description, status, role, company)
    ↓
/api/ai/analyze receives request
    ↓
generateJobAnalysis() creates status-specific prompt
    ↓
Gemini API generates contextual insights
    ↓
Results displayed to user in modal
```

## Status-Based Analysis Modes

### 1. APPLIED Status

**Purpose**: Improve chances of getting an interview

**AI Insights Include**:
- Overview of the role
- Key required skills (4-5 technical skills)
- Skills to highlight in your application
- Missing keywords to mention
- Resume alignment tips (3 specific ways to tailor)
- Shortlisting factors (top 3 things hiring managers look for)
- Action items (3 concrete steps to improve chances)

**Example Use Case**: User just applied for a Senior React Developer role. AI analyzes the job description and suggests specific React patterns they should highlight in their resume and recommends mentioning their experience with performance optimization if relevant.

---

### 2. INTERVIEW Status

**Purpose**: Help users prepare for the interview

**AI Insights Include**:
- Role overview and what interviewers care about
- Interview preparation checklist (5-7 key topics)
- Expected questions (4-5 likely interview questions)
- Suggested answer framework
- Key topics to review (3-4 technical/industry topics)
- Company culture insights
- Salary expectations and negotiation tips
- Final preparation tips

**Example Use Case**: User has an interview scheduled for a Product Manager role at a startup. AI provides 5 likely behavioral questions, suggests what to research about the company's product strategy, and recommends salary research insights for that role level.

---

### 3. OFFER Status

**Purpose**: Help users evaluate and negotiate offers

**AI Insights Include**:
- Offer analysis summary
- Salary competitiveness assessment
- Pros of the offer (4-5 positive aspects)
- Cons and risks (3-4 potential drawbacks)
- Negotiation opportunities (2-3 negotiable areas)
- Negotiation tips and best practices
- Things to verify before accepting (5-6 important questions)
- Comparison factors (for multiple offers)
- Decision framework (3-4 personal factors to consider)

**Example Use Case**: User receives a job offer with $150K salary + equity. AI provides market comparison for that role/location, suggests negotiation talking points (remote flexibility, professional development budget), and helps them think through career growth potential.

---

### 4. REJECTED Status

**Purpose**: Provide constructive feedback for future opportunities

**AI Insights Include**:
- Acknowledgment that rejection doesn't mean lack of qualification
- Likely reasons for rejection (3-4 possibilities based on job description)
- Skill gaps to address
- Resume improvement opportunities (2-3 specific suggestions)
- Interview preparation areas to improve
- Similar roles to target
- Positive takeaways (why rejection might be good)
- Next steps and action items

**Example Use Case**: User was rejected for a Data Science role at a fintech company. AI suggests the role required specific ML ops experience they haven't highlighted, recommends 3 ways to strengthen their portfolio projects, and points them toward similar roles in healthtech where their current skills are more aligned.

---

## API Endpoint

### POST `/api/ai/analyze`

**Request Body**:
```json
{
  "description": "Full job description text",
  "status": "Applied|Interview|Offer|Rejected",
  "role": "Job title (optional)",
  "company": "Company name (optional)"
}
```

**Response**:
```json
{
  "result": "Generated AI analysis with status-specific insights..."
}
```

**Error Responses**:
- 400: No description provided or invalid status
- 500: AI API failure or missing GEMINI_API_KEY

---

## Configuration

### Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Gemini API Settings

- **Model**: gemini-2.5-flash (fast, cost-effective)
- **Max Output**: ~500 words per analysis
- **Rate Limits**: Follow Google's standard rate limits

---

## Usage Examples

### Example 1: Applied Status

```typescript
const job = {
  id: "123",
  company: "Microsoft",
  role: "Senior Full-Stack Engineer",
  status: "Applied",
  job_description: "We're looking for...",
  created_at: "2025-03-06"
};

// User clicks "Analyze" button
// System sends analysis request with status="Applied"
// Receives suggestions like: "Highlight your experience with distributed systems"
```

### Example 2: Interview Status

```typescript
const job = {
  id: "456",
  company: "Google",
  role: "Product Manager",
  status: "Interview",
  job_description: "Lead cross-functional teams...",
  created_at: "2025-02-15"
};

// User clicks "Analyze" button
// System sends analysis request with status="Interview"
// Receives: interview questions, preparation checklist, company culture insights
```

### Example 3: Offer Status

```typescript
const job = {
  id: "789",
  company: "Meta",
  role: "Engineering Manager",
  status: "Offer",
  job_description: "Manage teams of...",
  created_at: "2025-01-20"
};

// User clicks "Analyze" button
// System sends analysis request with status="Offer"
// Receives: salary analysis, negotiation tips, decision framework
```

---

## Implementation Details

### Prompt Engineering

Each status has a carefully crafted prompt template that:

1. **Provides Context**: Explains the user's current situation
2. **Defines Purpose**: Clearly states what the AI should help with
3. **Specifies Format**: Uses ALL CAPS headers for consistency
4. **Sets Constraints**: Keeps responses under 500 words
5. **Includes Job Details**: Uses role, company, and description for personalization

### Error Handling

The system includes robust error handling:

- Validates status against allowed values
- Checks for missing job description
- Gracefully handles Gemini API failures
- Logs errors for debugging
- Returns user-friendly error messages

---

## Future Enhancements

### Planned Features

1. **Multi-Language Support**: Generate insights in different languages
2. **Comparison Mode**: "Compare vs. other offers" analysis
3. **Salary Benchmarking**: Integration with salary data APIs
4. **Interview Drills**: Generate practice questions with AI feedback
5. **Document Analysis**: Parse resume and provide targeted recommendations
6. **Conversation Mode**: Back-and-forth dialogue for deeper insights
7. **Notification Reminders**: Smart reminders when status changes

### Technical Improvements

- Cache frequently used prompts
- Implement rate limiting per user
- Add analysis history tracking
- A/B test different prompt variations
- Implement streaming for faster UI response

---

## Troubleshooting

### Common Issues

**Issue**: "GEMINI_API_KEY is required"
- **Solution**: Add your Gemini API key to `.env.local`

**Issue**: "Invalid status"
- **Solution**: Ensure status is one of: Applied, Interview, Offer, Rejected

**Issue**: "No response generated"
- **Solution**: Check Gemini API quotas and billing

**Issue**: Long response times
- **Solution**: Using gemini-2.5-flash is optimized for speed; check API rate limits

---

## Database Schema

The analysis system works with your existing Jobs table:

```typescript
type Job = {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  location?: string;
  job_description?: string;
  created_at?: string;
};
```

No additional database changes required. Analysis is stateless and generated on-demand.

---

## Security & Privacy

- ✅ Job descriptions are only sent to Gemini API, not stored anywhere
- ✅ Analysis results are not persisted unless user manually saves them
- ✅ No user data is cached by the AI system
- ✅ All requests require authentication (via dashboard)

---

## Version History

### v0.2.0 (Current)
- Initial implementation of status-based AI analysis
- Support for 4 job statuses (Applied, Interview, Offer, Rejected)
- Gemini 2.5 Flash integration
- Dashboard UI integration

---

## Contact & Support

For issues or feature requests related to the AI analysis system, please create an issue in the repository.

---

*Last Updated: March 6, 2025*
