'use strict';

const { catalogs } = require('./catalogs');
const { version } = require('./package.json');

function catalogExtras(catalog) {
  const extras = [{ name: 'skip', isRequired: false }];

  if (catalog.filters) {
    extras.push({
      name: 'genre',
      isRequired: false,
      options: catalog.filters.map((filter) => filter.name),
    });
  }

  return extras;
}

const enabledCatalogs = catalogs
  .filter((catalog) => catalog.enabled === true)
  .map((catalog) => ({
    type: catalog.type,
    id: catalog.id,
    name: catalog.name,
    extra: catalogExtras(catalog),
  }));

module.exports = {
  id: 'community.docvault.catalogs',
  version,
  name: 'Doc Vault',
  description:
    'The best documentaries ever made, from Planet Earth to The Last Dance, best-loved first. Browse by era or topic in Discover.',
  resources: [
    {
      name: 'catalog',
      types: ['series', 'movie'],
    },
  ],
  types: ['series', 'movie'],
  catalogs: enabledCatalogs,
  behaviorHints: {
    configurable: false,
    configurationRequired: false,
  },
};
