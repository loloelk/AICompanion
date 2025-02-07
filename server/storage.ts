import { type BaSurvey, type InsertBaSurvey, baSurveys } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createBaSurvey(survey: InsertBaSurvey): Promise<BaSurvey>;
  getBaSurvey(id: number): Promise<BaSurvey | undefined>;
  updateBaSurveyPlan(id: number, plan: any): Promise<BaSurvey>;
}

export class DatabaseStorage implements IStorage {
  async createBaSurvey(insertSurvey: InsertBaSurvey): Promise<BaSurvey> {
    try {
      const [survey] = await db
        .insert(baSurveys)
        .values({ ...insertSurvey, generatedPlan: null })
        .returning();
      return survey;
    } catch (error: any) {
      console.error("Failed to create survey:", error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async getBaSurvey(id: number): Promise<BaSurvey | undefined> {
    try {
      const [survey] = await db
        .select()
        .from(baSurveys)
        .where(eq(baSurveys.id, id));
      return survey;
    } catch (error: any) {
      console.error("Failed to get survey:", error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async updateBaSurveyPlan(id: number, plan: any): Promise<BaSurvey> {
    try {
      const [survey] = await db
        .update(baSurveys)
        .set({ generatedPlan: plan })
        .where(eq(baSurveys.id, id))
        .returning();

      if (!survey) {
        throw new Error(`Survey with ID ${id} not found`);
      }

      return survey;
    } catch (error: any) {
      console.error("Failed to update survey plan:", error);
      throw new Error(`Failed to update survey plan: ${error.message}`);
    }
  }
}

export const storage = new DatabaseStorage();