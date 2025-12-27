
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface OnboardingStep {
  id: number;
  title: string;
  description: string[];
  completed: boolean;
  locked?: boolean;
  dependency?: string;
}

const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: "Schools",
      description: ["Register a school"],
      completed: true,
    },
    {
      id: 2,
      title: "Fleet & Crew",
      description: ["Register a bus", "Register a driver", "Register a minder"],
      completed: true,
    },
    {
      id: 3,
      title: "Parents & Students",
      description: ["Register a parent", "Register a students under the parents"],
      completed: false,
    },
    {
      id: 4,
      title: "Routes & Zones",
      description: ["Register a route", "Register a zone"],
      completed: false,
    },
    {
      id: 5,
      title: "School Terms & Invoicing",
      description: ["Register a school terms"],
      completed: false,
    },
    {
      id: 6,
      title: "School Users",
      description: ["Register a user"],
      completed: false,
    },
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);

  const handleStartStep = (stepId: number) => {
    console.log(`Starting step ${stepId}`);
    
    // Navigate to the appropriate page based on the step ID
    switch (stepId) {
      case 1:
        // Schools page
        navigate("/schools");
        break;
      case 2:
        // Fleet & Crew page
        navigate("/fleet-crew");
        break;
      case 3:
        // Parents & Students page
        navigate("/parents-students");
        break;
      case 4:
        // Routes & Zones page
        navigate("/routes-zones");
        break;
      case 5:
        // Terms & Invoices page
        navigate("/terms-invoices");
        break;
      case 6:
        // Users page
        navigate("/users");
        break;
      default:
        console.error(`No navigation defined for step ${stepId}`);
    }
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl p-6">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-xl font-semibold">
              Getting Started
            </CardTitle>
          </div>
          <span className="text-lg text-gray-500">
            {progressPercentage}% completed
          </span>
        </div>
        <Progress value={progressPercentage} className="mt-4 h-2 bg-blue-100" 
          indicatorClassName="bg-gradient-to-r from-blue-600 to-blue-400" />
      </CardHeader>
      <CardContent className="px-0 py-4">
        <div className="space-y-6 relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-6 top-12 bottom-16 w-0.5 bg-gray-200 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={step.id} className="relative pl-14">
              {/* Step indicator */}
              <div className="absolute left-0 top-0">
                {step.completed ? (
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                ) : step.id === 3 ? (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center relative">
                    <div className="absolute inset-0 w-12 h-12 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500"></div>
                    </div>
                    <Circle className="w-8 h-8 text-blue-500" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Circle className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
              
              {/* Step content and button container with flex layout */}
              <div className="flex justify-between items-start">
                {/* Step content */}
                <div className="space-y-1">
                  <div className={cn(
                    "text-sm font-medium",
                    step.id === 3 ? "text-blue-500" : "text-gray-500"
                  )}>
                    Step {step.id}
                  </div>
                  <h4 className={cn(
                    "text-lg",
                    step.completed ? "line-through text-gray-400" : "font-semibold text-gray-800"
                  )}>
                    {step.title}
                  </h4>
                  <ul className="space-y-1 mt-2">
                    {step.description.map((desc, idx) => (
                      <li key={idx} className="text-gray-500 text-sm flex items-start">
                        <span className="mr-2">•</span> {desc}
                      </li>
                    ))}
                  </ul>
                  {step.dependency && (
                    <p className="text-sm text-gray-500 italic">
                      {step.dependency}
                    </p>
                  )}
                </div>
                
                {/* Start button - only shown for non-completed steps */}
                {!step.completed && (
                  <Button
                    onClick={() => handleStartStep(step.id)}
                    variant="default"
                    size="sm"
                    disabled={step.locked}
                    className={cn(
                      "rounded-full px-6",
                      step.id === 3 
                        ? "bg-blue-500 hover:bg-blue-600 text-white" 
                        : step.locked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    )}
                  >
                    Start
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
