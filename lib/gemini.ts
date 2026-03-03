// lib/gemini.ts

export async function generateJobAnalysis(description: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
  }

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
                text: `You are an expert career strategist. Analyze this job and provide a CONCISE summary.

Use clear ALL CAPS headers. Keep it simple and direct without any markdown symbols.

OVERVIEW
In 1-2 sentences, describe the role.

KEY TECHNICAL SKILLS
List the most essential skills.

WHY THIS ROLE MATTERS
Brief career value explanation.

MAIN CHALLENGES
List 2-3 significant challenges.

INTERVIEW FOCUS AREAS
List 3-4 topics to prepare for.

CRITICAL QUESTIONS
List 3-4 likely interview questions.

DUE DILIGENCE
List 2-3 important factors to verify.

Keep under 400 words. Be practical and direct.

Job Description:
${description}`,
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