import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/slice/user/user.slice.js';

const PricingSection = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 AI design suggestions per month",
        "Access to 10 basic templates",
        "Basic color palette generation",
        "Community support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Pro Monthly",
      price: "₹299",
      period: "month",
      description: "For serious designers",
      features: [
        "Unlimited AI design suggestions",
        "Access to all premium templates",
        "Advanced color palette generation",
        "Priority support",
        "Export in multiple formats",
        "Custom branding options"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default",
      popular: true
    },
    {
      name: "Pro Yearly",
      price: "₹2999",
      period: "year",
      description: "Best value for professionals",
      features: [
        "Everything in Pro Monthly",
        "2 months free",
        "Advanced analytics",
        "Team collaboration features",
        "API access",
        "Dedicated account manager"
      ],
      buttonText: "Go Yearly",
      buttonVariant: "default",
      popular: false
    }
  ];

  const handlePlanSelect = (planName) => {
    if (planName === "Free") {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } else {
      // For paid plans, redirect to login if not authenticated, then to payment
      if (!isAuthenticated) {
        navigate("/login", { state: { redirectTo: `/dashboard/payment?plan=${planName.toLowerCase().replace(" ", "-")}` } });
      } else {
        navigate(`/dashboard/payment?plan=${planName.toLowerCase().replace(" ", "-")}`);
      }
    }
  };

  return (
    <section className="py-20 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered design tools. Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.buttonVariant}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include a 30-day money-back guarantee. No setup fees, cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;