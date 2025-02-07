import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { insertBaSurveySchema } from "@shared/schema";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Card } from "@/components/ui/card";

export default function FormPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertBaSurveySchema),
    defaultValues: {
      currentMood: 5,
      lastWeekMood: 5,
      moodVariability: false,
      depressedMood: false,
      lossOfInterest: false,
      weightChanges: false,
      sleepDisturbance: false,
      psychomotorChanges: false,
      fatigueLossOfEnergy: false,
      worthlessnessGuilt: false,
      concentrationDifficulty: false,
      objectives: [], // Initialize as empty array
      activityFrequency: "0 days",
      // Initialize other text fields as empty strings
      typicalDay: "",
      pastActivities: "",
      peakEnergyMoments: "",
      personalInterests: "",
      motivatorsGoals: "",
      positiveExperience: "",
      obstacles: "",
      environmentalBarriers: "",
      barrierDetails: "",
      socialSupport: "",
      communityResources: "",
      shortTermGoal: ""
    }
  });

  const onSubmit = async (data: any) => {
    try {
      // Ensure objectives is an array
      const formData = {
        ...data,
        objectives: Array.isArray(data.objectives) ? data.objectives : []
      };

      console.log("Submitting form data:", formData);

      const response = await apiRequest("POST", "/api/survey", formData);
      const result = await response.json();
      setLocation(`/result/${result.id}`);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Behavioral Activation Plan</h1>
          <p className="mt-2 text-muted-foreground">
            Let's work together to create a personalized plan to help improve your mood and daily activities.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <MultiStepForm form={form} />
          </form>
        </Form>
      </Card>
    </div>
  );
}