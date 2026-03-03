import { generateJobAnalysis } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return Response.json(
        { error: "No description provided" },
        { status: 400 }
      );
    }

    const result = await generateJobAnalysis(description);

    return Response.json({ result });

  } catch (error: any) {
    console.error("AI ERROR FULL:", error); // 🔥 THIS IS IMPORTANT
    return Response.json(
      { error: error?.message || "AI crashed" },
      { status: 500 }
    );
  }
}