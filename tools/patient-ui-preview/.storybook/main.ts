import { fileURLToPath, URL } from 'node:url';
import type { StorybookConfig } from '@storybook/react-native-web-vite';
import { mergeConfig } from 'vite';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const uxTokens = fileURLToPath(new URL('../../../docs/ux/03-system/design_tokens', import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      resolve: { alias: { '@ux-tokens': uxTokens } },
      server: { fs: { allow: [repoRoot] } },
    });
  },
};

export default config;
