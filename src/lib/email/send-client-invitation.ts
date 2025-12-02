// lib/email/send-client-invitation.ts
import { resend } from "./resend";
import {
  ClientInvitationEmail,
  ClientInvitationEmailText,
} from "./templates/client-invitation";

interface SendClientInvitationParams {
  to: string;
  clientName: string;
  trainerName: string;
  trainerEmail: string;
  trainerBusinessName?: string;
  inviteToken: string;
}

export async function sendClientInvitation({
  to,
  clientName,
  trainerName,
  trainerEmail,
  trainerBusinessName,
  inviteToken,
}: SendClientInvitationParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteLink = `${appUrl}/client/accept-invite?token=${inviteToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${trainerBusinessName || trainerName} <onboarding@resend.dev>`,
      to: [to],
      replyTo: trainerEmail,
      subject: `You've been invited to ${trainerBusinessName || `${trainerName}'s Fitness Coaching`}`,
      react: ClientInvitationEmail({
        clientName,
        trainerName,
        trainerBusinessName,
        inviteLink,
      }),
      text: ClientInvitationEmailText({
        clientName,
        trainerName,
        trainerBusinessName,
        inviteLink,
      }),
    });

    if (error) {
      console.error("Error sending invitation email:", error);
      return { success: false, error: error.message };
    }

    console.log("Invitation email sent successfully:", data);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending invitation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
