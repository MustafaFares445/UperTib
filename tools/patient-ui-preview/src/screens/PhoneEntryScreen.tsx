import { useState } from 'react';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { ActionBar } from '../components/ActionBar';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { ValidationField } from '../components/ValidationField';
import { requestChallenge, type Challenge } from '../mocks/identity';

export interface PhoneEntryScreenProps {
  onCodeRequested: (phone: string, challenge: Challenge) => void;
  onBack: () => void;
}

const PHONE_PATTERN = /^09\d{8}$/;

/**
 * SCR-IDENTITY-002 — Phone entry and code request. Collects and normalizes the contact number and
 * requests a verification challenge (WGT-IDENTITY-001, API-IDENTITY-001). Never distinguishes a
 * number that belongs to an existing account from one that does not; the entered number survives
 * a failed request.
 */
export function PhoneEntryScreen({ onCodeRequested, onBack }: PhoneEntryScreenProps) {
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const wellFormed = PHONE_PATTERN.test(phone);

  function handleRequest() {
    if (!wellFormed) {
      setError('أدخل رقم هاتف سوري صالحًا يبدأ بـ 09 ويتكوّن من 10 أرقام.');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onCodeRequested(phone, requestChallenge(phone));
    }, 400);
  }

  return (
    <Screen
      centerContent
      footer={
        <Stack gap="stack-sm">
          {submitting ? <SubmissionStateIndicator status="pending" /> : null}
          <ActionBar
            actions={[
              {
                key: 'request',
                label: 'طلب رمز التحقق',
                role: 'primary',
                availability:
                  submitting || !wellFormed
                    ? { status: 'disabled', reason: !wellFormed ? 'أدخل رقم هاتف صالح لتفعيل الإرسال.' : 'جارٍ الإرسال…' }
                    : { status: 'available' },
                onPress: handleRequest,
              },
              { key: 'back', label: 'رجوع', role: 'secondary', availability: { status: 'available' }, onPress: onBack },
            ]}
          />
        </Stack>
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="التحقق · الخطوة 1 من 2"
          title="أدخل رقم هاتفك"
          description="سنرسل رمزًا من 6 أرقام عبر رسالة نصية. لن نستخدم الرقم لتمييز حساب موجود من حساب جديد."
        />
        <ValidationField
          label="رقم الهاتف"
          value={phone}
          onChangeText={setPhone}
          placeholder="09XXXXXXXX"
          keyboardType="phone-pad"
          maxLength={10}
          error={error}
          helper="استخدم رقمًا سوريًا يبدأ بـ 09."
          autoFocus
        />
      </Stack>
    </Screen>
  );
}
