import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBaPlan } from "./lib/openai";
import { insertBaSurveySchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/survey", async (req, res) => {
    try {
      const validatedData = insertBaSurveySchema.parse(req.body);
      const survey = await storage.createBaSurvey(validatedData);
      const plan = await generateBaPlan(survey);
      const updatedSurvey = await storage.updateBaSurveyPlan(survey.id, plan);
      res.json(updatedSurvey);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/survey/:id", async (req, res) => {
    try {
      const survey = await storage.getBaSurvey(parseInt(req.params.id));
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      res.json(survey);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
