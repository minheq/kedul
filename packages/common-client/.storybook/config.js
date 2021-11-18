import './index.css';

import { addDecorator, configure } from '@storybook/react';
import { Box, LayoutProvider, ThemeProvider } from 'paramount-ui';
import React from 'react';

import { I18nProvider } from '../i18n/I18nProvider';

const Decorator = story => {
  return (
    <I18nProvider>
      <ThemeProvider>
        <LayoutProvider>
          <Box flex={1}>{story()}</Box>
        </LayoutProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};

addDecorator(Decorator);

// automatically import all files ending in *.stories.tsx
const req = require.context('..', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
