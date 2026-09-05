import type { Actuals, Deal, DealInputs, Settings } from './types.ts';
import { uid } from './format.ts';

/**
 * Father & Son default operating assumptions. Every value here is editable in
 * the Settings panel; these are the starting points, not hard-coded rules.
 */
export const DEFAULT_SETTINGS: Settings = {
  passcodeHint: '',
  homeMarketCounties: ['Orange'],

  minFlipProfit: 75_000,
  targetFlipProfit: 100_000,
  minFlipMarginPct: 0.1,
  minCashOnCashPct: 0.2,
  minAnnualizedPct: 0.25,
  downsideFloorProfit: 25_000,
  requireDownside: true,

  minWholesaleFee: 15_000,
  targetWholesaleFee: 25_000,
  downsideFloorFee: 5_000,
  wholesaleTransactionCost: 1_000,
  doubleCloseCostPct: 0.025,
  marketingCostPerDeal: 0,
  wholesaleDaysToClose: 30,

  endBuyerMethod: 'lower',
  buyerArvFactorPct: 0.72,
  buyerMinProfitPctOfArv: 0.1,

  minIncrementalFlipProfit: 50_000,
  minIncrementalReturnOnCash: 0.15,
  outsideMarketPremium: 1.5,

  openingDiscountPct: 0.06,
  roundTo: 1_000,

  rehabTiers: {
    cosmetic: 35,
    medium: 60,
    heavy: 95,
    gut: 150,
  },

  scenarios: [
    { id: 'base', label: 'Base', arvPct: 0, rehabPct: 0, extraMonths: 0 },
    { id: 'conservative', label: 'Conservative', arvPct: -0.05, rehabPct: 0.1, extraMonths: 2 },
    { id: 'severe', label: 'Severe', arvPct: -0.1, rehabPct: 0.2, extraMonths: 4 },
  ],
};

export const REHAB_CATEGORIES = [
  'Demo & haul-off',
  'Kitchen',
  'Bathrooms',
  'Flooring',
  'Paint (int/ext)',
  'Roof',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Windows & doors',
  'Exterior & landscaping',
  'Structural / foundation',
  'Permits & professional fees',
  'Other',
];

export const LEAD_SOURCES = [
  'Website',
  'TikTok / Social',
  'Referral',
  'Direct mail',
  'Cold call',
  'Wholesaler',
  'Agent',
  'Driving for dollars',
  'Other',
];

export function defaultInputs(settings: Settings = DEFAULT_SETTINGS): DealInputs {
  return {
    address: '',
    city: '',
    county: 'Orange',
    propertyType: 'SFR',
    sqft: 0,
    beds: 3,
    baths: 2,
    yearBuilt: 0,
    occupancy: 'Owner',
    leadSource: 'Website',
    sellerMotivation: 3,
    sellerAsking: 0,
    notes: '',

    purchasePrice: 0,

    arvConservative: 0,
    arvExpected: 0,
    arvAggressive: 0,
    asIsValue: 0,
    arvConfidence: 'Medium',
    comps: [],

    rehabMethod: 'quick',
    rehabTier: 'medium',
    rehabPerSqft: settings.rehabTiers.medium,
    rehabLines: REHAB_CATEGORIES.map((category) => ({ id: uid(), category, amount: 0 })),
    rehabRevisedEstimate: 0,
    contingencyPct: 0.1,
    rehabMonths: 4,
    marketingMonths: 3,

    buyerClosingPct: 0.0075,
    buyerClosingFixed: 1_500,

    purchaseMethod: 'hardMoney',
    purchaseLtcPct: 0.9,
    rehabFundedPct: 1.0,
    maxLtarvPct: 0.7,
    annualRate: 0.11,
    points: 0.02,
    lenderFees: 1_995,
    interestMethod: 'asDrawn',
    loanTermMonths: 12,
    extensionMonths: 3,
    extensionFeePct: 0.01,

    taxRatePct: 0.0115,
    taxAnnualOverride: 0,
    insuranceMonthly: 175,
    utilitiesMonthly: 250,
    hoaMonthly: 0,
    maintenanceMonthly: 150,
    otherMonthly: 0,

    commissionPct: 0.05,
    sellerClosingPct: 0.01,
    concessionsPct: 0.01,
    stagingCost: 4_000,

    wholesaleMethod: 'assignment',
    emd: 5_000,
    endBuyerArvCase: 'expected',
    endBuyerRehabPadPct: 0.1,
  };
}

export function emptyActuals(): Actuals {
  return {
    purchasePrice: 0,
    closeDate: '',
    rehabCost: 0,
    holdMonths: 0,
    financingCost: 0,
    holdingCost: 0,
    salePrice: 0,
    sellingCost: 0,
    assignmentFee: 0,
    soldDate: '',
    lessons: '',
  };
}

export function newDeal(settings: Settings = DEFAULT_SETTINGS): Deal {
  const now = new Date().toISOString();
  return {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    status: 'Lead',
    exitTaken: null,
    inputs: defaultInputs(settings),
    actuals: emptyActuals(),
  };
}
