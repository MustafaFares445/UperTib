import { Text as RNText, type TextProps } from 'react-native';
import { color, typeStyle } from '../theme/tokens';

type Variant =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'body'
  | 'body-strong'
  | 'label'
  | 'helper'
  | 'numeric'
  | 'numeric-strong';

interface Props extends TextProps {
  variant?: Variant;
  tone?: 'primary' | 'secondary' | 'disabled' | 'link' | 'onAction';
}

const TONE_PATH: Record<NonNullable<Props['tone']>, string> = {
  primary: 'text.primary',
  secondary: 'text.secondary',
  disabled: 'text.disabled',
  link: 'text.link',
  onAction: 'text.on-action',
};

/**
 * The single UI text primitive. Every surface uses one of the composite `semantic.type.*` styles;
 * a screen never assembles its own size/weight/leading (DESIGN_TOKENS.md typography rules).
 */
export function AppText({ variant = 'body', tone = 'primary', style, ...rest }: Props) {
  const t = typeStyle(variant);
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          fontWeight: t.fontWeight,
          lineHeight: t.lineHeight,
          letterSpacing: t.letterSpacing,
          color: color(TONE_PATH[tone]),
          textAlign: 'right',
          writingDirection: 'rtl',
        },
        style,
      ]}
    >
      {rest.children}
    </RNText>
  );
}

export const Heading1 = (props: Props) => <AppText {...props} variant="heading-1" />;
export const Heading2 = (props: Props) => <AppText {...props} variant="heading-2" />;
export const Heading3 = (props: Props) => <AppText {...props} variant="heading-3" />;
export const Heading4 = (props: Props) => <AppText {...props} variant="heading-4" />;
export const Body = (props: Props) => <AppText {...props} variant="body" />;
export const BodyStrong = (props: Props) => <AppText {...props} variant="body-strong" />;
export const Label = (props: Props) => <AppText {...props} variant="label" />;
export const Helper = (props: Props) => <AppText {...props} variant="helper" tone={props.tone ?? 'secondary'} />;
export const Numeric = (props: Props) => <AppText {...props} variant="numeric" />;
export const NumericStrong = (props: Props) => <AppText {...props} variant="numeric-strong" />;
