"use client";

import { Check, CreditCard, MapPin, ShoppingBag } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { number: 1, label: "Shipping Address", icon: MapPin },
    { number: 2, label: "Order Review", icon: ShoppingBag },
    { number: 3, label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Step Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const Icon = step.icon;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm transition-all ${
                  isCompleted
                    ? "bg-primary text-white shadow-sm"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/20 shadow-md"
                    : "bg-surface-card border-2 border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`mt-2 text-xs font-bold text-center ${
                  isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
