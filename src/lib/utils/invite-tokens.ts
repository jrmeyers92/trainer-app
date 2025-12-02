// lib/utils/invite-tokens.ts
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { randomBytes } from "crypto";

/**
 * Generate a secure random token for client invitations
 */
export function generateInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Create an invitation record in the database
 */
export async function createInvitation(
  clientId: string,
  trainerId: string,
  email: string
) {
  const supabase = await createAdminClient();
  const token = generateInviteToken();

  // Set expiration to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data, error } = await supabase
    .from("trainer_client_invitations")
    .insert({
      client_id: clientId,
      trainer_id: trainerId,
      token,
      email,
      status: "pending",
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating invitation:", error);
    throw new Error("Failed to create invitation");
  }

  return data;
}

/**
 * Verify an invitation token
 */
export async function verifyInvitationToken(token: string) {
  const supabase = await createAdminClient();

  const { data: invitation, error } = await supabase
    .from("trainer_client_invitations")
    .select(
      `
      *,
      trainer:trainer_trainers(*),
      client:trainer_clients(*)
    `
    )
    .eq("token", token)
    .eq("status", "pending")
    .single();

  if (error || !invitation) {
    return { valid: false, error: "Invalid or expired invitation" };
  }

  // Check if expired
  if (new Date(invitation.expires_at) < new Date()) {
    await supabase
      .from("trainer_client_invitations")
      .update({ status: "expired" })
      .eq("id", invitation.id);

    return { valid: false, error: "This invitation has expired" };
  }

  return { valid: true, invitation };
}

/**
 * Mark invitation as accepted
 */
export async function acceptInvitation(token: string, clientUserId: string) {
  const supabase = await createAdminClient();

  // First verify the token
  const verification = await verifyInvitationToken(token);
  if (!verification.valid) {
    return { success: false, error: verification.error };
  }

  const invitation = verification.invitation;

  // Update invitation status
  const { error: inviteError } = await supabase
    .from("trainer_client_invitations")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("token", token);

  if (inviteError) {
    console.error("Error updating invitation:", inviteError);
    return { success: false, error: "Failed to accept invitation" };
  }

  // Update client record with user ID and enable portal
  const { error: clientError } = await supabase
    .from("trainer_clients")
    .update({
      client_user_id: clientUserId,
      portal_enabled: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invitation.client_id);

  if (clientError) {
    console.error("Error updating client:", clientError);
    return { success: false, error: "Failed to link client account" };
  }

  return {
    success: true,
    clientId: invitation.client_id,
    trainerId: invitation.trainer_id,
  };
}
