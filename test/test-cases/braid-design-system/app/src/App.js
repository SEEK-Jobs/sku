import React from 'react';
import loadable from '../../../../../@loadable/component';

import { ThemeProvider, Text, Checkbox, Card } from 'braid-design-system';

const Theme = loadable.lib(({ themeName }) => import(`./themes/${themeName}`));

export default ({ theme: themeName }) => (
  <Theme themeName={themeName}>
    {({ default: theme }) => (
      <ThemeProvider theme={theme}>
        <Text>Hello {themeName}</Text>
        <Card>
          <Checkbox
            checked={false}
            id="id_1"
            label="This is a checkbox"
            message={false}
          />
          <Checkbox
            checked={false}
            id="id_2"
            label="This is a checkbox"
            message={false}
          />
          <Checkbox
            checked={false}
            id="id_3"
            label="This is a checkbox"
            message={false}
          />
        </Card>
      </ThemeProvider>
    )}
  </Theme>
);
