import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from '@/utils/api';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const plan = searchParams.get('plan');

  const planDetails = {
    'pro-monthly': {
      name: 'Pro Monthly',
      price: 299,
      period: 'month',
      features: [
        'Unlimited AI design suggestions',
        'Access to all premium templates',
        'Advanced color palette generation',
        'Priority support',
        'Export in multiple formats',
        'Custom branding options'
      ]
    },
    'pro-yearly': {
      name: 'Pro Yearly',
      price: 2999,
      period: 'year',
      features: [
        'Everything in Pro Monthly',
        '2 months free',
        'Advanced analytics',
        'Team collaboration features',
        'API access',
        'Dedicated account manager'
      ]
    }
  };

  const currentPlan = planDetails[plan];

  useEffect(() => {
    if (!currentPlan) {
      navigate('/dashboard');
    }
  }, [currentPlan, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load');
        setLoading(false);
        return;
      }

      // Create order
      const { data } = await api.post('/api/v1/payment/create-order', {
        amount: currentPlan.price,
        plan: plan.replace('-', '')
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Matty AI',
        description: `${currentPlan.name} Subscription`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/api/v1/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.replace('-', '')
            });

            setPaymentStatus('success');
            toast.success('Payment successful! Subscription activated.');
            setTimeout(() => navigate('/dashboard'), 3000);
          } catch (error) {
            setPaymentStatus('failed');
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#7c3aed'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentPlan) {
    return <div>Invalid plan selected</div>;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-4">
                Your {currentPlan.name} subscription has been activated.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
              <p className="text-muted-foreground mb-4">
                There was an issue processing your payment.
              </p>
              <Button onClick={() => setPaymentStatus(null)}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Secure payment powered by Razorpay</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{currentPlan.name}</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">₹{currentPlan.price}</span>
              <span className="text-muted-foreground">/{currentPlan.period}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <h3 className="font-semibold mb-3">What's included:</h3>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${currentPlan.price} - Subscribe Now`
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure payment processed by Razorpay. 30-day money-back guarantee.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;