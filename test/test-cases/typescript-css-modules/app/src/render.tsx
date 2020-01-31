import dedent from 'dedent';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from 'src/App';

import { Render } from '../../../../../sku-types';

const skuRender: Render = {
  renderApp: ({ SkuProvider }) =>
    renderToString(
      <SkuProvider>
        <App />
      </SkuProvider>,
    ),

  renderDocument: ({ app, headTags, bodyTags }) => dedent`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>My Awesome Project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${headTags}
      </head>
      <body>
        <div id="app">${app}</div>
        ${bodyTags}
      </body>
    </html>
  `,
};

export default skuRender;
