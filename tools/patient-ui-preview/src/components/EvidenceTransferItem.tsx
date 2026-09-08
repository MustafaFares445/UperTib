import { Pressable, View } from 'react-native';
import { Body, BodyStrong, Helper, Label } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { EvidenceItemProjection, EvidenceTransferState } from '../mocks/evidence';
import { borderWidth, color, radius, size, space } from '../theme/tokens';
import { StateChip } from './StateChip';

const STATE_LABEL: Record<EvidenceTransferState, string> = {
  SELECTED: 'تم الاختيار',
  UPLOADING: 'جارٍ الرفع',
  PAUSED: 'متوقَّف مؤقتًا',
  FAILED_RETRYABLE: 'تعذّر الرفع — أعد المحاولة',
  UPLOADED: 'تم الرفع — بانتظار الفحص',
  VALIDATING_SCANNING: 'جارٍ الفحص',
  ACCEPTED: 'مقبول',
  REJECTED: 'مرفوض — يلزم استبدال الملف',
};

function TransferAction({ label, onPress }: { label: string; onPress?: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="button"
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: space('inset-md'),
        borderRadius: radius('control'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('action.secondary-border'),
        backgroundColor: pressed ? color('action.secondary-hover') : color('action.secondary-surface'),
        ...ring.ringStyle,
      })}
    >
      <BodyStrong style={{ color: color('action.secondary-text') }}>{label}</BodyStrong>
    </Pressable>
  );
}

function Progress({ value }: { value: number }) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="تقدّم رفع الملف"
      accessibilityValue={{ min: 0, max: 100, now: percent, text: `${percent}%` }}
      style={{ gap: space('stack-xs') }}
    >
      <View
        style={{
          height: 6,
          borderRadius: radius('chip'),
          overflow: 'hidden',
          backgroundColor: color('border.subtle'),
        }}
      >
        <View
          style={{
            width: `${percent}%`,
            height: '100%',
            borderRadius: radius('chip'),
            backgroundColor: color('action.primary'),
          }}
        />
      </View>
      <Helper>{percent}% من الملف نُقل حتى الآن</Helper>
    </View>
  );
}

/**
 * CMP-PLATFORM-012 — one evidence item across the eight governed transfer-session states.
 * The component deliberately keeps transport failure, validation rejection, upload completion and
 * evidence acceptance as separate structures. It never exposes a storage path, object key, signed URL,
 * scanner internal or vendor name.
 */
export function EvidenceTransferItem({
  item,
  onStart,
  onResume,
  onRetry,
  onReplace,
}: {
  item: EvidenceItemProjection;
  onStart?: () => void;
  onResume?: () => void;
  onRetry?: () => void;
  onReplace?: () => void;
}) {
  const canShowProgress = item.state === 'UPLOADING' || item.state === 'PAUSED' || item.state === 'FAILED_RETRYABLE';
  const progress = canShowProgress ? item.progress : undefined;

  return (
    <View
      style={{
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
      }}
    >
      <View style={{ gap: space('stack-xs') }}>
        <Label>العنصر المطلوب</Label>
        <BodyStrong>{item.displayName}</BodyStrong>
      </View>

      <StateChip machine="evidence-transfer-session" status={item.state} label={STATE_LABEL[item.state]} />

      {progress !== undefined ? <Progress value={progress} /> : null}

      {item.state === 'FAILED_RETRYABLE' ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>الملف لم يُرفض.</BodyStrong>
          <Body>المشكلة حدثت أثناء النقل قبل أن تتم مراجعة الملف. يمكنك متابعة رفع العنصر نفسه بدل البدء من جديد.</Body>
        </View>
      ) : null}

      {item.state === 'UPLOADED' ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>وصل الملف، لكنه ليس مقبولًا بعد.</BodyStrong>
          <Body>يبقى بانتظار الفحص والتحقق المطلوبَين قبل أن يحقق هذا المتطلب.</Body>
        </View>
      ) : null}

      {item.state === 'VALIDATING_SCANNING' ? (
        <Body>الفحص جارٍ للتأكد من سلامة الملف ومطابقته للمتطلب. لا تحتاج إلى إعادة الرفع الآن.</Body>
      ) : null}

      {item.state === 'REJECTED' && item.rejectionReason ? (
        <View style={{ gap: space('stack-xs') }}>
          <BodyStrong>لماذا يلزم استبدال الملف؟</BodyStrong>
          <Body>{item.rejectionReason}</Body>
        </View>
      ) : null}

      <View style={{ gap: space('stack-xs') }}>
        <Helper>ما الذي يحدث الآن؟</Helper>
        <Body>{item.nextStep}</Body>
      </View>

      {item.state === 'SELECTED' && onStart ? <TransferAction label="بدء الرفع" onPress={onStart} /> : null}
      {item.state === 'PAUSED' && onResume ? <TransferAction label="استئناف الرفع" onPress={onResume} /> : null}
      {item.state === 'FAILED_RETRYABLE' ? (
        onResume ? <TransferAction label="استئناف الرفع" onPress={onResume} /> : onRetry ? <TransferAction label="إعادة المحاولة" onPress={onRetry} /> : null
      ) : null}
      {item.state === 'REJECTED' && onReplace ? <TransferAction label="استبدال الملف" onPress={onReplace} /> : null}
    </View>
  );
}