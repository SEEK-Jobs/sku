import React from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import { promisify } from 'util';
const writeFile = promisify(fs.writeFile);

import App from './App';

const initialResponseTemplate = ({ headTags, cspTag }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>hello-world</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${cspTag}
    ${headTags}
`;

const template = ({ headTags, bodyTags, app, extraScripts }) => `
      ${headTags}
    </head>
    <body>
      <div id="app">${app}</div>
      ${extraScripts.join('\n')}
      ${bodyTags}
    </body>
  </html>
`;

export default () => ({
  renderCallback: async (
    { SkuProvider, getBodyTags, flushHeadTags, csp },
    req,
    res,
  ) => {
    const extraScripts = [
      `<script src="https://code.jquery.com/jquery-3.5.0.slim.min.js"></script>`,
      `<script>console.log('Hi');</script>`,
    ];

    extraScripts.forEach((script) => csp.registerScript(script));

    res.status(200).write(
      initialResponseTemplate({
        headTags: flushHeadTags(),
        cspTag: csp.createCSPTag(),
      }),
    );
    res.flush();
    await Promise.resolve();

    const app = renderToString(
      <SkuProvider>
        <App />
      </SkuProvider>,
    );
    res.write(
      template({
        headTags: flushHeadTags(),
        bodyTags: getBodyTags(),
        app,
        extraScripts,
      }),
    );
    res.end();
  },
  onStart: async () => {
    if (process.env.NODE_ENV === 'production') {
      await writeFile('./started.txt', "Server started, here's your callback");
    }
  },
});
