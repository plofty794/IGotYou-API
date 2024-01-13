import { rateLimit } from "express-rate-limit";

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: {
    error: "Too many requests, please try again later.",
  },
});

export const sendBookingRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: {
    error: "Too many booking requests, please try again later.",
  },
  skipSuccessfulRequests: true,
});

export const sendIdentityVerificationRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: {
    error: "Identity photo request rejected, please try again later.",
  },
});
