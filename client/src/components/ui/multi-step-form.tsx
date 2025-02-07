import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "./button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";
import { Slider } from "./slider";
import { Card, CardContent } from "./card";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "Current Mood and Health",
    fields: ["currentMood", "moodDescription", "dailyEnergyMood", "moodPatternTime", "moodPatternDescription"]
  },
  {
    title: "Daily Routine and Activity Engagement",
    fields: ["typicalDay", "pastActivities", "activityFrequency", "peakEnergyMoments"]
  },
  {
    title: "Interests, Values, and Motivators",
    fields: ["personalInterests", "motivatorsGoals", "positiveExperience"]
  },
  {
    title: "Barriers and Challenges",
    fields: ["obstacles", "environmentalBarriers", "barrierDetails"]
  },
  {
    title: "Support and Resources",
    fields: ["socialSupport", "communityResources"]
  },
  {
    title: "Goals and Future Aspirations",
    fields: ["objectives", "shortTermGoal"]
  }
];

export function MultiStepForm({ form }: { form: UseFormReturn<any> }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, sections.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderField = (name: string) => {
    switch (name) {
      case "currentMood":
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate your overall mood (1-10)</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={10}
                    min={1}
                    step={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "activityFrequency":
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0 days">0 days</SelectItem>
                    <SelectItem value="1-2 days">1-2 days</SelectItem>
                    <SelectItem value="3-4 days">3-4 days</SelectItem>
                    <SelectItem value="5+ days">5+ days</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</FormLabel>
                <FormControl>
                  {name === "objectives" ? (
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <Input
                          key={i}
                          placeholder={`Objective ${i + 1}`}
                          value={field.value[i] || ""}
                          onChange={(e) => {
                            const newObjectives = [...field.value];
                            newObjectives[i] = e.target.value;
                            field.onChange(newObjectives);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Textarea {...field} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full">
          <div
            className="absolute left-0 h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">{sections[currentStep].title}</h2>
              <div className="space-y-4">
                {sections[currentStep].fields.map(renderField)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        {currentStep === sections.length - 1 ? (
          <Button type="submit">Generate Plan</Button>
        ) : (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
