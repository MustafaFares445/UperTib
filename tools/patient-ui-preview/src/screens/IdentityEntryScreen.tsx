import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading1 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';

export interface IdentityEntryScreenProps {
  onVerify: () => void;
  onBrowse: () => void;
}

/**
 * SCR-IDENTITY-001 — Patient entry. Lets a visitor understand what UberTib is for and reach either
 * discovery or identity verification, without implying diagnosis, treatment, insurance or money
 * custody. Both routes are always available; a failed catalog read never blocks either of them.
 */
export function IdentityEntryScreen({ onVerify, onBrowse }: IdentityEntryScreenProps) {
  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            { key: 'verify', label: 'تحقق من رقمي', role: 'primary', availability: { status: 'available' }, onPress: onVerify },
            { key: 'browse', label: 'تصفّح الخدمات', role: 'secondary', availability: { status: 'available' }, onPress: onBrowse },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <Heading1>UberTib</Heading1>
        <Body>
          يساعدك UberTib على العثور على طبيب أسنان مناسب في حلب وحجز موعد معه، بحسب توفّره الحالي.
        </Body>
        <Body tone="secondary">
          هذه المنصّة لا تُشخّص حالتك ولا تقدّم علاجًا، ولا تتولّى الدفع أو حفظ الأموال نيابة عنك.
        </Body>
      </Stack>
    </Screen>
  );
}
