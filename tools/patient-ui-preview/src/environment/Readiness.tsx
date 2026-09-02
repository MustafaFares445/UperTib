import { Text, View } from 'react-native';
import { tokenSources } from '../theme/tokenSources';

export function Readiness() {
  return (
    <main style={{ minHeight: '100%' }}>
      <View
        style={{
          minHeight: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          backgroundColor: '#ffffff',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          UberTib Patient UI Preview
        </h1>
        <Text
          style={{
            marginTop: 12,
            fontSize: 16,
            writingDirection: 'rtl',
            textAlign: 'center',
          }}
        >
          بيئة العرض جاهزة. هذه الصفحة فحص تقني فقط وليست واجهة منتج معتمدة.
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            writingDirection: 'ltr',
          }}
        >
          Canonical token sources loaded: {Object.keys(tokenSources).length}
        </Text>
      </View>
    </main>
  );
}
