import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import openai from "@/lib/openai";
import { buildShiftPrompt, ShiftResponseSchema } from "@/lib/prompt";
import { zodResponseFormat } from "openai/helpers/zod";
import { checkRateLimit } from "@/lib/rate-limit";

const ShiftRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  goalId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed)
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ShiftRequestSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Bad request", details: parsed.error.flatten() },
      { status: 400 }
    );

  const { message, goalId } = parsed.data;
  try {
    const completion = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildShiftPrompt(message, goalId) },
        { role: "user", content: "Please rewrite this message now." },
      ],
      response_format: zodResponseFormat(ShiftResponseSchema, "shift_response"),
      temperature: 0.8,
      max_tokens: 1200,
    });
    // console the completion
    console.log(completion);
    const result = completion.choices[0]?.message?.parsed;
    if (!result)
      return NextResponse.json(
        { error: "Model returned no output" },
        { status: 500 }
      );
    return NextResponse.json(result);
  } catch (err) {
    console.error("[shift route]", err);
    return NextResponse.json(
      { error: "AI service error. Please try again." },
      { status: 500 }
    );
  }
}
