import dedent from 'dedent';
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './App';

export default {
  renderApp: () => renderToString(<App />),

  renderDocument: ({ app, bodyTags, headTags }) => dedent`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>hello-world</title>
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
