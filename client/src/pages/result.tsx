import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PrintButton } from "@/components/ui/print-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultPage() {
  const { id } = useParams();
  const { data: survey, isLoading } = useQuery({
    queryKey: ["/api/survey", id],
  });

  if (isLoading) {
    return <Skeleton className="w-full h-screen" />;
  }

  if (!survey) {
    return <div>Survey not found</div>;
  }

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
              <p>{survey.generatedPlan.summary}</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Objectives</h2>
              <ul className="list-disc pl-5 space-y-2">
                {survey.generatedPlan.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">SMART Goals</h2>
              <ul className="list-disc pl-5 space-y-2">
                {survey.generatedPlan.smartGoals.map((goal, i) => (
                  <li key={i}>{goal}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Action Steps</h2>
              <ul className="list-disc pl-5 space-y-2">
                {survey.generatedPlan.actionSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Reminders</h2>
              <ul className="list-disc pl-5 space-y-2">
                {survey.generatedPlan.reminders.map((reminder, i) => (
                  <li key={i}>{reminder}</li>
                ))}
              </ul>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
