import { formatArabicCount, formatNumber } from '../foundations/format';

export const REVIEW_RATING_VALUES = [1, 2, 3, 4, 5] as const;
export type ReviewRatingValue = (typeof REVIEW_RATING_VALUES)[number];

export const REVIEW_RATING_LABELS: Record<ReviewRatingValue, string> = {
  1: 'سيئة جدًا',
  2: 'سيئة',
  3: 'مقبولة',
  4: 'جيدة',
  5: 'ممتازة',
};

export const MIN_PUBLIC_VERIFIED_REVIEW_COUNT = 5;

export interface VerifiedReviewAggregate {
  average: number;
  count: number;
}

export function isReviewRatingValue(value: unknown): value is ReviewRatingValue {
  return typeof value === 'number'
    && Number.isInteger(value)
    && value >= REVIEW_RATING_VALUES[0]
    && value <= REVIEW_RATING_VALUES[REVIEW_RATING_VALUES.length - 1];
}

export function reviewRatingAccessibilityLabel(value: ReviewRatingValue): string {
  return `${value} من 5، ${REVIEW_RATING_LABELS[value]}`;
}

function reviewCountLabel(count: number): string {
  return formatArabicCount(count, {
    one: 'تقييم واحد',
    two: 'تقييمان',
    few: 'تقييمات',
    many: 'تقييمًا',
  });
}

export function isPublicVerifiedReviewAggregate(aggregate: VerifiedReviewAggregate | undefined): aggregate is VerifiedReviewAggregate {
  if (!aggregate) return false;
  return Number.isFinite(aggregate.average)
    && aggregate.average >= 1
    && aggregate.average <= 5
    && Number.isInteger(aggregate.count)
    && aggregate.count >= MIN_PUBLIC_VERIFIED_REVIEW_COUNT;
}

export function formatVerifiedReviewAggregate(aggregate: VerifiedReviewAggregate | undefined): string | null {
  if (!isPublicVerifiedReviewAggregate(aggregate)) return null;
  const average = formatNumber(Number(aggregate.average.toFixed(1)));
  return `★ ${average} · ${reviewCountLabel(aggregate.count)}`;
}

export function verifiedReviewAggregateAccessibilityLabel(aggregate: VerifiedReviewAggregate | undefined): string | null {
  if (!isPublicVerifiedReviewAggregate(aggregate)) return null;
  const average = formatNumber(Number(aggregate.average.toFixed(1)));
  return `متوسط تقييم التجربة ${average} من 5، بناءً على عدد من التقييمات الموثّقة يبلغ ${formatNumber(aggregate.count)}`;
}
