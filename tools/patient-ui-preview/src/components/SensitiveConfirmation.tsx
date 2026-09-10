import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { ActionBar, type ActionSpec } from './ActionBar';
import { Body, BodyStrong, Helper, Label } from '../foundations/Text';
import { borderWidth, color, radius, size, space, typeStyle } from '../theme/tokens';

export interface SensitiveConfirmationProps {
  actionLabel: string;
  effect: string;
  reversibility: string;
  subject: string;
  reasonRequired?: boolean;
  reasonLabel?: string;
  reasonGuidance?: string;
  onCancel: () => void;
  onConfirm: (reason?: string) => void;
  committing?: boolean;
}

/**
 * CMP-PLATFORM-014 — sensitive confirmation. The action label is identical on trigger and confirm,
 * the effect and reversibility are stated in words, and a required reason is captured before commit.
 */
export function SensitiveConfirmation({
  actionLabel,
  effect,
  reversibility,
  subject,
  reasonRequired = false,
  reasonLabel = 'سبب الإجراء',
  reasonGuidance,
  onCancel,
  onConfirm,
  committing = false,
}: SensitiveConfirmationProps) {
  const [reason, setReason] = useState('');
  const trimmedReason = reason.trim();
  const confirmAvailability: ActionSpec['availability'] = committing
    ? { status: 'loading' }
    : reasonRequired && !trimmedReason
      ? { status: 'disabled', reason: 'اكتب السبب المطلوب قبل تنفيذ الإجراء.' }
      : { status: 'available' };

  const actions: ActionSpec[] = [
    {
      key: 'cancel-confirmation',
      label: 'رجوع',
      role: 'secondary',
      availability: committing ? { status: 'disabled', reason: 'انتظر اكتمال الطلب الحالي.' } : { status: 'available' },
      onPress: onCancel,
    },
    {
      key: 'confirm-sensitive-action',
      label: actionLabel,
      role: 'destructive',
      availability: confirmAvailability,
      onPress: () => onConfirm(trimmedReason || undefined),
    },
  ];
  const bodyType = typeStyle('body');

  return (
    <View
      accessibilityRole="summary"
      style={{
        gap: space('stack-md'),
        padding: space('inset-lg'),
        borderRadius: radius('overlay'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.strong'),
        backgroundColor: color('surface.default'),
      }}
    >
      <View style={{ gap: space('stack-xs') }}>
        <BodyStrong>{actionLabel}</BodyStrong>
        <Body>{effect}</Body>
        <Helper>{reversibility}</Helper>
        <Helper>يشمل: {subject}</Helper>
      </View>

      {reasonRequired ? (
        <View style={{ gap: space('stack-xs') }}>
          <Label>{reasonLabel}</Label>
          <TextInput
            value={reason}
            onChangeText={setReason}
            accessibilityLabel={reasonLabel}
            accessibilityHint={reasonGuidance}
            multiline
            placeholder="اكتب السبب"
            placeholderTextColor={color('text.placeholder')}
            style={{
              minHeight: size('control-lg') * 2,
              paddingHorizontal: space('inset-md'),
              paddingVertical: space('inset-sm'),
              borderWidth: borderWidth('hairline'),
              borderColor: color('border.strong'),
              borderRadius: radius('control'),
              backgroundColor: color('surface.default'),
              color: color('text.primary'),
              textAlign: 'right',
              writingDirection: 'rtl',
              textAlignVertical: 'top',
              fontFamily: bodyType.fontFamily,
              fontSize: bodyType.fontSize,
              lineHeight: bodyType.lineHeight,
            }}
          />
          {reasonGuidance ? <Helper>{reasonGuidance}</Helper> : null}
        </View>
      ) : null}

      <ActionBar actions={actions} />
    </View>
  );
}
