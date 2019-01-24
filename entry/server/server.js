import path from 'path';
import express from 'express';
import defaultClientEntry from '../../context/defaultClientEntry';
import makeExtractor from '../makeExtractor';
import serverExports from '__sku_alias__serverEntry'; // eslint-disable-line import/no-unresolved
import webpackStats from '__sku_alias__webpackStats'; // eslint-disable-line import/no-unresolved

const publicPath = __SKU_PUBLIC_PATH__; // eslint-disable-line no-undef

const serverOptions = serverExports({ publicPath });

const { renderCallback, middleware } = serverOptions;

const app = express();

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  app.use(express.static(path.join(__dirname, './')));
}

if (middleware) {
  app.use(middleware);
}
app.get('*', (...args) =>
  renderCallback(makeExtractor(webpackStats, defaultClientEntry), ...args)
);

export default app;
