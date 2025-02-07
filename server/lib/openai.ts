import OpenAI from "openai";
import type { BaSurvey } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateBaPlan(survey: BaSurvey) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert in Behavioral Activation therapy. Generate a personalized plan based on the user's survey responses. 
          Format your response as a JSON object with these arrays:
          {
            "summary": "string",
            "objectives": ["string", "string", ...],
            "smartGoals": ["string", "string", ...],
            "actionSteps": ["string", "string", ...],
            "reminders": ["string", "string", ...]
          }`
        },
        {
          role: "user",
          content: JSON.stringify(survey)
        }
      ],
      response_format: { type: "json_object" }
    });

    // Handle potential null content
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate plan: Empty response from AI");
    }

    const parsedContent = JSON.parse(content);

    // Ensure each field is an array
    const plan = {
      summary: parsedContent.summary || "",
      objectives: Array.isArray(parsedContent.objectives) ? parsedContent.objectives : Object.values(parsedContent.objectives || {}),
      smartGoals: Array.isArray(parsedContent.smartGoals) ? parsedContent.smartGoals : Object.values(parsedContent.smartGoals || {}),
      actionSteps: Array.isArray(parsedContent.actionSteps) ? parsedContent.actionSteps : Object.values(parsedContent.actionSteps || {}),
      reminders: Array.isArray(parsedContent.reminders) ? parsedContent.reminders : Object.values(parsedContent.reminders || {})
    };

    return plan;
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate BA plan: ${error.message}`);
  }
}