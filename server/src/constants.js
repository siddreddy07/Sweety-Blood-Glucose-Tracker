export const SLOTS = ["Morning (fasting)", "After breakfast", "After lunch", "After dinner"];
export const MIN_VALUE = 40;
export const MAX_VALUE = 600;
export const MAX_READINGS_PER_DAY = 4;

export const JWT_EXPIRES_IN = "7d";

export const COOKIE_NAME = "token";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
