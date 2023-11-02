import type { Preview } from '@storybook/react';
import { useMemo } from 'react';
import {themeLight, themeDark, themeLightColorblind, themeDarkColorblind} from '../app/theme';
import { ThemeProvider, CssBaseline } from '@mui/material';
import React from 'react'
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
import ReferenceGrid from './blocks/ReferenceGrid';
import ComparisonGrid from './blocks/ComparisonGrid';

const themes = {
  light: themeLight,
  light_cb: themeLightColorblind,
  dark: themeDark,
  dark_cb: themeDarkColorblind
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    title: 'Theme',
    description: 'Theme for your components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      dynamicTitle: true,
      items: [
        { value: 'light', left: '☀️🌈', title: 'Light Mode' },
        { value: 'light_cb', left: '☀️🩶', title: 'Light Colorblind Mode' },
        { value: 'dark', left: '🌙🌈', title: 'Dark Mode' },
        { value: 'dark_cb', left: '🌙🩶', title: 'Dark Colorblind Mode' },
      ],
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <ComparisonGrid />
          <ReferenceGrid />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
};

export const withTheme = (Story: any, context: any) => {
  const { theme: themeKey } = context.globals;

  // Only recompute the theme if the themeKey changes.
  const theme = useMemo(() => themes[themeKey as keyof typeof themes] || themes['light'], [themeKey]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
}
export default preview;
export const decorators = [withTheme];