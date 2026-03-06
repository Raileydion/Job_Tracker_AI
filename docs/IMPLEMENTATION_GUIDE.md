# Status-Based AI Analysis Implementation Guide

## Overview

This document provides a detailed technical overview of how the status-based AI analysis system works in Aurevia AI v0.2.0.

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  User Dashboard                          │
│  (app/dashboard/page.tsx)                               │
│  ├─ Displays jobs with statuses                         │
│  └─ "Analyze" button on each job card                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ handleAnalyze(job)
                 │ Collects: description, status, role, company
                 ↓
┌─────────────────────────────────────────────────────────┐
│         API Endpoint                                     │
│  POST /api/ai/analyze/route.ts                          │
│  ├─ Validates request body                              │
│  ├─ Validates status against allowed values             │
│  └─ Calls generateJobAnalysis()                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ generateJobAnalysis(description, status, role, company)
                 ↓
┌─────────────────────────────────────────────────────────┐
│         AI Prompt Generation                             │
│  lib/gemini.ts                                          │
│  ├─ getStatusSpecificPrompt(status)                     │
│  └─ Returns customized prompt template                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Prompt + Job Description
                 ↓
┌─────────────────────────────────────────────────────────┐
│      Google Gemini 2.5 Flash API                        │
│  generativelanguage.googleapis.com                      │
│  ├─ Generates contextual insights                       │
│  └─ Returns formatted analysis                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Analysis text
                 ↓
┌─────────────────────────────────────────────────────────┐
│         Response Handler                                 │
│  /api/ai/analyze/route.ts                              │
│  └─ Returns { result: "analysis..." }                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ JSON response
                 ↓
┌─────────────────────────────────────────────────────────┐
│      Dashboard Display                                   │
│  app/dashboard/page.tsx                                 │
│  ├─ setAiResult(data.result)                            │
│  └─ Display in modal/panel                              │
└─────────────────────────────────────────────────────────┘
```

## Code Flow Example

### 1. User Interaction

User clicks "Analyze" button on a job card with status="Interview":

```typescript
// In Dashboard component
const job = {
  id: "job123",
  company: "Google",
  role: "Product Manager",
  status: "Interview",
  job_description: "Lead cross-functional product teams...",
  created_at: "2025-02-15"
};

handleAnalyze(job); // Called on button click
```

### 2. Request Sent to API

```typescript
// In handleAnalyze function
const res = await fetch("/api/ai/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    description: job.job_description,
    status: job.status,           // "Interview"
    role: job.role,                // "Product Manager"
    company: job.company           // "Google"
  }),
});
```

### 3. API Processes Request

```typescript
// In /api/ai/analyze/route.ts
export async function POST(req: Request) {
  const { description, status = "Applied", role, company } = await req.json();
  
  // Validate status
  if (!["Applied", "Interview", "Offer", "Rejected"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }
  
  // Call AI function
  const result = await generateJobAnalysis(description, status, role, company);
  
  return Response.json({ result });
}
```

### 4. Status-Specific Prompt Generated

```typescript
// In lib/gemini.ts
function getStatusSpecificPrompt(status: JobStatus, description: string, role?: string, company?: string): string {
  
  // For Interview status:
  if (status === "Interview") {
    return `
You are an expert career strategist...

ROLE OVERVIEW
...

INTERVIEW PREPARATION CHECKLIST
5-7 key topics to research...

EXPECTED QUESTIONS
List 4-5 likely interview questions...

... [rest of Interview-specific prompt]
`;
  }
}
```

### 5. Gemini API Called

```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt // Status-specific prompt with job description
            }
          ]
        }
      ]
    })
  }
);
```

### 6. Response Returned to Dashboard

```json
{
  "result": "ROLE OVERVIEW\nProduct Manager at Google, leading feature development across multiple platforms...\n\nINTERVIEW PREPARATION CHECKLIST\n1. Research Google's product strategy...\n2. Review recent product launches...\n..."
}
```

### 7. Dashboard Displays Results

```typescript
setAiResult(data.result);
// Modal or panel now displays the AI insights
```

## Status-Specific Prompt Details

### APPLIED Status Prompt Template

**Purpose**: Get the job after initial application

```
Key Sections Generated:
├─ OVERVIEW (what the role involves)
├─ KEY REQUIRED SKILLS (4-5 most critical)
├─ SKILLS TO HIGHLIGHT (what to emphasize)
├─ MISSING KEYWORDS (what to mention specially)
├─ RESUME ALIGNMENT TIPS (3 specific ways)
├─ SHORTLISTING FACTORS (top 3 things managers look for)
└─ ACTION ITEMS (3 concrete steps)
```

**Example Output**:
```
SKILLS TO HIGHLIGHT
- Cloud architecture experience, especially with AWS or GCP
- Microservices design patterns
- Team leadership and mentoring

MISSING KEYWORDS
The JD emphasizes "DevOps culture" multiple times but doesn't use "CI/CD" 
explicitly. Make sure to mention your continuous integration and deployment 
automation experience.

RESUME ALIGNMENT TIPS
1. Reorder your work experience bullets to lead with "architect" outcomes
2. Add metrics: "Reduced deployment time by 60%"
3. Include specific tools: Kubernetes, Docker, Terraform
```

### INTERVIEW Status Prompt Template

**Purpose**: Excel in the interview

```
Key Sections Generated:
├─ ROLE OVERVIEW
├─ INTERVIEW PREPARATION CHECKLIST (5-7 topics)
├─ EXPECTED QUESTIONS (4-5 likely questions)
├─ SUGGESTED ANSWER FRAMEWORK
├─ KEY TOPICS TO REVIEW (3-4 topics)
├─ COMPANY CULTURE INSIGHTS
├─ SALARY EXPECTATIONS
└─ FINAL TIPS
```

**Example Output**:
```
EXPECTED QUESTIONS
1. "Tell me about a time you designed a system at scale"
   Framework: Situation → Method → Result → Learning
   
2. "How would you approach reducing system latency?"
   Framework: Ask clarifying questions → Present options → Recommend solution
   
3. "Describe your experience with cloud migrations"
   Framework: Scenario → Challenges → Solutions → Outcome

KEY TOPICS TO REVIEW
1. Distributed systems fundamentals (consensus, CAP theorem)
2. Cloud platform specifics (AWS/GCP services mentioned in JD)
3. Performance optimization techniques
4. Team collaboration and communication
```

### OFFER Status Prompt Template

**Purpose**: Make an informed decision

```
Key Sections Generated:
├─ OFFER ANALYSIS
├─ SALARY COMPETITIVENESS
├─ PROS OF THIS OFFER (4-5 positive aspects)
├─ CONS & RISKS (3-4 drawbacks)
├─ NEGOTIATION OPPORTUNITIES (2-3 areas)
├─ NEGOTIATION TIPS
├─ THINGS TO VERIFY (5-6 questions)
└─ DECISION FRAMEWORK (3-4 personal factors)
```

**Example Output**:
```
NEGOTIATION OPPORTUNITIES
1. Base salary: Market rate for this role in SF is $180-220K, your offer is $175K
2. Equity: Negotiate vesting schedule or grant refresh
3. Remote flexibility: 3 days in office vs. 5 mentioned in offer

NEGOTIATION TIPS
- Frame as "opportunity alignment" not complaint
- Provide market data (Glassdoor, Levels.fyi)
- Negotiate one item at a time
- Get everything in writing

THINGS TO VERIFY
1. What is the actual vesting schedule? (4 years with 1 year cliff standard)
2. Is there an annual performance bonus? (% of base)
3. Are there signing bonuses available?
4. What's the promotion track? (Senior → Staff → Principal)
5. Budget for professional development/conferences?
6. Health insurance coverage details and costs?
```

### REJECTED Status Prompt Template

**Purpose**: Learn and improve

```
Key Sections Generated:
├─ ACKNOWLEDGMENT
├─ LIKELY REASONS FOR REJECTION (3-4 possibilities)
├─ SKILL GAPS TO ADDRESS
├─ RESUME IMPROVEMENT OPPORTUNITIES (2-3 suggestions)
├─ INTERVIEW PREPARATION AREAS
├─ SIMILAR ROLES TO TARGET
├─ POSITIVE TAKEAWAYS
└─ NEXT STEPS (action items)
```

**Example Output**:
```
LIKELY REASONS FOR REJECTION
1. Experience Gap: Role required 5+ years, you have 3
   → Consider: Senior IC roles at smaller companies
   
2. Technical Depth: JD emphasized specific ML framework you're weak in
   → Consider: 2-3 month focused learning project
   
3. Interview Performance: You may not have communicated experience clearly
   → Consider: Practice system design interviews

RESUME IMPROVEMENT OPPORTUNITIES
1. Quantify impact: "Improved model accuracy by 7%" vs. "improved model"
2. Add business context: "Reduced customer churn by 3% = $2M revenue"
3. Highlight relevant frameworks: Mention specific tools used

NEXT STEPS
1. Take a targeted course in [weak area identified]
2. Build a portfolio project using the tools you need to learn
3. Apply to 5 similar roles with updated resume
4. Do 5 mock interviews using this role's question types
```

## Error Handling

### Request Validation

```typescript
// In /api/ai/analyze/route.ts

// 1. Check description exists
if (!description) {
  return Response.json(
    { error: "No description provided" },
    { status: 400 }
  );
}

// 2. Validate status is one of allowed values
const validStatuses = ["Applied", "Interview", "Offer", "Rejected"];
if (!validStatuses.includes(status)) {
  return Response.json(
    { error: "Invalid status" },
    { status: 400 }
  );
}

// 3. Handle API failures
try {
  const result = await generateJobAnalysis(description, status, role, company);
  return Response.json({ result });
} catch (error) {
  console.error("AI ERROR:", error);
  return Response.json(
    { error: error?.message || "AI crashed" },
    { status: 500 }
  );
}
```

### Client-Side Error Handling

```typescript
// In dashboard handleAnalyze function
try {
  const res = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, status, role, company }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert("AI failed: " + data.error);
    return;
  }

  setAiResult(data.result);
} catch {
  alert("Network error. Please try again.");
} finally {
  setAiLoadingId(null);
}
```

## Performance Optimization

### Current Implementation
- Uses Gemini 2.5 Flash: Fast (6-8 seconds), cost-effective
- No caching: Fresh analysis for each request
- No streaming: Full response waits before display

### Future Optimizations
1. **Caching**: Cache similar job analyses
2. **Streaming**: Send response chunks as they arrive
3. **Prompt Compression**: Shorten prompts while maintaining quality
4. **Batch Requests**: Multiple analyses in one API call
5. **Rate Limiting**: Prevent abuse and stay within quotas

## Testing

### Test Status-Specific Analysis

```bash
# Test APPLIED status
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Senior React Developer...",
    "status": "Applied",
    "role": "Senior React Developer",
    "company": "TechCorp"
  }'

# Test INTERVIEW status
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Senior React Developer...",
    "status": "Interview",
    "role": "Senior React Developer",
    "company": "TechCorp"
  }'

# Test error: invalid status
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Job description",
    "status": "Unknown"
  }'
# Returns: { "error": "Invalid status" }
```

## Database Integration

The system currently requires no database changes. Job data is read from Supabase:

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

### Future: Analysis History

To save analysis history, add table:

```sql
CREATE TABLE job_analyses (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  status VARCHAR(50),
  analysis TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Monitoring & Analytics

### Key Metrics to Track

1. **API Performance**
   - Average response time per status
   - Error rates
   - API quota usage

2. **User Behavior**
   - Analysis requests per status
   - Most common question patterns
   - Feature usage frequency

3. **Quality Metrics**
   - User satisfaction with insights
   - Conversion (analysis → action)
   - Time to decision after analysis

### Logging Best Practices

```typescript
// Log status-specific usage
console.log({
  timestamp: new Date(),
  status: status,
  jobId: job.id,
  responseTime: endTime - startTime,
  success: true
});
```

---

*Last Updated: March 6, 2025*
*For questions or contributions, see the main README.md*
