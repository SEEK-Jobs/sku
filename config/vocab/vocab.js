const { languages } = require('../../context');
const log = require('debug')('sku:vocab:config');

const getVocabConfig = () => {
  if (!languages) {
    log('No languagages set. Skipping vocab');
    return null;
  }
  const result = {
    devLanguage: 'en',
    languages,
  };
  log('Using Vocab options:', result);
  return result;
};

module.exports = { getVocabConfig };
