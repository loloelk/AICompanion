import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBaPlan } from "./lib/openai";
import { insertBaSurveySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export function registerRoutes(app: Express): Server {
  app.post("/api/survey", async (req, res) => {
    try {
      console.log("Received survey submission:", req.body);

      // Validate request data
      const validatedData = insertBaSurveySchema.parse(req.body);

      // Create survey first
      console.log("Creating survey...");
      const survey = await storage.createBaSurvey(validatedData);

      if (!survey || !survey.id) {
        throw new Error("Failed to create survey record");
      }

      console.log("Survey created with ID:", survey.id);

      // Generate and update plan
      console.log("Generating BA plan...");
      const plan = await generateBaPlan(survey);

      console.log("Updating survey with generated plan...");
      const updatedSurvey = await storage.updateBaSurveyPlan(survey.id, plan);

      res.json(updatedSurvey);
    } catch (error: any) {
      // If it's a Zod validation error, convert it to a more readable format
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Survey submission error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/survey/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid survey ID" });
      }

      const survey = await storage.getBaSurvey(id);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }

      res.json(survey);
    } catch (error: any) {
      console.error("Survey retrieval error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}