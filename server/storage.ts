import { type BaSurvey, type InsertBaSurvey } from "@shared/schema";

export interface IStorage {
  createBaSurvey(survey: InsertBaSurvey): Promise<BaSurvey>;
  getBaSurvey(id: number): Promise<BaSurvey | undefined>;
  updateBaSurveyPlan(id: number, plan: any): Promise<BaSurvey>;
}

export class MemStorage implements IStorage {
  private surveys: Map<number, BaSurvey>;
  private currentId: number;

  constructor() {
    this.surveys = new Map();
    this.currentId = 1;
  }

  async createBaSurvey(insertSurvey: InsertBaSurvey): Promise<BaSurvey> {
    const id = this.currentId++;
    const survey: BaSurvey = { ...insertSurvey, id, generatedPlan: null };
    this.surveys.set(id, survey);
    return survey;
  }

  async getBaSurvey(id: number): Promise<BaSurvey | undefined> {
    return this.surveys.get(id);
  }

  async updateBaSurveyPlan(id: number, plan: any): Promise<BaSurvey> {
    const survey = await this.getBaSurvey(id);
    if (!survey) {
      throw new Error("Survey not found");
    }
    const updated = { ...survey, generatedPlan: plan };
    this.surveys.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
