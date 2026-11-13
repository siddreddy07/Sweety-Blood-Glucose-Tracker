export const JWT_EXPIRES_IN = "7d";

export const COOKIE_NAME = "token";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
