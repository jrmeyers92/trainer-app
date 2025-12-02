import {
  Apple,
  BarChart3,
  CheckCircle2,
  Clock,
  CreditCard,
  Dumbbell,
  FileText,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-100 rounded-2xl">
              <Dumbbell className="text-blue-600" size={64} />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Ditch the Spreadsheets.
            <span className="text-blue-600"> Coach Smarter.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The all-in-one platform for online fitness coaches. Manage clients,
            build programs, track progress, and get paid—all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="sign-up"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Free Trial
            </Link>
            <button className="border-2 border-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition">
              Sign In
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tired of Juggling Multiple Tools?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop managing your coaching business across Instagram DMs, Google
              Sheets, Venmo, and WhatsApp. There&apos;s a better way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProblemCard
              title="Messy Client Management"
              description="Client info scattered across spreadsheets, notes apps, and your memory"
            />
            <ProblemCard
              title="Manual Program Building"
              description="Spending hours creating custom workouts and meal plans from scratch every time"
            />
            <ProblemCard
              title="Payment Chaos"
              description="Chasing down payments, tracking who paid, and manually sending invoices"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need in One Platform
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users size={32} />}
              title="Client Management"
              description="Track all client info, goals, measurements, and progress in one organized dashboard."
            />

            <FeatureCard
              icon={<Dumbbell size={32} />}
              title="Workout Builder"
              description="Create custom training programs with RPE-based auto-load calculations and exercise library."
            />

            <FeatureCard
              icon={<Apple size={32} />}
              title="Nutrition Planner"
              description="Build meal plans with macro tracking, food substitutions, and auto-calculated nutritional needs."
            />

            <FeatureCard
              icon={<BarChart3 size={32} />}
              title="Progress Tracking"
              description="Monitor weight, measurements, photos, and habits with visual charts and trends."
            />

            <FeatureCard
              icon={<CreditCard size={32} />}
              title="Built-in Payments"
              description="Accept payments, send invoices, and track monthly subscriptions with Stripe integration."
            />

            <FeatureCard
              icon={<Smartphone size={32} />}
              title="Client Portal"
              description="Give clients their own login to view programs, track progress, and communicate with you."
            />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h3 className="text-xl font-bold">Active Clients</h3>
                    <span className="text-sm text-gray-500">12 total</span>
                  </div>

                  <ClientPreview
                    name="Sarah Johnson"
                    goal="Weight Loss"
                    progress="-8 lbs"
                    status="on-track"
                  />
                  <ClientPreview
                    name="Mike Chen"
                    goal="Muscle Gain"
                    progress="+3 lbs"
                    status="on-track"
                  />
                  <ClientPreview
                    name="Jessica Martinez"
                    goal="Athletic Performance"
                    progress="Week 6"
                    status="check-in-due"
                  />

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Monthly Revenue
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      $1,200
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                See Every Client at a Glance
              </h2>
              <p className="text-lg text-gray-600">
                No more hunting through spreadsheets. Get a complete overview of
                all your clients, their progress, and what needs your attention.
              </p>

              <ul className="space-y-4">
                <BenefitItem
                  icon={<TrendingUp size={16} />}
                  text="Visual progress tracking with charts and trends"
                />
                <BenefitItem
                  icon={<Clock size={16} />}
                  text="See who needs check-ins and follow-ups"
                />
                <BenefitItem
                  icon={<FileText size={16} />}
                  text="All client notes and history in one place"
                />
                <BenefitItem
                  icon={<Zap size={16} />}
                  text="Quick actions for common tasks"
                />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Built for Online Coaches
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Whether you&apos;re just starting out or scaling to 50+ clients, we
            have the tools you need
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <CoachTypeCard
              title="New Coaches"
              description="Get professional tools from day one without the learning curve"
              features={[
                "Easy client onboarding",
                "Pre-built program templates",
                "Simple payment setup",
              ]}
            />
            <CoachTypeCard
              title="Growing Coaches"
              description="Scale from 5 to 25 clients without the chaos"
              features={[
                "Client portal access",
                "Automated reminders",
                "Progress analytics",
              ]}
            />
            <CoachTypeCard
              title="Established Coaches"
              description="Streamline operations and focus on coaching"
              features={[
                "Unlimited clients",
                "Custom branding",
                "Advanced reporting",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your coaching business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for trying it out"
              features={[
                "Up to 3 clients",
                "Basic workout builder",
                "Simple nutrition planner",
                "Progress tracking",
              ]}
              cta="Start Free"
              featured={false}
            />
            <PricingCard
              name="Pro"
              price="$40"
              description="For growing coaches"
              features={[
                "Up to 15 clients",
                "Full workout & nutrition tools",
                "Client portal access",
                "Payment processing",
                "Email support",
              ]}
              cta="Start Free Trial"
              featured={true}
            />
            <PricingCard
              name="Business"
              price="$80"
              description="For established coaches"
              features={[
                "Unlimited clients",
                "Custom branding",
                "Advanced analytics",
                "Priority support",
                "API access",
              ]}
              cta="Start Free Trial"
              featured={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Level Up Your Coaching Business?
          </h2>
          <p className="text-lg opacity-90">
            Join hundreds of coaches who ditched the spreadsheets. Start your
            free 14-day trial today—no credit card required.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition mt-4">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}

function ProblemCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-3 text-red-600">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <span className="text-gray-600">{text}</span>
    </li>
  );
}

function ClientPreview({
  name,
  goal,
  progress,
  status,
}: {
  name: string;
  goal: string;
  progress: string;
  status: "on-track" | "check-in-due";
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-semibold">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{goal}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">{progress}</p>
        <p
          className={`text-xs ${
            status === "on-track" ? "text-green-600" : "text-amber-600"
          }`}
        >
          {status === "on-track" ? "On track" : "Check-in due"}
        </p>
      </div>
    </div>
  );
}

function CoachTypeCard({
  title,
  description,
  features,
}: {
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  featured = false,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`bg-white p-8 rounded-xl border shadow-sm ${
        featured
          ? "ring-2 ring-blue-600 scale-105 border-blue-600"
          : "border-gray-200"
      }`}
    >
      {featured && (
        <div className="text-center mb-4">
          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-gray-500">/month</span>}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <button
        className={`w-full mb-6 px-4 py-2 rounded-lg font-semibold transition ${
          featured
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border-2 border-gray-300 hover:bg-gray-50"
        }`}
      >
        {cta}
      </button>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
