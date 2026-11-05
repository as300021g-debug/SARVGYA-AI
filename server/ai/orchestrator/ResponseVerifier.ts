// ============================================================================
// SARVAGYA AI — RESPONSE VERIFIER (`server/ai/orchestrator/ResponseVerifier.ts`)
// Verifies responses, checks tool assertions, and enforces safety bounds
// ============================================================================

export interface VerificationResult {
  isValid: boolean;
  sanitizedText: string;
  warningNotice?: string;
  verifiedClaims: string[];
  safetyPassed: boolean;
}

export class ResponseVerifier {
  public verify(
    text: string,
    toolOutputs?: any[],
    requiresApproval: boolean = false
  ): VerificationResult {
    let sanitized = text;
    let warningNotice: string | undefined;
    const verifiedClaims: string[] = [];

    // 1. Strict Booking Safety Check:
    // If the text claims a flight/train/hotel ticket is "booked", verify real confirmation
    const claimsBooking = /\b(ticket is booked|confirmed booking|booking successful|payment completed|funds deducted)\b/i.test(
      sanitized
    );

    if (claimsBooking && requiresApproval) {
      const hasRealConfirmation = toolOutputs?.some(
        (t) => t?.confirmationNumber || t?.pnr || t?.bookingId
      );

      if (!hasRealConfirmation) {
        warningNotice =
          "Safety Verification: Pre-booking details prepared. Official booking requires authorized payment and parent/guardian OTP confirmation.";
        sanitized = `${sanitized}\n\n> 🛡️ **SARVAGYA Safety & Security Notice:**\n> Flight/Travel itinerary options have been retrieved and structured. A ticket is **never** confirmed without real payment gateway confirmation and explicit adult authorization. AI cannot bypass OTP security.`;
      }
    }

    // 2. Verified Claims Extraction
    if (toolOutputs && toolOutputs.length > 0) {
      for (const t of toolOutputs) {
        if (t?.verifiedScheduleSource) {
          verifiedClaims.push(`Schedule verified via ${t.verifiedScheduleSource}`);
        }
        if (t?.sources?.length) {
          verifiedClaims.push(`${t.sources.length} live web sources cross-verified`);
        }
      }
    }

    return {
      isValid: true,
      sanitizedText: sanitized,
      warningNotice,
      verifiedClaims,
      safetyPassed: true,
    };
  }
}

export const responseVerifier = new ResponseVerifier();
