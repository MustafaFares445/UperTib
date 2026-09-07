import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { formatDateTime, formatRemaining } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper, Label } from '../foundations/Text';
import { CLAIMS_NOW_ISO, type ClaimRequestState, type PatientClaimDetail } from '../mocks/claims';
import { borderWidth, color, radius, space } from '../theme/tokens';

const CLAIM_LABEL: Record<ClaimRequestState, string> = {
  SUBMITTED: 'مُقدَّم',
  EVIDENCE_INCOMPLETE: 'أدلة ناقصة — إجراء مطلوب',
  UNDER_REVIEW: 'قيد المراجعة',
  DECIDED: 'صدر القرار',
  CLOSED: 'مُغلَق',
};

const FILTERS: Array<{ key: 'ALL' | ClaimRequestState; label: string }> = [
  { key: 'ALL', label: 'الكل' },
  { key: 'SUBMITTED', label: 'مُقدَّم' },
  { key: 'EVIDENCE_INCOMPLETE', label: 'يحتاج إجراء' },
  { key: 'UNDER_REVIEW', label: 'قيد المراجعة' },
  { key: 'DECIDED', label: 'صدر القرار' },
  { key: 'CLOSED', label: 'مغلق' },
];

function ClaimRow({ claim, onOpen }: { claim: PatientClaimDetail; onOpen: () => void }) {
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
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: space('inline-sm') }}>
        <View style={{ flex: 1, minWidth: 180, gap: space('stack-xs') }}>
          <Helper>{claim.type === 'REFUND_REQUEST' ? 'طلب استرداد' : 'مطالبة حماية'}</Helper>
          <BodyStrong>{claim.serviceLabel}</BodyStrong>
        </View>
        <StateChip machine="claim-request" status={claim.state} label={CLAIM_LABEL[claim.state]} />
      </View>

      {claim.effectiveDeadlineIso ? (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-xs') }}>
          <Icon name="clock" color={color('text.secondary')} scale="sm" />
          <View style={{ flex: 1, gap: space('stack-xs') }}>
            <BodyStrong>{formatRemaining(claim.effectiveDeadlineIso, CLAIMS_NOW_ISO)}</BodyStrong>
            <Helper>المهلة الفعّالة: {formatDateTime(claim.effectiveDeadlineIso)}</Helper>
          </View>
        </View>
      ) : (
        <Helper>الوقت المتبقي غير متاح حاليًا؛ لا نعتبر أن الطلب بلا مهلة.</Helper>
      )}

      {claim.missingEvidenceCount > 0 ? (
        <Body>متطلبات تحتاج منك إجراء: {claim.missingEvidenceCount}</Body>
      ) : (
        <Helper>لا توجد متطلبات ناقصة ظاهرة لك الآن.</Helper>
      )}

      {claim.appealEligible ? <Helper>الاعتراض متاح لهذا القرار ضمن نافذته الحاكمة.</Helper> : null}
      {claim.externalExecutionPending ? <Helper>يوجد تنفيذ خارجي مستحق بعد القرار ولم يُسجّل تنفيذه بعد.</Helper> : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`فتح ${claim.type === 'REFUND_REQUEST' ? 'طلب الاسترداد' : 'مطالبة الحماية'} — ${claim.serviceLabel}`}
        onPress={onOpen}
        style={{
          minHeight: 44,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: space('inset-md'),
          borderRadius: radius('control'),
          borderWidth: 1,
          borderColor: color('border.strong'),
          backgroundColor: color('surface.default'),
        }}
      >
        <Label>فتح الطلب</Label>
      </Pressable>
    </View>
  );
}

/** SCR-CLAIMS-001 — patient claim/refund list with deadline-first prioritization. */
export function MyClaimsScreen({
  claims,
  subject = 'مطالباتي وطلبات الاسترداد',
  authority,
  canRequestRefund = true,
  refundUnavailableReason,
  canRequestProtection = false,
  protectionUnavailableReason,
  onOpenClaim,
  onRequestRefund,
  onRequestProtection,
}: {
  claims: PatientClaimDetail[];
  subject?: string;
  authority?: string;
  canRequestRefund?: boolean;
  refundUnavailableReason?: string;
  canRequestProtection?: boolean;
  protectionUnavailableReason?: string;
  onOpenClaim: (claim: PatientClaimDetail) => void;
  onRequestRefund?: () => void;
  onRequestProtection?: () => void;
}) {
  const [filter, setFilter] = useState<'ALL' | ClaimRequestState>('ALL');
  const filtered = useMemo(
    () => filter === 'ALL' ? claims : claims.filter((claim) => claim.state === filter),
    [claims, filter],
  );

  const actions: ActionSpec[] = [];
  if (onRequestRefund) {
    actions.push({
      key: 'refund',
      label: 'طلب استرداد جديد',
      role: 'secondary',
      availability: canRequestRefund
        ? { status: 'available' }
        : { status: 'disabled', reason: refundUnavailableReason ?? 'لا يتوفر طلب استرداد جديد لهذه الحالة الآن.' },
      onPress: onRequestRefund,
    });
  }
  if (onRequestProtection) {
    actions.push({
      key: 'protection',
      label: 'مطالبة حماية جديدة',
      role: 'secondary',
      availability: canRequestProtection
        ? { status: 'available' }
        : { status: 'absent', reason: protectionUnavailableReason ?? 'لا تظهر مطالبة الحماية إلا عندما تحتوي الشروط المقبولة حماية فعّالة تنطبق على الحالة.' },
      onPress: onRequestProtection,
    });
  }

  return (
    <Screen footer={actions.length > 0 ? <ActionBar actions={actions} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="المطالبات"
          title="ما الذي يحتاج متابعتك؟"
          description="المهلة والحالة تظهران هنا قبل فتح التفاصيل، حتى لا يفوتك إجراء غير قابل للاسترجاع."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>تصفية حسب الحالة</Heading3>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('inline-xs') }}>
            {FILTERS.map((item) => {
              const selected = item.key === filter;
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`تصفية المطالبات: ${item.label}`}
                  onPress={() => setFilter(item.key)}
                  style={{
                    minHeight: 40,
                    justifyContent: 'center',
                    paddingHorizontal: space('inset-sm'),
                    borderRadius: radius('chip'),
                    borderWidth: 1,
                    borderColor: selected ? color('border.strong') : color('border.subtle'),
                    backgroundColor: selected ? color('surface.subtle') : color('surface.default'),
                  }}
                >
                  <Label>{item.label}</Label>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ gap: space('stack-sm') }}>
          <Heading3>الطلبات</Heading3>
          {claims.length === 0 ? (
            <View style={{ gap: space('stack-xs') }}>
              <BodyStrong>لا توجد مطالبات أو طلبات استرداد بعد.</BodyStrong>
              <Body>عندما يصبح لديك طلب، سيظهر هنا مع حالته ومهلته.</Body>
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ gap: space('stack-xs') }}>
              <BodyStrong>لا توجد نتائج ضمن هذا الفلتر.</BodyStrong>
              <Body>الطلبات موجودة، لكن الفلتر الحالي أخفاها. اختر «الكل» لإظهارها.</Body>
            </View>
          ) : filtered.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} onOpen={() => onOpenClaim(claim)} />
          ))}
        </View>
      </Stack>
    </Screen>
  );
}
