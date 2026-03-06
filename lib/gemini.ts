// lib/gemini.ts

type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected";

function getStatusSpecificPrompt(status: JobStatus, description: string, role?: string, company?: string): string {
  const baseContext = `You are an expert career strategist. Analyze this job and provide CONCISE, actionable insights.

Use clear ALL CAPS headers. Keep it simple and direct without any markdown symbols.
Keep responses under 500 words. Be practical and direct.

Job: ${role ? `${role} at ${company}` : ""}
${description}

---`;

  const prompts: Record<JobStatus, string> = {
    Applied: `${baseContext}

PURPOSE: Help improve chances of getting an interview.

OVERVIEW
In 1-2 sentences, describe the role.

KEY REQUIRED SKILLS
List the 4-5 most critical technical skills needed.

SKILLS TO HIGHLIGHT
Specific skills from the description you should emphasize in your application.

MISSING KEYWORDS
Important keywords or skills not typically highlighted that you should mention.

RESUME ALIGNMENT TIPS
2-3 specific ways to tailor your resume for this role.

SHORTLISTING FACTORS
What are the 3 top things hiring managers look for in applicants?

ACTION ITEMS
3 specific steps to improve your chances.`,

    Interview: `${baseContext}

PURPOSE: Help you prepare for the interview.

ROLE OVERVIEW
1-2 sentences about the position and what interviewers care about.

INTERVIEW PREPARATION CHECKLIST
5-7 key topics to research and prepare for.

EXPECTED QUESTIONS
List 4-5 likely interview questions (both technical and behavioral).

SUGGESTED ANSWER FRAMEWORK
Brief tips on how to structure answers to highlight your fit.

KEY TOPICS TO REVIEW
3-4 specific technical or industry topics to brush up on.

COMPANY CULTURE INSIGHTS
What you should know about the company culture and values based on the job description.

SALARY EXPECTATIONS
Typical salary range for this role (if identifiable from description) and negotiation tips.

FINAL TIPS
2-3 last-minute preparation tips.`,

    Offer: `${baseContext}

PURPOSE: Help you evaluate and compare this offer.

OFFER ANALYSIS
Quick summary of the role and level.

SALARY COMPETITIVENESS
Is this salary competitive? Market comparison insights.

PROS OF THIS OFFER
4-5 positive aspects and benefits of accepting this role.

CONS & RISKS
3-4 potential drawbacks or concerns to think about.

NEGOTIATION OPPORTUNITIES
2-3 specific areas you could negotiate (salary, equity, benefits, flexibility).

NEGOTIATION TIPS
Practical advice on how to approach negotiation respectfully.

THINGS TO VERIFY BEFORE ACCEPTING
5-6 important questions to ask the employer before committing.

COMPARISON FACTORS
Key metrics to compare if you have multiple offers.

DECISION FRAMEWORK
3-4 important personal factors to consider in your decision.`,

    Rejected: `${baseContext}

PURPOSE: Provide constructive feedback to help with future applications.

ABOUT THE REJECTION
Acknowledge this doesn't mean you're not qualified.

LIKELY REASONS FOR REJECTION
Analyze based on the job description and suggest 3-4 possible reasons:
- Skill gaps or experience level mismatch
- Resume clarity or presentation issues
- Interview performance or communication
- Competition from other candidates
- Specific requirements you might not have met

SKILL GAPS TO ADDRESS
If applicable, what technical or soft skills to develop.

RESUME IMPROVEMENT OPPORTUNITIES
2-3 specific ways to strengthen your resume for similar roles.

INTERVIEW PREPARATION AREAS
Where you might improve based on the job level and type.

SIMILAR ROLES TO TARGET
What types of roles or companies might be better alternatives given your experience.

POSITIVE TAKEAWAYS
Why rejection might be a good thing (wrong fit, better opportunities elsewhere).

NEXT STEPS
Concrete action items to improve for the next opportunity.`
  };

  return prompts[status] || prompts.Applied;
}

export async function generateJobAnalysis(
  description: string,
  status: JobStatus = "Applied",
  role?: string,
  company?: string
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
  }

  const prompt = getStatusSpecificPrompt(status, description, role, company);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Error:", errorText);
    throw new Error("Gemini API request failed");
  }

  const data = await response.json();

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
}