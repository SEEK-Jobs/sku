import { ComponentType } from 'react';

interface RenderAppProps {
  routeName: string;
  route: string;
  environment: string;
  site: string;
  libraryName: string;
  SkuProvider: ComponentType;
  // Webpack use an any here. PR for better type welcome.
  webpackStats: any;
}

interface RenderDocumentProps<App> extends RenderAppProps {
  app: App;
  headTags: string;
  bodyTags: string;
}

export interface Render<App = string> {
  renderApp(p: RenderAppProps): Promise<App> | App;

  provideClientContext?(p: {
    environment: string;
    site: string;
    app: App;
  }): Promise<any> | any;

  renderDocument(p: RenderDocumentProps<App>): Promise<string> | string;
}
