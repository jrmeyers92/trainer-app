// lib/types/database-helpers.ts
import { Database } from "./database.types";

// Table row types (what you get when querying)
export type Trainer = Database["public"]["Tables"]["trainer_trainers"]["Row"];
export type Client = Database["public"]["Tables"]["trainer_clients"]["Row"];

// Insert types (what you need to insert new records)
export type TrainerInsert =
  Database["public"]["Tables"]["trainer_trainers"]["Insert"];
export type ClientInsert =
  Database["public"]["Tables"]["trainer_clients"]["Insert"];

// Update types (what you can update)
export type TrainerUpdate =
  Database["public"]["Tables"]["trainer_trainers"]["Update"];
export type ClientUpdate =
  Database["public"]["Tables"]["trainer_clients"]["Update"];

// Enums from your database constraints
export type SubscriptionPlan = "free" | "pro" | "business";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing";
export type ClientStatus = "active" | "inactive" | "paused" | "trial";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";
export type PrimaryGoal =
  | "weight_loss"
  | "muscle_gain"
  | "maintenance"
  | "athletic_performance";
export type PaymentMethod = "stripe" | "cash" | "bank_transfer" | "other";
export type PaymentStatus = "current" | "overdue" | "paid";

// Joined/enriched types for common queries
export type ClientWithTrainer = Client & {
  trainer: Trainer;
};

export type TrainerWithClients = Trainer & {
  clients: Client[];
};

// Useful helper for forms - makes all fields optional except required ones
export type NewClientForm = Pick<
  ClientInsert,
  "trainer_id" | "full_name" | "email"
> &
  Partial<Omit<ClientInsert, "trainer_id" | "full_name" | "email">>;

export type NewTrainerForm = Pick<TrainerInsert, "clerk_user_id" | "email"> &
  Partial<Omit<TrainerInsert, "clerk_user_id" | "email">>;

// Dashboard stats type
export type DashboardStats = {
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  clientsNeedingCheckIn: number;
};

// Client profile for detailed view
export type ClientProfile = Client & {
  age?: number; // calculated from date_of_birth
  bmi?: number; // calculated from height/weight
};

// Subscription helper
// Subscription helper
// Subscription helper
export type SubscriptionInfo = Pick<
  Trainer,
  | "subscription_plan"
  | "subscription_status"
  | "trial_ends_at"
  | "subscription_ends_at"
> & {
  isActive: boolean;
  isPro: boolean;
  isBusiness: boolean;
  clientLimit: number;
  daysLeftInTrial?: number;
};
// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string | null): number | undefined {
  if (!dateOfBirth) return undefined;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

/**
 * Calculate BMI from height and weight
 */
export function calculateBMI(
  heightFeet: number | null,
  heightInches: number | null,
  weightLbs: number | null
): number | undefined {
  if (!heightFeet || !weightLbs) return undefined;

  const totalInches = heightFeet * 12 + (heightInches || 0);
  const heightMeters = totalInches * 0.0254;
  const weightKg = weightLbs * 0.453592;

  const bmi = weightKg / (heightMeters * heightMeters);
  return Math.round(bmi * 10) / 10;
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * Using Mifflin-St Jeor Equation
 */
export function calculateTDEE(
  gender: string | null,
  age: number,
  weightLbs: number,
  heightFeet: number,
  heightInches: number = 0,
  activityLevel: string | null
): number {
  const weightKg = weightLbs * 0.453592;
  const heightCm = (heightFeet * 12 + heightInches) * 2.54;

  // BMR calculation
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };

  const multiplier =
    activityMultipliers[activityLevel as keyof typeof activityMultipliers] ||
    1.2;

  return Math.round(bmr * multiplier);
}

/**
 * Get subscription info with computed fields
 */
/**
 * Get subscription info with computed fields
 */
export function getSubscriptionInfo(trainer: Trainer): SubscriptionInfo {
  const plan = (trainer.subscription_plan || "free") as SubscriptionPlan;
  const status = (trainer.subscription_status ||
    "active") as SubscriptionStatus;

  const clientLimits: Record<SubscriptionPlan, number> = {
    free: 3,
    pro: 15,
    business: 999999, // Use a large number instead of Infinity
  };

  let daysLeftInTrial: number | undefined;
  if (trainer.trial_ends_at) {
    const trialEnd = new Date(trainer.trial_ends_at);
    const today = new Date();
    daysLeftInTrial = Math.ceil(
      (trialEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeftInTrial < 0) daysLeftInTrial = 0;
  }

  return {
    subscription_plan: plan,
    subscription_status: status,
    trial_ends_at: trainer.trial_ends_at,
    subscription_ends_at: trainer.subscription_ends_at,
    isActive: status === "active" || status === "trialing",
    isPro: plan === "pro",
    isBusiness: plan === "business",
    clientLimit: clientLimits[plan],
    daysLeftInTrial,
  };
}

/**
 * Format height for display
 */
export function formatHeight(
  feet: number | null,
  inches: number | null
): string {
  if (!feet) return "N/A";
  return `${feet}'${inches || 0}"`;
}

/**
 * Format weight for display
 */
export function formatWeight(lbs: number | null): string {
  if (!lbs) return "N/A";
  return `${lbs} lbs`;
}

/**
 * Get client status badge color (Tailwind classes)
 */
export function getClientStatusColor(status: string | null): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "paused":
      return "bg-yellow-100 text-yellow-800";
    case "trial":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Get payment status badge color (Tailwind classes)
 */
export function getPaymentStatusColor(status: string | null): string {
  switch (status) {
    case "current":
      return "bg-green-100 text-green-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "paid":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Format primary goal for display
 */
export function formatPrimaryGoal(goal: string | null): string {
  if (!goal) return "N/A";
  return goal.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Format activity level for display
 */
export function formatActivityLevel(level: string | null): string {
  if (!level) return "N/A";
  return level.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Get initials from full name
 */
export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
