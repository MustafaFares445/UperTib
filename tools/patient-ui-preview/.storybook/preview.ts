import type { Preview } from '@storybook/react-native-web-vite';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    controls: { expanded: true },
    options: {
      storySort: {
        order: ['Environment', 'Patient', ['Foundations', 'Components', 'Widgets', 'Screens', 'Flows']],
      },
    },
  },
};

export default preview;
