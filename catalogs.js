'use strict';

// Doc Vault catalog configuration.
//
// Every catalog is a row on the Stremio home screen, so keep the list short.
// Categories that don't need their own row belong in a type's filters, which
// Stremio shows as a dropdown in Discover. Catalogs and filters both match an
// item when it carries any of their tags; a catalog with no tags matches all.
// Era filters match by years instead: each title belongs to the one decade
// of its heyday (see catalog-query.js).
// Toggle a catalog by changing only its enabled value.

const MEDIA_TYPES = ['series', 'movie'];

const KNOWN_TAGS = [
  'biography',
  'film-tv',
  'food-travel',
  'history-war',
  'music',
  'nature',
  'science-space',
  'society',
  'sports',
  'true-crime',
];

// Each type only offers filters with enough titles to browse (roughly 10 or
// more). Add a topic to a type once it has grown past that.
const NATURE = { name: 'Nature & Wildlife', tags: ['nature'] };
const TRUE_CRIME = { name: 'True Crime', tags: ['true-crime'] };
const HISTORY_WAR = { name: 'History & War', tags: ['history-war'] };
const BIOGRAPHY = { name: 'Biography', tags: ['biography'] };

const SERIES_FILTERS = [
  { name: 'Before 2010', years: [0, 2009] },
  { name: '2010s', years: [2010, 2019] },
  { name: '2020s', years: [2020, 2029] },
  NATURE,
  TRUE_CRIME,
  HISTORY_WAR,
  BIOGRAPHY,
];

const MOVIE_FILTERS = [
  { name: 'Before 2000', years: [0, 1999] },
  { name: '2000s', years: [2000, 2009] },
  { name: '2010s', years: [2010, 2019] },
  { name: '2020s', years: [2020, 2029] },
  NATURE,
  TRUE_CRIME,
  HISTORY_WAR,
  { name: 'Science & Space', tags: ['science-space'] },
  { name: 'Society & Politics', tags: ['society'] },
  { name: 'Music', tags: ['music'] },
  { name: 'Sports', tags: ['sports'] },
  { name: 'Film & TV', tags: ['film-tv'] },
  BIOGRAPHY,
];

const catalogs = [
  {
    id: 'doc-vault-series',
    name: 'Doc Vault Series',
    type: 'series',
    filters: SERIES_FILTERS,
    enabled: true,
  },
  {
    id: 'doc-vault-true-crime-series',
    name: 'True Crime Series',
    type: 'series',
    tags: ['true-crime'],
    enabled: true,
  },
  {
    id: 'doc-vault-films',
    name: 'Doc Vault Films',
    type: 'movie',
    filters: MOVIE_FILTERS,
    enabled: true,
  },
];

module.exports = {
  catalogs,
  KNOWN_TAGS,
  MEDIA_TYPES,
};
