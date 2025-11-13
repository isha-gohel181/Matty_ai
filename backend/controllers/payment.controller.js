import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { instance } from "../app.js";
import crypto from "crypto";
import { User } from "../models/user.model.js";

// @desc    Create a Razorpay order
// @route   POST /api/v1/payment/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const { amount, plan } = req.body;

  if (!amount || !plan) {
    return next(new ErrorHandler("Amount and plan are required", 400));
  }

  // Amount should be in paisa (multiply by 100 for rupees)
  const options = {
    amount: amount * 100, // Convert to paisa
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
    plan,
  });
});

// @desc    Verify payment
// @route   POST /api/v1/payment/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
  console.log('Payment verification request body:', req.body);
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
    console.log('Missing payment details:', { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan });
    return next(new ErrorHandler("All payment details are required", 400));
  }

  // Verify signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    console.log('Signature mismatch:', { received: razorpay_signature, expected: expectedSign });
    return next(new ErrorHandler("Payment verification failed", 400));
  }

  // Update user subscription
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Set subscription based on plan
  const now = new Date();
  let subscriptionEndDate;

  switch (plan) {
    case "monthly":
      subscriptionEndDate = new Date(now.setMonth(now.getMonth() + 1));
      break;
    case "yearly":
      subscriptionEndDate = new Date(now.setFullYear(now.getFullYear() + 1));
      break;
    default:
      console.log('Invalid plan received:', plan);
      return next(new ErrorHandler("Invalid plan", 400));
  }

  user.isPremium = true;
  user.subscriptionEndDate = subscriptionEndDate;
  user.subscriptionPlan = plan;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Payment verified and subscription activated",
    payment_id: razorpay_payment_id,
  });
});

// @desc    Get user subscription status
// @route   GET /api/v1/payment/status
// @access  Private
export const getSubscriptionStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("isPremium subscriptionEndDate subscriptionPlan");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if subscription is still active
  const now = new Date();
  if (user.subscriptionEndDate && user.subscriptionEndDate < now) {
    user.isPremium = false;
    await user.save();
  }

  res.status(200).json({
    success: true,
    subscription: {
      isPremium: user.isPremium,
      subscriptionEndDate: user.subscriptionEndDate,
      subscriptionPlan: user.subscriptionPlan,
    },
  });
});

// @desc    Get user usage statistics
// @route   GET /api/v1/payment/usage
// @access  Private
export const getUsageStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if subscription is active
  const now = new Date();
  if (user.subscriptionEndDate && user.subscriptionEndDate < now) {
    user.isPremium = false;
    await user.save();
  }

  const limits = {
    aiSuggestions: 5,
    colorPalettes: 3,
    templates: 10
  };

  const usageStats = {
    isPremium: user.isPremium,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionEndDate: user.subscriptionEndDate,
    limits: user.isPremium ? 'unlimited' : limits,
    currentUsage: user.usageLimits || {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      aiSuggestions: 0,
      colorPalettes: 0
    }
  };

  res.status(200).json({
    success: true,
    usageStats
  });
});