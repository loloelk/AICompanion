import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "./button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select";
import { Slider } from "./slider";
import { Card, CardContent } from "./card";
import { Checkbox } from "./checkbox";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "Mood Assessment",
    description: "Let's understand your current emotional state",
    fields: [
      "currentMood",
      "lastWeekMood",
      "moodVariability",
      "depressedMood",
      "lossOfInterest",
      "weightChanges",
      "sleepDisturbance",
      "psychomotorChanges",
      "fatigueLossOfEnergy",
      "worthlessnessGuilt",
      "concentrationDifficulty"
    ]
  },
  {
    title: "Daily Routine and Activity",
    description: "Tell us about your daily activities and energy levels",
    fields: ["typicalDay", "pastActivities", "activityFrequency", "peakEnergyMoments"]
  },
  {
    title: "Personal Values",
    description: "Help us understand what matters to you",
    fields: ["personalInterests", "motivatorsGoals", "positiveExperience"]
  },
  {
    title: "Challenges",
    description: "Let's identify what's holding you back",
    fields: ["obstacles", "environmentalBarriers", "barrierDetails"]
  },
  {
    title: "Support System",
    description: "Tell us about your support network",
    fields: ["socialSupport", "communityResources"]
  },
  {
    title: "Goals",
    description: "Optional: Set your objectives or let AI help guide you",
    fields: ["objectives", "shortTermGoal"]
  }
];

const depressionSymptoms = [
  { id: "depressedMood", label: "Depressed mood most of the day, nearly every day" },
  { id: "lossOfInterest", label: "Markedly diminished interest or pleasure in activities" },
  { id: "weightChanges", label: "Significant weight loss/gain or appetite changes" },
  { id: "sleepDisturbance", label: "Insomnia or hypersomnia" },
  { id: "psychomotorChanges", label: "Psychomotor agitation or retardation" },
  { id: "fatigueLossOfEnergy", label: "Fatigue or loss of energy" },
  { id: "worthlessnessGuilt", label: "Feelings of worthlessness or excessive guilt" },
  { id: "concentrationDifficulty", label: "Diminished ability to think or concentrate" }
];

export function MultiStepForm({ form }: { form: UseFormReturn<any> }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, sections.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderField = (name: string) => {
    switch (name) {
      case "currentMood":
      case "lastWeekMood":
        const isCurrentMood = name === "currentMood";
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isCurrentMood
                    ? "How would you rate your current mood?"
                    : "How would you rate your overall mood over the past week?"}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={10}
                      min={1}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Very low (1)</span>
                      <span>Very good (10)</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "moodVariability":
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Does your mood vary significantly throughout the day?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        );

      case "depressedMood":
      case "lossOfInterest":
      case "weightChanges":
      case "sleepDisturbance":
      case "psychomotorChanges":
      case "fatigueLossOfEnergy":
      case "worthlessnessGuilt":
      case "concentrationDifficulty":
        const symptom = depressionSymptoms.find((s) => s.id === name);
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{symptom?.label}</FormLabel>
                </div>
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

      case "objectives":
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objectives (Optional)</FormLabel>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    You can set up to three objectives, or skip this section and let AI help guide you.
                  </p>
                  {[0, 1, 2].map((i) => (
                    <Input
                      key={i}
                      placeholder={`Objective ${i + 1} (optional)`}
                      value={field.value[i] || ""}
                      onChange={(e) => {
                        const newObjectives = [...field.value];
                        newObjectives[i] = e.target.value;
                        field.onChange(newObjectives.filter(Boolean));
                      }}
                    />
                  ))}
                </div>
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
                  <Textarea {...field} />
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
              <h2 className="text-xl font-semibold mb-2">{sections[currentStep].title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{sections[currentStep].description}</p>
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