export interface CityData {
  slug: string;
  name: string;
  county: string;
  countySlug: string;
  state: string;
  description: string;
  neighborhoods: string[];
  situations: string[];
  blurb: string;
}

export const cities: CityData[] = [
  // Orange County
  {
    slug: 'anaheim',
    name: 'Anaheim',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Anaheim's diverse housing stock — from older ranch homes near Disneyland to newer builds in the hills — means sellers have a wide range of situations. We buy all of them.",
    neighborhoods: ['Anaheim Hills', 'Platinum Triangle', 'Colony Historic District', 'East Anaheim', 'West Anaheim'],
    situations: ['Inherited homes near Disneyland corridor', 'Landlords dealing with difficult tenants', 'Older homes needing major repairs', 'Divorce settlements requiring a quick sale'],
    blurb: "We've helped Anaheim homeowners from West Anaheim to Anaheim Hills move on quickly and fairly.",
  },
  {
    slug: 'santa-ana',
    name: 'Santa Ana',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Santa Ana is one of Orange County's most densely populated cities, with a rich mix of older homes, investment properties, and multi-family units. We buy houses in every condition.",
    neighborhoods: ['Floral Park', 'South Coast Metro', 'Artist Village', 'Willard', 'Lacy'],
    situations: ['Code violations and deferred maintenance', 'Multi-family properties with tenant issues', 'Probate and estate sales', 'Properties with liens or back taxes'],
    blurb: "From Floral Park Victorians to smaller bungalows citywide, we know Santa Ana real estate well.",
  },
  {
    slug: 'irvine',
    name: 'Irvine',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Irvine's planned communities and master-planned neighborhoods mean homes here hold value, but life changes don't wait. If you need to sell quickly, we can close on your timeline.",
    neighborhoods: ['Woodbridge', 'Northwood', 'Turtle Rock', 'Portola Springs', 'Great Park Neighborhoods', 'Quail Hill'],
    situations: ['Relocation for work', 'Divorce requiring fast resolution', 'Downsizing from a large family home', 'HOA disputes or delinquent dues'],
    blurb: "We work with Irvine homeowners across every village — offering speed and certainty in a market where timing matters.",
  },
  {
    slug: 'huntington-beach',
    name: 'Huntington Beach',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Surf City's coastal homes are in high demand, but not every seller has time for the traditional market. We make cash offers on Huntington Beach homes in any condition.",
    neighborhoods: ['Downtown HB', 'Huntington Harbour', 'South Huntington', 'Bolsa Chica', 'Central Park Estates'],
    situations: ['Older beach cottages needing full renovation', 'Inherited coastal properties', 'Sellers who need to close before summer', 'Flood zone or deferred-maintenance properties'],
    blurb: "We love Huntington Beach homes — from beach-close cottages to Harbour homes — and we make fair offers fast.",
  },
  {
    slug: 'garden-grove',
    name: 'Garden Grove',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Garden Grove has a large stock of 1950s–1970s homes that are often in need of updates. We buy them as-is, with zero repairs required from you.",
    neighborhoods: ['West Garden Grove', 'Historic Main Street', 'Brookhurst Area', 'Chapman Area'],
    situations: ['Original-owner estates being sold by heirs', 'Homes with outdated electrical, plumbing, or roofing', 'Landlords exiting the rental market', 'Families facing foreclosure'],
    blurb: "Garden Grove's older housing stock is our specialty — we make fair offers regardless of the home's condition.",
  },
  {
    slug: 'fullerton',
    name: 'Fullerton',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Fullerton blends historic neighborhoods with a strong college-town character. Whether you're dealing with a rental gone wrong or an estate sale, we can help.",
    neighborhoods: ['Downtown Fullerton', 'Sunny Hills', 'Raymond Hills', 'Fullerton Crest', 'Amerige Heights'],
    situations: ['Student rentals with deferred maintenance', 'Inherited properties from long-time Fullerton residents', 'Sellers needing to close before the fall semester', 'Distressed or fire-damaged homes'],
    blurb: "We've worked with Fullerton homeowners in every corner of the city, from the hills to the flats.",
  },
  {
    slug: 'orange',
    name: 'Orange',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "The City of Orange is known for its historic Old Towne and charming neighborhoods. We buy homes here in any condition — including properties that need significant work.",
    neighborhoods: ['Old Towne Orange', 'East Orange', 'Serrano Heights', 'Santiago Hills', 'Orange Hills'],
    situations: ['Historic homes with deferred maintenance', 'Estate sales from long-term residents', 'Homes with foundation or structural issues', 'Sellers avoiding the open-market hassle'],
    blurb: "From Old Towne bungalows to hillside homes, we make fair cash offers on Orange properties of all types.",
  },
  {
    slug: 'costa-mesa',
    name: 'Costa Mesa',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Costa Mesa's proximity to Newport Beach and South Coast Plaza makes it one of OC's most desirable markets — but sellers still face situations where speed matters more than a top-dollar listing.",
    neighborhoods: ['Eastside Costa Mesa', 'Mesa Verde', 'College Park', 'South Coast Metro', 'Westside Costa Mesa'],
    situations: ['Job relocation or overseas moves', 'Homes needing major repairs before listing', 'Divorce or partnership dissolution', 'Sellers who prefer privacy over open houses'],
    blurb: "We buy Costa Mesa homes quickly and fairly — no open houses, no contingencies, no wait.",
  },
  {
    slug: 'mission-viejo',
    name: 'Mission Viejo',
    county: 'Orange County',
    countySlug: 'orange-county',
    state: 'CA',
    description: "Mission Viejo is one of South Orange County's original master-planned communities, and many of its homes are still with their first owners. When those houses change hands, a traditional listing isn't always the right fit.",
    neighborhoods: ['Lake Mission Viejo', 'Casta del Sol', 'Palmia', 'Aegean Hills', 'Canyon Crest', 'Deerfield'],
    situations: ['Original-owner homes never updated since they were built', 'Estate and probate sales from 55+ communities', 'Downsizing on a fixed timeline', 'Homes with HOA or association complications'],
    blurb: "From Lake Mission Viejo to the 55+ communities off Marguerite, we buy Mission Viejo homes exactly as they sit.",
  },

  // LA County
  {
    slug: 'long-beach',
    name: 'Long Beach',
    county: 'Los Angeles County',
    countySlug: 'los-angeles-county',
    state: 'CA',
    description: "Long Beach is one of Southern California's largest cities, with a diverse mix of craftsman bungalows, mid-century homes, and investment properties. We buy them all as-is.",
    neighborhoods: ['Belmont Shore', 'Signal Hill', 'Bixby Knolls', 'Naples Island', 'East Village Arts District', 'Wrigley'],
    situations: ['Older craftsman homes needing full renovation', 'Landlords with problem tenants', 'Inherited or probate properties', 'Homes with storm or flood damage'],
    blurb: "We know Long Beach neighborhoods from Belmont Shore to Wrigley, and we make fair offers on every kind of home.",
  },
  {
    slug: 'torrance',
    name: 'Torrance',
    county: 'Los Angeles County',
    countySlug: 'los-angeles-county',
    state: 'CA',
    description: "Torrance's well-maintained neighborhoods and strong school district make it competitive — but when life demands a quick sale, we're ready to make a fair cash offer.",
    neighborhoods: ['Old Torrance', 'Southwood', 'North Torrance', 'West Torrance', 'Hollywood Riviera'],
    situations: ['Corporate relocation', 'Downsizing after kids leave', 'Inherited family homes', 'Sellers avoiding agent commissions'],
    blurb: "Whether it's a Hollywood Riviera view home or a North Torrance post-war bungalow, we make strong cash offers.",
  },
  {
    slug: 'downey',
    name: 'Downey',
    county: 'Los Angeles County',
    countySlug: 'los-angeles-county',
    state: 'CA',
    description: "Downey has a strong inventory of 1950s–1970s homes, many of which have passed through generations. We help heirs and longtime owners sell quickly without spending on repairs.",
    neighborhoods: ['North Downey', 'South Downey', 'Rio Hondo', 'Downey Landing Area'],
    situations: ['Estate sales from original Downey families', 'Homes with aging systems — HVAC, roof, plumbing', 'Landlords exiting rental market', 'Properties with code violations'],
    blurb: "Downey homeowners trust us to move fast and close fairly — no repairs, no fees, no drama.",
  },
  {
    slug: 'compton',
    name: 'Compton',
    county: 'Los Angeles County',
    countySlug: 'los-angeles-county',
    state: 'CA',
    description: "Compton is a community on the rise, and homeowners here deserve fair cash offers when they need to sell. We buy homes in any condition and close on your schedule.",
    neighborhoods: ['Richland Farms', 'North Compton', 'East Compton', 'Sunny Cove'],
    situations: ['Tax liens or delinquent property taxes', 'Homes with deferred maintenance', 'Heirs who live out of state', 'Sellers needing cash fast'],
    blurb: "We treat every Compton homeowner with respect — honest offers, no lowballing, and a fast close.",
  },
  {
    slug: 'whittier',
    name: 'Whittier',
    county: 'Los Angeles County',
    countySlug: 'los-angeles-county',
    state: 'CA',
    description: "Whittier's tree-lined streets and historic neighborhoods are beloved, but selling a home here doesn't have to be complicated. We make fast, fair cash offers with no strings attached.",
    neighborhoods: ['Uptown Whittier', 'East Whittier', 'South Whittier', 'Friendly Hills', 'Whittier Hills'],
    situations: ['Historic homes with deferred maintenance', 'Inherited family properties', 'Sellers who want to avoid open houses', 'Homes needing foundation or retrofit work'],
    blurb: "From Friendly Hills estates to Uptown bungalows, we love Whittier homes and make strong offers.",
  },
  {
    slug: 'carson',
    name: 'Carson',
    county: 'Los Angeles County',
    countySlug: 'los-angeles-county',
    state: 'CA',
    description: "Carson's central South Bay location makes it attractive, but sellers here sometimes need speed over a lengthy listing process. We buy Carson homes as-is for cash.",
    neighborhoods: ['North Carson', 'South Carson', 'Del Amo', 'Rancho Dominguez'],
    situations: ['Rental properties with difficult situations', 'Estate and probate sales', 'Homes near industrial areas with environmental concerns', 'Sellers in financial distress'],
    blurb: "We offer Carson homeowners a straightforward path to closing — no repairs, no agents, no waiting.",
  },

  // Inland Empire
  {
    slug: 'riverside',
    name: 'Riverside',
    county: 'Riverside County',
    countySlug: 'riverside-county',
    state: 'CA',
    description: "As the Inland Empire's largest city, Riverside has a wide range of housing — from historic Victorians near downtown to newer builds in the east. We buy all of it.",
    neighborhoods: ['Wood Streets', 'Mission Inn District', 'Orangecrest', 'La Sierra', 'Canyon Crest', 'Alessandro Heights'],
    situations: ['Historic homes requiring expensive upkeep', 'Probate and estate properties', 'Landlords ready to exit the rental market', 'Sellers facing job loss or financial hardship'],
    blurb: "We know Riverside inside out — from the Wood Streets Victorians to the Orangecrest suburbs. Fast offers, fair prices.",
  },
  {
    slug: 'san-bernardino',
    name: 'San Bernardino',
    county: 'San Bernardino County',
    countySlug: 'san-bernardino-county',
    state: 'CA',
    description: "San Bernardino homeowners dealing with difficult situations deserve a buyer who moves fast and treats them fairly. We buy homes here in any condition, on any timeline.",
    neighborhoods: ['Arrowhead Farms', 'Verdemont', 'Del Rosa', 'Muscoy', 'Highland area'],
    situations: ['Distressed or vacant properties', 'Tax delinquency and liens', 'Inherited homes out-of-state heirs need to liquidate', 'Homes with significant repair needs'],
    blurb: "We provide San Bernardino homeowners honest cash offers — no judgment, no pressure, just a fair deal.",
  },
  {
    slug: 'ontario',
    name: 'Ontario',
    county: 'San Bernardino County',
    countySlug: 'san-bernardino-county',
    state: 'CA',
    description: "Ontario's growing economy and convenient location make it a sought-after market. When you need to sell fast — for any reason — we're ready to make a cash offer.",
    neighborhoods: ['OP (Ontario-Pomona area)', 'Model Colony', 'North Ontario', 'South Ontario', 'East Ontario'],
    situations: ['Relocation near Ontario Airport', 'Investment properties owners want to exit', 'Homes with fire or water damage', 'Sellers avoiding the traditional listing process'],
    blurb: "Ontario homeowners: get a cash offer within 24 hours, close in as little as 14 days.",
  },
  {
    slug: 'corona',
    name: 'Corona',
    county: 'Riverside County',
    countySlug: 'riverside-county',
    state: 'CA',
    description: "Corona's position between Orange County and the Inland Empire makes it a perennial demand hotspot. We buy homes here at fair prices, with fast closings that work for your schedule.",
    neighborhoods: ['Eagle Glen', 'Dos Lagos', 'Lakeview Estates', 'Sierra del Oro', 'South Corona'],
    situations: ['Sellers relocating to or from OC', 'HOA delinquency issues', 'Newer homes sellers need to exit quickly', 'Divorce requiring fast resolution'],
    blurb: "Whether you're in a golf course community or a starter neighborhood, we make fast, fair offers in Corona.",
  },
  {
    slug: 'rancho-cucamonga',
    name: 'Rancho Cucamonga',
    county: 'San Bernardino County',
    countySlug: 'san-bernardino-county',
    state: 'CA',
    description: "Rancho Cucamonga consistently ranks as one of the Inland Empire's most desirable cities. When timing matters more than maxing out your listing price, we're the answer.",
    neighborhoods: ['Etiwanda', 'Alta Loma', 'Deer Creek', 'Victoria Gardens area', 'Northtown'],
    situations: ['Job transfers to or from the area', 'Sellers who want a private sale', 'Homes in gated communities', 'Upgrading or downsizing on a tight timeline'],
    blurb: "Rancho Cucamonga homeowners: skip the showings and sell on your terms with our cash offer.",
  },
  {
    slug: 'murrieta',
    name: 'Murrieta',
    county: 'Riverside County',
    countySlug: 'riverside-county',
    state: 'CA',
    description: "Murrieta is one of Southwest Riverside County's fastest-growing communities. When you need to sell your home here quickly, we provide a straightforward cash offer with no contingencies.",
    neighborhoods: ['Murrieta Hot Springs', 'Spencer\'s Crossing', 'Copper Canyon', 'Greer Ranch', 'Central Murrieta'],
    situations: ['Military relocations from nearby bases', 'Sellers upgrading to a larger home', 'New construction owners who need to sell their current home first', 'Distressed properties requiring full renovation'],
    blurb: "We serve Murrieta homeowners from Hot Springs Road to Greer Ranch — fair offers, fast closings.",
  },
  {
    slug: 'temecula',
    name: 'Temecula',
    county: 'Riverside County',
    countySlug: 'riverside-county',
    state: 'CA',
    description: "Wine country living meets suburban convenience in Temecula. Whether you're near the wineries or in a master-planned neighborhood, we'll make a fair cash offer on your home.",
    neighborhoods: ['Old Town Temecula', 'Redhawk', 'Paloma del Sol', 'Wolf Creek', 'Temeku Hills', 'Wine Country'],
    situations: ['Retirement and downsizing', 'Investment properties near Old Town', 'Sellers leaving the area for a different lifestyle', 'Estate homes being sold by heirs'],
    blurb: "From Old Town to the vineyards, we make fast cash offers on Temecula homes of every kind.",
  },
  {
    slug: 'eastvale',
    name: 'Eastvale',
    county: 'Riverside County',
    countySlug: 'riverside-county',
    state: 'CA',
    description: "Eastvale is one of the Inland Empire's newest and fastest-growing cities, known for its large family homes and tight-knit community. When life changes require a fast sale, we make fair cash offers on Eastvale homes in any condition.",
    neighborhoods: ['Cloverdale', 'Homecoming', 'Sycamore Creek', 'River Ranch', 'Eastvale Gateway area'],
    situations: ['Sellers relocating out of state', 'Larger homes that need significant repairs before listing', 'Divorce or financial hardship requiring a fast close', 'Homeowners who want to avoid the open-market hassle'],
    blurb: "We serve Eastvale homeowners across every neighborhood — fast cash offers, no repairs, close on your timeline.",
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export const citySlugs = cities.map((c) => c.slug);

/**
 * Returns up to 8 nearby cities for cross-linking SEO.
 * Priority: same-county cities first, then cross-county neighbors.
 * OC cities get all other OC cities first (primary market).
 */
export function getNearbyCities(currentSlug: string): CityData[] {
  const current = getCityBySlug(currentSlug);
  if (!current) return [];

  const MAX = 8;

  // Cross-county bridge slugs by county
  const crossCountyMap: Record<string, string[]> = {
    'Orange County': ['long-beach', 'corona'],
    'Los Angeles County': ['anaheim', 'santa-ana'],
    'Riverside County': ['corona', 'anaheim'],
    'San Bernardino County': ['corona', 'anaheim'],
  };

  // Same-county cities (excluding self)
  const sameCounty = cities.filter(
    (c) => c.county === current.county && c.slug !== currentSlug,
  );

  // Cross-county neighbors (excluding self and already-included same-county)
  const bridgeSlugs = crossCountyMap[current.county] ?? [];
  const sameCountySlugs = new Set(sameCounty.map((c) => c.slug));
  const crossCounty = bridgeSlugs
    .filter((s) => s !== currentSlug && !sameCountySlugs.has(s))
    .map((s) => getCityBySlug(s))
    .filter((c): c is CityData => c !== undefined);

  return [...sameCounty, ...crossCounty].slice(0, MAX);
}
