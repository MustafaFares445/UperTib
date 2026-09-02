import { Text, View } from 'react-native';
import { tokenSources } from '../theme/tokenSources';

export function Readiness() {
  return (
    <View accessibilityRole="summary" style={{ minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#ffffff' }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '600', writingDirection: 'rtl' }}>
        UberTib Patient UI Preview
      </Text>
      <Text style={{ marginTop: 12, fontSize: 16, writingDirection: 'rtl', textAlign: 'center' }}>
        بيئة العرض جاهزة. هذه الصفحة فحص تقني فقط وليست واجهة منتج معتمدة.
      </Text>
      <Text style={{ marginTop: 8, fontSize: 14, writingDirection: 'ltr' }}>
        Canonical token sources loaded: {Object.keys(tokenSources).length}
      </Text>
    </View>
  );
}
