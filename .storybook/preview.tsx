import type { Preview } from '@storybook/react';
import React, { useCallback } from 'react';
import ThemeWrapper from 'jrgcomponents/Theming/ThemeWrapper';
import theme from 'jrgcomponents/Theming/Sample';
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
import ReferenceGrid from 'jrgcomponents/Storybook/ReferenceGrid';
import ComparisonGrid from 'jrgcomponents/Storybook/ComparisonGrid';

export const globalTypes = {
  theme: {
    name: 'Default Theme',
    title: 'Default Theme',
    description: 'The theme that stories will start in. Changing this will also change the theme live.',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      dynamicTitle: true,
      items: [
        { value: 'light', left: '☀️🌈', title: 'Light Mode' },
        { value: 'lightColorblind', left: '☀️🩶', title: 'Light Colorblind Mode' },
        { value: 'dark', left: '🌙🌈', title: 'Dark Mode' },
        { value: 'darkColorblind', left: '🌙🩶', title: 'Dark Colorblind Mode' },
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
  // const theme = useMemo(() => themes[themeKey as keyof typeof themes] || themes['light'], [themeKey]);

  const themeChange = useCallback((dark, colorblind) => {
    context.globals.theme = `${dark ? 'dark' : 'light'}${colorblind ? 'Colorblind' : ''}`;
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      }}
    >
      <ThemeWrapper
        themeInjection={{ theme: theme }}
        defaultTheme={{ dark: themeKey.includes('dark'), colorblind: themeKey.includes('Colorblind') }}
        themeChangeCallback={themeChange}
      >
        <Story />
      </ThemeWrapper>
    </div>
  );
  /*
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Story />
      </div>
    </ThemeProvider>

  );
  */
};
export default preview;
export const decorators = [withTheme];
