import { useState } from 'react';
import { Screen, Stack } from '../foundations/Screen';
import { Bdi } from '../foundations/Bdi';
import { Body, Heading2, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { ValidationField } from '../components/ValidationField';
import { requestChallenge, verifyCode, type Challenge } from '../mocks/identity';

export interface CodeVerificationScreenProps {
  phone: string;
  challenge: Challenge;
  onVerified: () => void;
  onChangeNumber: () => void;
}

const REASON_COPY: Record<'invalid' | 'expired' | 'exhausted', string> = {
  invalid: 'رمز التحقق غير صحيح. يرجى التأكد من الرمز والمحاولة مجددًا.',
  expired: 'انتهت صلاحية هذا الرمز. يرجى طلب رمز جديد.',
  exhausted: 'تم استنفاد عدد المحاولات المسموح بها. يرجى طلب رمز جديد.',
};

/**
 * SCR-IDENTITY-003 — Code verification. Verifies the challenge code and activates or resumes the
 * patient identity (WGT-IDENTITY-001, API-IDENTITY-002). Invalid, expired and attempts-exhausted
 * each produce a distinct recovery from one error family — never a single generic failure.
 */
export function CodeVerificationScreen({ phone, challenge, onVerified, onChangeNumber }: CodeVerificationScreenProps) {
  const [code, setCode] = useState('');
  const [current, setCurrent] = useState(challenge);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [resending, setResending] = useState(false);

  const attemptsExhausted = current.attemptsRemaining <= 0;

  function handleVerify() {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      const result = verifyCode(code, current.attemptsRemaining, current.expiresAtIso);
      if (result.ok) {
        setError(undefined);
        onVerified();
        return;
      }
      setError(REASON_COPY[result.reason]);
      if (result.reason === 'invalid') {
        setCurrent((c) => ({ ...c, attemptsRemaining: c.attemptsRemaining - 1 }));
      }
    }, 400);
  }

  function handleResend() {
    setResending(true);
    window.setTimeout(() => {
      setResending(false);
      // Resend invalidates the prior code but does NOT reset accumulated failures
      // (SCR-IDENTITY-003 acceptance criterion 2) — only the challenge/expiry refreshes.
      const refreshed = requestChallenge(phone);
      setCurrent((c) => ({ ...refreshed, attemptsRemaining: c.attemptsRemaining }));
      setCode('');
      setError(undefined);
    }, 400);
  }

  return (
    <Screen
      footer={
        <Stack gap="stack-sm">
          {submitting ? <SubmissionStateIndicator status="pending" /> : null}
          <ActionBar
            actions={[
              {
                key: 'verify',
                label: 'تحقّق',
                role: 'primary',
                availability:
                  attemptsExhausted
                    ? { status: 'absent', reason: 'انتهت المحاولات المتاحة. اطلب رمزًا جديدًا للمتابعة.' }
                    : submitting || code.length !== 6
                      ? { status: 'disabled', reason: 'أدخل الرمز المكوّن من 6 أرقام.' }
                      : { status: 'available' },
                onPress: handleVerify,
              },
              {
                key: 'resend',
                label: 'إعادة إرسال الرمز',
                role: 'secondary',
                availability: resending ? { status: 'disabled', reason: 'جارٍ الإرسال…' } : { status: 'available' },
                onPress: handleResend,
              },
              { key: 'change', label: 'تغيير الرقم', role: 'secondary', availability: { status: 'available' }, onPress: onChangeNumber },
            ]}
          />
        </Stack>
      }
    >
      <Stack gap="stack-lg">
        <Heading2>أدخل رمز التحقق</Heading2>
        <Body tone="secondary">
          أُرسل الرمز إلى <Bdi>{phone}</Bdi>
        </Body>
        <ValidationField
          label="رمز التحقق"
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          error={error}
          autoFocus
        />
        {!attemptsExhausted ? <Helper>المحاولات المتبقية: {current.attemptsRemaining}</Helper> : null}
      </Stack>
    </Screen>
  );
}
