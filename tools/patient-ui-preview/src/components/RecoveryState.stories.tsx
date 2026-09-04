import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { RecoveryState } from './RecoveryState';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-010 Recovery state',
  component: RecoveryState,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof RecoveryState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FetchFailure: Story = {
  args: {
    variant: 'fetch-failure',
    whatFailed: 'تعذر تحميل نتائج البحث.',
    stillTrue: 'لم تُفقد بيانات البحث المدخلة.',
    guidance: 'يمكن إعادة المحاولة الآن.',
    action: { key: 'retry', label: 'إعادة المحاولة', role: 'primary', availability: { status: 'available' } },
  },
};

export const Stale: Story = {
  args: {
    variant: 'stale',
    whatFailed: 'تعذر تحديث البيانات.',
    asOf: 'البيانات كما كانت الساعة 09:00.',
    guidance: 'يمكن إعادة المحاولة؛ الإجراءات التي تتطلب التزامًا موقوفة مؤقتًا.',
    action: { key: 'retry', label: 'تحديث', role: 'primary', availability: { status: 'available' } },
  },
};

export const PermissionDenied: Story = {
  args: {
    variant: 'permission-denied',
    whatFailed: 'لا تملك صلاحية الوصول إلى هذا السجل.',
    guidance: 'يمكن الرجوع إلى الصفحة الرئيسية.',
  },
};

export const UnknownOutcome: Story = {
  args: {
    variant: 'unknown-outcome',
    whatFailed: 'تعذّر تأكيد وصول الطلب إلى الخادم.',
    stillTrue: 'لم يُفقد الطلب المُدخل.',
    guidance: 'سيتم التحقق من النتيجة الفعلية قبل السماح بإرسال جديد.',
  },
};
