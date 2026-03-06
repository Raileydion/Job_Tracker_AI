import { generateJobAnalysis } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { description, status = "Applied", role, company } = await req.json();

    if (!description) {
      return Response.json(
        { error: "No description provided" },
        { status: 400 }
      );
    }

    if (!["Applied", "Interview", "Offer", "Rejected"].includes(status)) {
      return Response.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const result = await generateJobAnalysis(description, status, role, company);

    return Response.json({ result });

  } catch (error: any) {
    console.error("AI ERROR FULL:", error);
    return Response.json(
      { error: error?.message || "AI crashed" },
      { status: 500 }
    );
  }
}