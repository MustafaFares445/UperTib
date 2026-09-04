import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { BodyStrong, Helper } from '../foundations/Text';
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
      centerContent
      footer={
        <ActionBar
          actions={[
            { key: 'verify', label: 'ابدأ بالتحقق من رقمك', role: 'primary', availability: { status: 'available' }, onPress: onVerify },
            { key: 'browse', label: 'تصفّح الخدمات', role: 'secondary', availability: { status: 'available' }, onPress: onBrowse },
          ]}
        />
      }
    >
      <Stack gap="stack-xl">
        <ScreenHeader
          eyebrow="UberTib · رعاية أسنان أوضح"
          title="اعثر على موعد يناسب احتياجك"
          description="تصفّح خدمات الأسنان في حلب، قارن الخيارات المتاحة، ثم أرسل طلب الحجز."
        />
        <BodyStrong>سترى السعر المتوقع وأقرب موعد وحالة التوفر قبل اختيار الطبيب.</BodyStrong>
        <Helper>
          لا تُشخّص المنصّة حالتك ولا تقدّم علاجًا، ولا تتولّى الدفع أو حفظ الأموال نيابة عنك.
        </Helper>
      </Stack>
    </Screen>
  );
}
