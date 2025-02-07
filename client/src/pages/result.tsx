import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PrintButton } from "@/components/ui/print-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { BaSurvey } from "@shared/schema";

export default function ResultPage() {
  const { id } = useParams();
  const { data: survey, isLoading, error } = useQuery<BaSurvey>({
    queryKey: [`/api/survey/${id}`],
  });

  if (isLoading) {
    return <Skeleton className="w-full h-screen" />;
  }

  if (error || !survey || !survey.generatedPlan) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive" className="max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load the survey. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const plan = survey.generatedPlan;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Behavioral Activation Plan</h1>
            <PrintButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Summary</h2>
              <p>{plan.summary}</p>
            </section>

            {plan.objectives?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Objectives</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.objectives.map((obj, index) => (
                    <li key={index}>{String(obj)}</li>
                  ))}
                </ul>
              </section>
            )}

            {plan.smartGoals?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">SMART Goals</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.smartGoals.map((goal, index) => (
                    <li key={index}>{String(goal)}</li>
                  ))}
                </ul>
              </section>
            )}

            {plan.actionSteps?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Action Steps</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.actionSteps.map((step, index) => (
                    <li key={index}>{String(step)}</li>
                  ))}
                </ul>
              </section>
            )}

            {plan.reminders?.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Reminders</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.reminders.map((reminder, index) => (
                    <li key={index}>{String(reminder)}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}