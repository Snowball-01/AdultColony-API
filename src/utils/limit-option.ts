import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000000000, // insane high limit, basically unlimited
  message: "Too nasty, please slow down",
  standardHeaders: true, // ✅ good for frontends
  legacyHeaders: false,  // ✅ recommended
});

const slow = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50,           // allow 50 requests without delay
  delayMs: () => 100,       // 👈 MUST be a function now
  maxDelayMs: 1000,         // max 1 second delay
});

export { limiter, slow };
