import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/slice/user/user.slice.js';
import { cn } from "@/lib/utils";

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
    <section id="pricing" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Flexible Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of AI-powered design tools. Choose the plan that fits your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className={cn(
                "relative h-full flex flex-col transition-all duration-300 hover:shadow-xl bg-black",
                plan.popular 
                  ? "border-primary shadow-lg" 
                  : "hover:border-primary/50"
              )}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-6">
                    <span className="text-5xl font-bold bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-lg">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3 text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: featureIndex * 0.05 }}
                        className="flex items-start"
                      >
                        <div className="shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5">
                          <Check className="h-3.5 w-3.5 text-green-500" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-foreground ml-3">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className="w-full font-semibold"
                    variant={plan.buttonVariant}
                    size="lg"
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            All plans include a 30-day money-back guarantee. No setup fees, cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;