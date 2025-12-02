// lib/email/templates/client-invitation.tsx
import * as React from "react";

interface ClientInvitationEmailProps {
  clientName: string;
  trainerName: string;
  trainerBusinessName?: string;
  inviteLink: string;
}

export const ClientInvitationEmail = ({
  clientName,
  trainerName,
  trainerBusinessName,
  inviteLink,
}: ClientInvitationEmailProps) => (
  <html>
    <body
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#2563eb", margin: "0" }}>
            {trainerBusinessName || `${trainerName}'s Fitness Coaching`}
          </h1>
        </div>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "30px",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "#1f2937", marginTop: "0" }}>
            Welcome, {clientName}! 👋
          </h2>

          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            {trainerName} has invited you to join their fitness coaching
            program. You now have access to your personalized client portal
            where you can:
          </p>

          <ul style={{ fontSize: "16px", marginBottom: "25px" }}>
            <li>View your customized nutrition plans</li>
            <li>Access your workout programs</li>
            <li>Track your progress and measurements</li>
            <li>Log your daily weight</li>
            <li>Communicate with your trainer</li>
          </ul>

          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a
              href={inviteLink}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 30px",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              Set Up Your Account
            </a>
          </div>

          <p
            style={{ fontSize: "14px", color: "#6b7280", marginBottom: "10px" }}
          >
            Or copy and paste this link into your browser:
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              wordBreak: "break-all",
              backgroundColor: "#ffffff",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {inviteLink}
          </p>

          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "30px" }}>
            This invitation link will expire in 7 days.
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          <p>
            If you didn't expect this invitation, you can safely ignore this
            email.
          </p>
          <p>Questions? Reply to this email to contact {trainerName}.</p>
        </div>
      </div>
    </body>
  </html>
);

// Plain text version for email clients that don't support HTML
export const ClientInvitationEmailText = ({
  clientName,
  trainerName,
  trainerBusinessName,
  inviteLink,
}: ClientInvitationEmailProps) => `
Welcome, ${clientName}!

${trainerName} has invited you to join their fitness coaching program at ${trainerBusinessName || `${trainerName}'s Fitness Coaching`}.

You now have access to your personalized client portal where you can:
- View your customized nutrition plans
- Access your workout programs
- Track your progress and measurements
- Log your daily weight
- Communicate with your trainer

Set up your account by visiting:
${inviteLink}

This invitation link will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.

Questions? Reply to this email to contact ${trainerName}.
`;
