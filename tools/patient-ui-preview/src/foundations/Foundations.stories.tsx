import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { AppText, Heading1, Heading2, Heading3, Heading4, Body, Label, Helper, Numeric, NumericStrong } from './Text';
import { chipVisual, color, type Tone } from '../theme/tokens';

const meta = {
  title: 'Patient/Foundations/Tokens',
  parameters: { a11y: { test: 'error' } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: Tone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'restricted'];

export const Typography: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 24, backgroundColor: color('surface.canvas') }}>
      <Heading1>عنوان رئيسي — Heading 1</Heading1>
      <Heading2>عنوان فرعي — Heading 2</Heading2>
      <Heading3>عنوان ثالثي — Heading 3</Heading3>
      <Heading4>عنوان رابع — Heading 4</Heading4>
      <Body>نص أساسي — Body. طول الجملة يعكس القراءة العربية الطبيعية بمسافة سطرية مريحة.</Body>
      <Label>تسمية حقل — Label</Label>
      <Helper>نص مساعد — Helper</Helper>
      <Numeric>١٢٣ → <NumericStrong>1234567</NumericStrong> (أرقام غربية دائمًا)</Numeric>
    </View>
  ),
};

export const ToneTriples: Story = {
  render: () => (
    <View style={{ gap: 8, padding: 24, backgroundColor: color('surface.canvas') }}>
      {TONES.flatMap((tone) =>
        (['muted', 'subtle', 'outline', 'solid'] as const).map((emphasis) => {
          const v = chipVisual(tone, emphasis);
          return (
            <View
              key={`${tone}-${emphasis}`}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 8,
                borderWidth: 1,
                borderColor: v.border,
                backgroundColor: v.background,
              }}
            >
              <AppText style={{ color: v.text }}>
                {tone} / {emphasis}
              </AppText>
            </View>
          );
        }),
      )}
    </View>
  ),
};
