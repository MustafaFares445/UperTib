import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-009 Empty state',
  component: EmptyState,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoData: Story = {
  args: {
    variant: 'no-data',
    icon: 'document-text',
    statement: 'لا يوجد مقدّمو خدمة متاحون لهذه الخدمة حاليًا.',
    reason: 'يمكن اختيار خدمة أخرى أو المحاولة لاحقًا.',
  },
};

export const FilteredEmpty: Story = {
  args: {
    variant: 'filtered-empty',
    icon: 'magnifying-glass',
    statement: 'لا نتائج تطابق معايير البحث الحالية.',
    reason: 'عدّل الخدمة أو المنطقة المختارة، أو امسح الفلتر.',
    action: { key: 'clear', label: 'مسح الفلتر', role: 'secondary', availability: { status: 'available' } },
  },
};
