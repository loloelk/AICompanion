import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const baSurveys = pgTable("ba_surveys", {
  id: serial("id").primaryKey(),
  currentMood: integer("current_mood").notNull(),
  moodDescription: text("mood_description"),
  dailyEnergyMood: text("daily_energy_mood"),
  moodPatternTime: text("mood_pattern_time"),
  moodPatternDescription: text("mood_pattern_description"),
  typicalDay: text("typical_day"),
  pastActivities: text("past_activities"),
  activityFrequency: text("activity_frequency"),
  peakEnergyMoments: text("peak_energy_moments"),
  personalInterests: text("personal_interests"),
  motivatorsGoals: text("motivators_goals"),
  positiveExperience: text("positive_experience"),
  obstacles: text("obstacles"),
  environmentalBarriers: text("environmental_barriers"),
  barrierDetails: text("barrier_details"),
  socialSupport: text("social_support"),
  communityResources: text("community_resources"),
  objectives: json("objectives").array(),
  shortTermGoal: text("short_term_goal"),
  generatedPlan: json("generated_plan")
});

export const insertBaSurveySchema = createInsertSchema(baSurveys).omit({
  id: true,
  generatedPlan: true
});

export type InsertBaSurvey = z.infer<typeof insertBaSurveySchema>;
export type BaSurvey = typeof baSurveys.$inferSelect;
