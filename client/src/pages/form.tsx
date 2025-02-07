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
      objectives: [],
      activityFrequency: "0 days"
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiRequest("POST", "/api/survey", data);
      const result = await response.json();
      setLocation(`/result/${result.id}`);
    } catch (error) {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <MultiStepForm form={form} />
          </form>
        </Form>
      </Card>
    </div>
  );
}
