import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/slice/user/user.slice.js';
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

const CallToAction = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-background p-8 md:p-12">
          {/* Grid Pattern Background - Full Coverage */}
          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            className={cn(
              "fill-purple-500/10 stroke-purple-500/10 dark:fill-purple-400/10 dark:stroke-purple-400/10"
            )}
          />
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-teal-500/5 pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Unlock Premium Features?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Get unlimited AI suggestions, access all templates, and more with our Pro plans.
            </p>
            <Button 
              size="lg" 
              className="mt-8 rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate(isAuthenticated ? '/dashboard/payment?plan=pro-monthly' : '/#pricing')}
            >
              {isAuthenticated ? 'Upgrade to Pro' : 'View Pricing Plans'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;