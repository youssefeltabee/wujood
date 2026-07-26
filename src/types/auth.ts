export type AuthRole = "user" | "admin";

export type AuthedUser = {
  userId: string;
  email: string;
};

export type SessionData = {
  userId: string;
  email: string;
  role: AuthRole;
};
