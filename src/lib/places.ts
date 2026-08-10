/**
 * Real-world entity links for every place we claim to serve.
 *
 * Schema.org `sameAs` pointing at Wikipedia/Wikidata is how you tell Google the
 * "Orange" in `areaServed` is the city in Orange County, not the fruit or the
 * county. Market My Market called this out specifically: expand the schema with
 * service areas and Wikipedia links for locations.
 *
 * Keyed by the slugs in cities.ts and the county names those cities carry, so
 * the two files can't describe different places.
 */

const WIKI = 'https://en.wikipedia.org/wiki';
const DATA = 'https://www.wikidata.org/wiki';

interface PlaceRef {
  sameAs: string[];
}

/** Counties (and the state) we serve, keyed by the exact name used in schema. */
const COUNTIES: Record<string, PlaceRef> = {
  California: { sameAs: [`${WIKI}/California`, `${DATA}/Q99`] },
  'Orange County': {
    sameAs: [`${WIKI}/Orange_County,_California`, `${DATA}/Q5925`],
  },
  'Los Angeles County': {
    sameAs: [`${WIKI}/Los_Angeles_County,_California`, `${DATA}/Q104994`],
  },
  'Riverside County': {
    sameAs: [`${WIKI}/Riverside_County,_California`],
  },
  'San Bernardino County': {
    sameAs: [`${WIKI}/San_Bernardino_County,_California`, `${DATA}/Q108053`],
  },
};

/** Cities, keyed by the slug in cities.ts. */
const CITIES: Record<string, PlaceRef> = {
  anaheim: { sameAs: [`${WIKI}/Anaheim,_California`] },
  'santa-ana': { sameAs: [`${WIKI}/Santa_Ana,_California`] },
  irvine: { sameAs: [`${WIKI}/Irvine,_California`] },
  'huntington-beach': { sameAs: [`${WIKI}/Huntington_Beach,_California`] },
  'garden-grove': { sameAs: [`${WIKI}/Garden_Grove,_California`] },
  fullerton: { sameAs: [`${WIKI}/Fullerton,_California`] },
  orange: { sameAs: [`${WIKI}/Orange,_California`] },
  'costa-mesa': { sameAs: [`${WIKI}/Costa_Mesa,_California`] },
  'long-beach': { sameAs: [`${WIKI}/Long_Beach,_California`] },
  torrance: { sameAs: [`${WIKI}/Torrance,_California`] },
  downey: { sameAs: [`${WIKI}/Downey,_California`] },
  compton: { sameAs: [`${WIKI}/Compton,_California`] },
  whittier: { sameAs: [`${WIKI}/Whittier,_California`] },
  carson: { sameAs: [`${WIKI}/Carson,_California`] },
  riverside: { sameAs: [`${WIKI}/Riverside,_California`] },
  corona: { sameAs: [`${WIKI}/Corona,_California`] },
  murrieta: { sameAs: [`${WIKI}/Murrieta,_California`] },
  temecula: { sameAs: [`${WIKI}/Temecula,_California`] },
  eastvale: { sameAs: [`${WIKI}/Eastvale,_California`] },
  'san-bernardino': { sameAs: [`${WIKI}/San_Bernardino,_California`] },
  ontario: { sameAs: [`${WIKI}/Ontario,_California`] },
  'rancho-cucamonga': { sameAs: [`${WIKI}/Rancho_Cucamonga,_California`] },
};

/** The four counties we serve, in the order we list them everywhere. */
export const SERVED_COUNTIES = [
  'Orange County',
  'Los Angeles County',
  'Riverside County',
  'San Bernardino County',
] as const;

/** An `AdministrativeArea` node for a county, with its real-world entity links. */
export function countyAreaNode(name: string) {
  return {
    '@type': 'AdministrativeArea',
    name,
    containedInPlace: {
      '@type': 'State',
      name: 'California',
      sameAs: COUNTIES.California.sameAs,
    },
    ...(COUNTIES[name] ? { sameAs: COUNTIES[name].sameAs } : {}),
  };
}

/** Every county we serve, as `areaServed` nodes. */
export function servedCountyNodes() {
  return SERVED_COUNTIES.map(countyAreaNode);
}

/** A `City` node nested under its county, with entity links on both. */
export function cityAreaNode(slug: string, name: string, county: string) {
  return {
    '@type': 'City',
    name,
    containedInPlace: countyAreaNode(county),
    ...(CITIES[slug] ? { sameAs: CITIES[slug].sameAs } : {}),
  };
}

/**
 * The full Southern California service area as a single `Place`: state →
 * counties → cities, every level linked to its real-world entity. Referenced by
 * `@id` from the homepage business node.
 */
export function serviceAreaPlace(
  site: string,
  cities: { slug: string; name: string; county: string }[]
) {
  return {
    '@type': 'Place',
    '@id': `${site}/#serviceArea`,
    name: 'Southern California Service Area',
    containsPlace: [
      {
        '@type': 'State',
        name: 'California',
        sameAs: COUNTIES.California.sameAs,
      },
      ...servedCountyNodes(),
      ...cities.map((c) => cityAreaNode(c.slug, c.name, c.county)),
    ],
  };
}
