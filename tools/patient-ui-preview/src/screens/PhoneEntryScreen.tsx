import { useState } from 'react';
import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2 } from '../foundations/Text';
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
        <Heading2>تحقّق من رقم هاتفك</Heading2>
        <Body tone="secondary">سنرسل رمز تحقق مكوّنًا من 6 أرقام عبر رسالة نصية إلى هذا الرقم.</Body>
        <ValidationField
          label="رقم الهاتف"
          value={phone}
          onChangeText={setPhone}
          placeholder="09XXXXXXXX"
          keyboardType="phone-pad"
          maxLength={10}
          error={error}
          autoFocus
        />
      </Stack>
    </Screen>
  );
}
