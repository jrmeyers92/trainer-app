// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

// Define onboarding routes
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

// Define protected API routes
const isProtectedApiRoute = createRouteMatcher(["/api/protected(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;

  // Handle API routes first
  if (path.startsWith("/api")) {
    // Allow public API routes (webhooks)
    if (path.startsWith("/api/webhooks")) {
      return NextResponse.next();
    }

    // Protect specific API routes if needed
    if (isProtectedApiRoute(req)) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  }

  // For public routes, allow access
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Get auth info for protected routes
  const { userId, sessionClaims } = await auth();

  // If not authenticated and trying to access protected route
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated - handle role and onboarding flow
  const role = sessionClaims?.metadata?.role as string | undefined;
  const onboardingComplete = sessionClaims?.metadata?.onboardingComplete as
    | boolean
    | undefined;

  // If user has no role, redirect to role selection
  if (!role && !path.startsWith("/onboarding/role-selection")) {
    return NextResponse.redirect(
      new URL("/onboarding/role-selection", req.url)
    );
  }

  // If user has completed onboarding, don't let them access onboarding pages
  if (role && onboardingComplete === true && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If user hasn't completed onboarding, redirect to appropriate flow
  if (role && onboardingComplete !== true && !isOnboardingRoute(req)) {
    if (role === "client") {
      // Clients complete onboarding immediately, so this shouldn't happen
      // But if it does, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (role === "trainer") {
      return NextResponse.redirect(new URL("/onboarding/trainer", req.url));
    }
  }

  // Role-based route protection

  // Protect trainer dashboard
  if (
    path.startsWith("/dashboard") &&
    role === "trainer" &&
    onboardingComplete !== true
  ) {
    return NextResponse.redirect(new URL("/onboarding/trainer", req.url));
  }

  // Protect trainer-only routes
  if (
    path.startsWith("/trainer-dashboard") &&
    role !== "trainer" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect admin-only routes
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect client portal routes
  if (
    path.startsWith("/client-portal") &&
    role !== "client" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
