import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { insertBaSurveySchema } from "@shared/schema";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Card } from "@/components/ui/card";
import { Waves } from "@/components/ui/waves";

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
      objectives: [],
      activityFrequency: "0 jours",
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
      // Validate objectives
      const objectives = Array.isArray(data.objectives) ? data.objectives.filter(Boolean) : [];

      const formData = {
        ...data,
        objectives
      };

      console.log("Submitting form data:", formData);

      const response = await apiRequest("POST", "/api/survey", formData);
      const result = await response.json();
      setLocation(`/result/${result.id}`);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Erreur",
        description: "Échec de la soumission du sondage. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Waves className="absolute inset-0 pointer-events-none" />
      <Card className="max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-sm shadow-lg relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Plan d'Activation Comportementale</h1>
          <p className="mt-2 text-gray-600">
            Travaillons ensemble pour créer un plan personnalisé qui vous aidera à améliorer votre humeur et vos activités quotidiennes.
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