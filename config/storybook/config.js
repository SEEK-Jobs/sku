import { configure, addParameters } from '@storybook/react';
import 'storybook-chromatic';

addParameters({
  chromatic: { viewports: [320, 1200] }
});

const reqs = [
  // These values are defined in `webpack.config.js` in this
  // directory, along with a comment explaining the reasoning.
  require.context(__SKU_SRC_PATHS_0__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_1__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_2__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_3__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_4__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_5__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_6__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_7__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_8__, true, /\.stories\.js$/),
  require.context(__SKU_SRC_PATHS_9__, true, /\.stories\.js$/)
];

function loadStories() {
  reqs.forEach(req => {
    req.keys().forEach(filename => req(filename));
  });
}

configure(loadStories, module);
