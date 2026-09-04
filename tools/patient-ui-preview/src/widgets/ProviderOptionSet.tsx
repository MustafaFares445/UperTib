import { View } from 'react-native';
import { Helper } from '../foundations/Text';
import { EmptyState } from '../components/EmptyState';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { RecoveryState } from '../components/RecoveryState';
import { color, radius, space } from '../theme/tokens';

export type ProviderOptionSetState = 'loading-initial' | 'empty-no-data' | 'empty-filtered' | 'error-fetch' | 'success';

interface ProviderOptionSetProps {
  state: ProviderOptionSetState;
  options: ProviderOption[];
  onChoose: (option: ProviderOption) => void;
  onRetry?: () => void;
  onClearFilter?: () => void;
  selectedIds?: string[];
  onToggleCompare?: (option: ProviderOption) => void;
}

function Skeleton() {
  return (
    <View style={{ gap: space('stack-sm') }}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            height: 132,
            borderRadius: radius('surface'),
            backgroundColor: color('surface.subtle'),
          }}
        />
      ))}
    </View>
  );
}

/**
 * WGT-ELIG-001 — Provider option set. Renders every currently eligible provider/service/branch
 * combination as a full decision card. No composite ranking is ever assembled: cards render in
 * the order the read returned them, never re-sorted by an internal score.
 */
export function ProviderOptionSet({
  state,
  options,
  onChoose,
  onRetry,
  onClearFilter,
  selectedIds = [],
  onToggleCompare,
}: ProviderOptionSetProps) {
  if (state === 'loading-initial') {
    return <Skeleton />;
  }
  if (state === 'error-fetch') {
    return (
      <RecoveryState
        variant="fetch-failure"
        whatFailed="تعذر تحميل نتائج البحث."
        stillTrue="لم تُفقد بيانات البحث المدخلة."
        guidance="يمكن إعادة المحاولة الآن."
        action={onRetry ? { key: 'retry', label: 'إعادة المحاولة', role: 'primary', availability: { status: 'available' }, onPress: onRetry } : undefined}
      />
    );
  }
  if (state === 'empty-filtered') {
    return (
      <EmptyState
        variant="filtered-empty"
        icon="magnifying-glass"
        statement="لا نتائج تطابق معايير البحث الحالية."
        reason="عدّل الخدمة أو المنطقة المختارة، أو امسح الفلتر."
        action={onClearFilter ? { key: 'clear', label: 'مسح الفلتر', role: 'secondary', availability: { status: 'available' }, onPress: onClearFilter } : undefined}
      />
    );
  }
  if (state === 'empty-no-data') {
    return (
      <EmptyState
        variant="no-data"
        icon="document-text"
        statement="لا يوجد مقدّمو خدمة متاحون لهذه الخدمة حاليًا."
        reason="يمكن اختيار خدمة أخرى أو المحاولة لاحقًا."
      />
    );
  }

  return (
    <View style={{ gap: space('stack-sm') }}>
      <Helper>{options.length} نتيجة متاحة</Helper>
      {options.map((option) => (
        <ProviderDecisionCard
          key={option.id}
          option={option}
          variant="row"
          onPress={() => onChoose(option)}
          selected={selectedIds.includes(option.id)}
          compareDisabled={selectedIds.length >= 3}
          onCompareToggle={onToggleCompare ? () => onToggleCompare(option) : undefined}
        />
      ))}
    </View>
  );
}
