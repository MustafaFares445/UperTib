import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { ValidationField } from './ValidationField';

const meta = {
  title: 'Patient/Components/WGT-PLATFORM-010 Validation field',
  component: ValidationField,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ValidationField>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

export const Default: Story = {
  args: { label: 'رقم الهاتف', value: '0912345678', onChangeText: noop },
  render: () => {
    const [value, setValue] = useState('0912345678');
    return <ValidationField label="رقم الهاتف" value={value} onChangeText={setValue} keyboardType="phone-pad" />;
  },
};

export const WithFieldBoundError: Story = {
  args: { label: 'رقم الهاتف', value: '123', onChangeText: noop },
  render: () => {
    const [value, setValue] = useState('123');
    return (
      <ValidationField
        label="رقم الهاتف"
        value={value}
        onChangeText={setValue}
        keyboardType="phone-pad"
        error="أدخل رقم هاتف سوري صالحًا يبدأ بـ 09 ويتكوّن من 10 أرقام."
      />
    );
  },
};

export const WithHelper: Story = {
  args: { label: 'رمز التحقق', value: '', onChangeText: noop },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <ValidationField label="رمز التحقق" value={value} onChangeText={setValue} keyboardType="number-pad" maxLength={6} helper="أدخل الرمز المكوّن من 6 أرقام المُرسَل إليك." />
    );
  },
};
