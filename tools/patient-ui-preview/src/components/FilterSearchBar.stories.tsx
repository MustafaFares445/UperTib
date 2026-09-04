import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { FilterSearchBar } from './FilterSearchBar';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-007 Filter search bar',
  component: FilterSearchBar,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof FilterSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'المنطقة داخل حلب (اختياري)', value: '', onChangeText: () => {} },
  render: () => {
    const [value, setValue] = useState('');
    return <FilterSearchBar label="المنطقة داخل حلب (اختياري)" value={value} onChangeText={setValue} placeholder="مثال: حلب الجديدة" />;
  },
};
