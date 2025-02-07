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
    title: "État d'Humeur Actuel",
    description: "Comprendre votre état émotionnel actuel",
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
    title: "Routine Quotidienne et Engagement",
    description: "Parlez-nous de vos activités quotidiennes et de vos niveaux d'énergie",
    fields: ["typicalDay", "pastActivities", "activityFrequency", "peakEnergyMoments"]
  },
  {
    title: "Valeurs et Motivations",
    description: "Aidez-nous à comprendre ce qui compte pour vous",
    fields: ["personalInterests", "motivatorsGoals", "positiveExperience"]
  },
  {
    title: "Défis et Obstacles",
    description: "Identifions ce qui vous retient",
    fields: ["obstacles", "environmentalBarriers", "barrierDetails"]
  },
  {
    title: "Soutien et Ressources",
    description: "Parlez-nous de votre réseau de soutien",
    fields: ["socialSupport", "communityResources"]
  },
  {
    title: "Objectifs",
    description: "Optionnel: Définissez vos objectifs ou laissez l'IA vous guider",
    fields: ["objectives", "shortTermGoal"]
  }
];

const depressionSymptoms = [
  { id: "depressedMood", label: "Humeur dépressive la majeure partie de la journée" },
  { id: "lossOfInterest", label: "Diminution marquée de l'intérêt ou du plaisir" },
  { id: "weightChanges", label: "Changements significatifs de poids ou d'appétit" },
  { id: "sleepDisturbance", label: "Insomnie ou hypersomnie" },
  { id: "psychomotorChanges", label: "Agitation ou ralentissement psychomoteur" },
  { id: "fatigueLossOfEnergy", label: "Fatigue ou perte d'énergie" },
  { id: "worthlessnessGuilt", label: "Sentiments de dévalorisation ou de culpabilité excessive" },
  { id: "concentrationDifficulty", label: "Diminution de l'aptitude à penser ou à se concentrer" }
];

export function MultiStepForm({ form }: { form: UseFormReturn<any> }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);

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
                    ? "Comment évaluez-vous votre humeur actuelle?"
                    : "Comment évaluez-vous votre humeur générale au cours de la semaine dernière?"}
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
                      <span>Très basse (1)</span>
                      <span>Très bonne (10)</span>
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
                    Votre humeur varie-t-elle considérablement tout au long de la journée ?
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
                <FormLabel>Fréquence d'Activité</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la fréquence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0 jours">0 jours</SelectItem>
                    <SelectItem value="1-2 jours">1-2 jours</SelectItem>
                    <SelectItem value="3-4 jours">3-4 jours</SelectItem>
                    <SelectItem value="5+ jours">5+ jours</SelectItem>
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
                <FormLabel>Objectifs (Optionnel)</FormLabel>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez définir jusqu'à trois objectifs, ou passer cette section et laisser l'IA vous guider.
                  </p>
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <FormControl key={i}>
                        <Input
                          placeholder={`Objectif ${i + 1} (optionnel)`}
                          value={Array.isArray(field.value) && field.value[i] ? field.value[i] : ""}
                          onChange={(e) => {
                            const newObjectives = Array.isArray(field.value) ? [...field.value] : [];
                            if (e.target.value.trim()) {
                              newObjectives[i] = e.target.value.trim();
                            } else {
                              delete newObjectives[i];
                            }
                            field.onChange(newObjectives.filter(Boolean));
                            setIsValid(currentStep < sections.length - 1 || newObjectives.length > 0);
                          }}
                        />
                      </FormControl>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        const getQuestion = (fieldName: string) => {
          switch (fieldName) {
            case "typicalDay":
              return "Pouvez-vous décrire une journée typique pour vous? Veuillez inclure votre heure de réveil, les repas, le travail ou les responsabilités quotidiennes et les activités de loisirs.";
            case "pastActivities":
              return "Quelles activités ou loisirs aimiez-vous dans le passé et qui vous manquent actuellement?";
            case "peakEnergyMoments":
              return "Y a-t-il des moments particuliers de la journée où vous vous sentez plus motivé(e) ou avez plus d'énergie? Décrivez-les.";
            case "personalInterests":
              return "Quelles activités, rôles ou loisirs considérez-vous comme les plus significatifs ou importants dans votre vie?";
            case "motivatorsGoals":
              return "Pouvez-vous partager des valeurs personnelles ou des objectifs à long terme qui vous inspirent ou vers lesquels vous aimeriez travailler?";
            case "positiveExperience":
              return "Pensez à un moment récent où vous vous êtes senti(e) même un peu positif(ve) ou satisfait(e). Que faisiez-vous et qu'est-ce qui rendait cette expérience gratifiante?";
            case "obstacles":
              return "Quels défis ou obstacles vous empêchent actuellement de vous engager dans les activités que vous appréciez?";
            case "environmentalBarriers":
              return "Y a-t-il des aspects spécifiques de votre routine quotidienne ou de votre environnement qui rendent difficile d'être actif(ve)?";
            case "socialSupport":
              return "Sur qui comptez-vous pour du soutien dans votre vie quotidienne et comment vous aident-ils?";
            case "communityResources":
              return "Y a-t-il des ressources communautaires, des groupes ou des services auxquels vous avez accès qui pourraient vous aider à devenir plus actif(ve)?";
            case "shortTermGoal":
              return "Que souhaitez-vous accomplir dans les deux prochaines semaines en termes d'augmentation d'activité ou d'amélioration de votre humeur? Soyez aussi précis que possible.";
            default:
              return fieldName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
          }
        };

        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{getQuestion(name)}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
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
          <Card className="border-none shadow-lg">
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
          Précédent
        </Button>
        {currentStep === sections.length - 1 ? (
          <Button type="submit" disabled={!isValid}>
            Générer le Plan
          </Button>
        ) : (
          <Button type="button" onClick={nextStep}>
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
}