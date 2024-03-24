import { rateLimit } from "express-rate-limit";

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: {
    error: "Too many requests, please try again later.",
  },
});

export const sendBookingRequestLimiter = rateLimit({
  windowMs: 60000,
  limit: 3,
  message: {
    error: "Too many booking requests, please try again later.",
  },
  skipSuccessfulRequests: true,
});

export const sendIdentityVerificationRequestLimiter = rateLimit({
  windowMs: 60000,
  limit: 3,
  message: {
    error: "Identity photo request rejected, please try again later.",
  },
});

export const reAttemptBookingRequestLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 3,
  message: {
    error: "You've reached your daily limit. Try again tomorrow.",
  },
});

export const sendRequestPayoutLimiter = rateLimit({
  windowMs: 60000 * 10,
  limit: 2,
  message: {
    error: "Payout request limit reached, try again after 10 minutes.",
  },
});
