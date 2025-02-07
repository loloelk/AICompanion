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
    const [survey] = await db
      .insert(baSurveys)
      .values({ ...insertSurvey, generatedPlan: null })
      .returning();
    return survey;
  }

  async getBaSurvey(id: number): Promise<BaSurvey | undefined> {
    const [survey] = await db
      .select()
      .from(baSurveys)
      .where(eq(baSurveys.id, id));
    return survey;
  }

  async updateBaSurveyPlan(id: number, plan: any): Promise<BaSurvey> {
    const [survey] = await db
      .update(baSurveys)
      .set({ generatedPlan: plan })
      .where(eq(baSurveys.id, id))
      .returning();

    if (!survey) {
      throw new Error("Survey not found");
    }

    return survey;
  }
}

export const storage = new DatabaseStorage();