export {};

export type Roles = "admin" | "trainer" | "client";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      role?: Roles;
    };
  }
}

export {};
