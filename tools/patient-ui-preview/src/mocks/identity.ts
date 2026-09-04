/**
 * Mock projection of API-IDENTITY-001 / API-IDENTITY-002. The valid demo code is fixed so the
 * Flow story is reproducible; any other 6-digit code exercises ERR-IDENTITY-004.
 */
export const DEMO_VALID_CODE = '123456';
export const RESEND_THROTTLE_SECONDS = 30;
export const CODE_EXPIRY_SECONDS = 300;
export const MAX_ATTEMPTS = 5;

export interface Challenge {
  challengeId: string;
  expiresAtIso: string;
  attemptsRemaining: number;
}

export function requestChallenge(_phone: string): Challenge {
  return {
    challengeId: `chal-${Date.now()}`,
    expiresAtIso: new Date(Date.now() + CODE_EXPIRY_SECONDS * 1000).toISOString(),
    attemptsRemaining: MAX_ATTEMPTS,
  };
}

export type VerifyResult = { ok: true } | { ok: false; reason: 'invalid' | 'expired' | 'exhausted' };

export function verifyCode(code: string, attemptsRemaining: number, expiresAtIso: string): VerifyResult {
  if (new Date(expiresAtIso).getTime() <= Date.now()) {
    return { ok: false, reason: 'expired' };
  }
  if (attemptsRemaining <= 0) {
    return { ok: false, reason: 'exhausted' };
  }
  if (code === DEMO_VALID_CODE) {
    return { ok: true };
  }
  return { ok: false, reason: 'invalid' };
}
