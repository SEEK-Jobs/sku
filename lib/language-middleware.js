const debug = require('debug');

const routeMatcher = require('../lib/routeMatcher');
const { languages, sites } = require('../context');

const log = debug('sku:language-middleware');

function getLanguagesToRender(route) {
  const routeIsForSpecificSite = typeof route.siteIndex === 'number';
  let languagesToRender = [null];
  if (languages) {
    if (routeIsForSpecificSite) {
      languagesToRender = sites[route.siteIndex].languages || languages;
    } else {
      languagesToRender = languages;
    }
  }
  return languagesToRender;
}

const LANGUAGE_NAMED_PARAM = 'language';

function getLanguageParamFromUrl(url, route) {
  const { params } = routeMatcher(route)(url);

  return params[LANGUAGE_NAMED_PARAM];
}

export function getLanguageFromRoute(req, route) {
  log('Looking for language in URL', req.url);
  const requestedLanguageByRoute = getLanguageParamFromUrl(
    req.url,
    route.route,
  );
  if (requestedLanguageByRoute) {
    log('Returning language in URL', requestedLanguageByRoute);
    return requestedLanguageByRoute;
  }

  const requestedLanguageByCookie = req.cookies['override-language'];
  if (requestedLanguageByCookie) {
    log('Returning language in URL', requestedLanguageByRoute);
    return requestedLanguageByCookie;
  }

  const supportedLanguagesForRoute = getLanguagesToRender(route);
  const requestedLanguageByHeader = req.acceptsLanguages(
    supportedLanguagesForRoute,
  );
  log(
    'Looking for language in header with supported langauges',
    supportedLanguagesForRoute,
  );
  if (requestedLanguageByHeader) {
    log('Returning language from header', requestedLanguageByRoute);
    return requestedLanguageByHeader;
  }

  return 'en';
}
