import React from 'react';
import { renderToString } from 'react-dom/server';
import dedent from 'dedent';
import App from './app';

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
        <div id="app" data-message="${app}"></div>
        ${bodyTags}
      </body>
    </html>
  `
};
