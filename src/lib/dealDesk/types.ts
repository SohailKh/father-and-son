/**
 * Father & Son Deal Desk — shared types.
 *
 * The calculation engine (engine.ts) is pure and depends only on these types,
 * so it can later be lifted into a standalone commercial product without
 * touching the UI.
 */

export type County =
  | 'Orange'
  | 'Los Angeles'
  | 'Riverside'
  | 'San Bernardino'
  | 'San Diego'
  | 'Other';

export type PropertyType = 'SFR' | 'Condo' | 'Townhome' | '2-4 Units' | 'Other';
export type Occupancy = 'Vacant' | 'Owner' | 'Tenant';
export type Confidence = 'Low' | 'Medium' | 'High';
export type ArvCase = 'conservative' | 'expected' | 'aggressive';
export type RehabMethod = 'quick' | 'detailed';
export type RehabTier = 'cosmetic' | 'medium' | 'heavy' | 'gut';
export type PurchaseMethod = 'cash' | 'hardMoney';
export type InterestMethod = 'asDrawn' | 'fullBalance';
export type WholesaleMethod = 'assignment' | 'doubleClose';
export type EndBuyerMethod = 'rule' | 'model' | 'lower';
export type Exit = 'flip' | 'wholesale';
export type Verdict = 'BUY' | 'REVIEW' | 'PASS';

export type DealStatus =
  | 'Lead'
  | 'Offer Made'
  | 'Under Contract'
  | 'Assigned'
  | 'Rehab'
  | 'Listed'
  | 'Sold'
  | 'Dead';

export interface RehabLine {
  id: string;
  category: string;
  amount: number;
  note?: string;
}

export interface Comp {
  id: string;
  address: string;
  price: number;
  sqft: number;
  soldDaysAgo?: number;
}

export interface DealInputs {
  // Property & lead
  address: string;
  city: string;
  county: County;
  propertyType: PropertyType;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
  occupancy: Occupancy;
  leadSource: string;
  sellerMotivation: 1 | 2 | 3 | 4 | 5;
  sellerAsking: number;
  notes: string;

  // The price we are evaluating (contract / offer price)
  purchasePrice: number;

  // Valuation
  arvConservative: number;
  arvExpected: number;
  arvAggressive: number;
  asIsValue: number;
  arvConfidence: Confidence;
  comps: Comp[];

  // Rehab
  rehabMethod: RehabMethod;
  rehabTier: RehabTier;
  rehabPerSqft: number; // used when quick
  rehabLines: RehabLine[]; // used when detailed
  rehabRevisedEstimate: number; // Dad's walk-through number; 0 = not yet
  contingencyPct: number; // 0.10 = 10%
  rehabMonths: number;
  marketingMonths: number; // list-to-close

  // Acquisition costs
  buyerClosingPct: number;
  buyerClosingFixed: number;

  // Financing
  purchaseMethod: PurchaseMethod;
  purchaseLtcPct: number; // % of purchase price financed
  rehabFundedPct: number; // % of rehab financed
  maxLtarvPct: number; // lender cap on total loan vs ARV
  annualRate: number;
  points: number; // 0.02 = 2 points
  lenderFees: number;
  interestMethod: InterestMethod;
  loanTermMonths: number;
  extensionMonths: number;
  extensionFeePct: number;

  // Holding (monthly unless noted)
  taxRatePct: number; // annual, on purchase price (CA reassessment)
  taxAnnualOverride: number; // 0 = use rate
  insuranceMonthly: number;
  utilitiesMonthly: number;
  hoaMonthly: number;
  maintenanceMonthly: number;
  otherMonthly: number;

  // Sale
  commissionPct: number;
  sellerClosingPct: number;
  concessionsPct: number;
  stagingCost: number;

  // Wholesale
  wholesaleMethod: WholesaleMethod;
  emd: number;
  endBuyerArvCase: ArvCase;
  endBuyerRehabPadPct: number; // buyers pad our scope
}

export interface ScenarioDef {
  id: string;
  label: string;
  arvPct: number; // -0.05 = ARV down 5%
  rehabPct: number; // +0.10 = rehab up 10%
  extraMonths: number;
}

export interface Settings {
  passcodeHint: string;
  homeMarketCounties: County[];

  // Flip minimums (0 disables a test)
  minFlipProfit: number;
  targetFlipProfit: number;
  minFlipMarginPct: number; // profit / sale price
  minCashOnCashPct: number;
  minAnnualizedPct: number;
  downsideFloorProfit: number; // conservative-case profit must be >= this
  requireDownside: boolean;

  // Wholesale
  minWholesaleFee: number;
  targetWholesaleFee: number;
  downsideFloorFee: number;
  wholesaleTransactionCost: number;
  doubleCloseCostPct: number;
  marketingCostPerDeal: number;
  wholesaleDaysToClose: number;

  // End buyer model
  endBuyerMethod: EndBuyerMethod;
  buyerArvFactorPct: number; // the "70% rule" factor
  buyerMinProfitPctOfArv: number; // for model-implied buyer price

  // Flip vs wholesale preference
  minIncrementalFlipProfit: number; // flip must beat wholesale by at least this
  minIncrementalReturnOnCash: number; // ...or this % of the cash a flip ties up
  outsideMarketPremium: number; // multiplier on both thresholds outside home counties

  // Negotiation
  openingDiscountPct: number; // opening offer below target price
  roundTo: number;

  // Quick rehab $/sqft tiers
  rehabTiers: Record<RehabTier, number>;

  scenarios: ScenarioDef[];
}

export interface Actuals {
  purchasePrice: number;
  closeDate: string;
  rehabCost: number;
  holdMonths: number;
  financingCost: number;
  holdingCost: number;
  salePrice: number;
  sellingCost: number;
  assignmentFee: number;
  soldDate: string;
  lessons: string;
}

export interface Deal {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: DealStatus;
  exitTaken: Exit | null;
  inputs: DealInputs;
  actuals: Actuals;
}

// ─── Engine outputs ────────────────────────────────────────────────────────

export interface LoanSizing {
  purchaseLoan: number;
  rehabLoan: number;
  totalLoan: number;
  ltarvCapApplied: boolean;
  maxLoan: number;
}

export interface FlipResult {
  purchasePrice: number;
  arv: number;
  salePrice: number;
  rehabBudget: number; // scope incl. contingency, scenario-adjusted
  rehabMonths: number;
  holdMonths: number;

  loan: LoanSizing;
  acquisitionCosts: number;
  pointsCost: number;
  lenderFees: number;
  interest: number;
  extensionFees: number;
  extensions: number;
  financingCost: number;

  taxesAnnual: number;
  holdingMonthly: number;
  holdingCost: number;

  commission: number;
  sellerClosing: number;
  concessions: number;
  staging: number;
  sellingCost: number;

  totalBasis: number; // all-in before selling costs
  totalProjectCost: number;
  netProfit: number;
  marginPct: number;
  cashRequired: number;
  cashOnCash: number;
  annualized: number;
  monthlyBurn: number;
  breakEvenSalePrice: number;
  seventyRuleMax: number;
}

export interface WholesaleResult {
  contractPrice: number;
  buyerArv: number;
  buyerRehab: number;
  buyerMaoRule: number;
  buyerMaoModel: number;
  endBuyerPrice: number;
  grossFee: number;
  transactionCost: number;
  doubleCloseCost: number;
  marketingCost: number;
  netProfit: number;
  cashExposure: number;
  daysToClose: number;
  annualized: number;
}

export interface Check {
  label: string;
  pass: boolean;
  actual: number;
  required: number;
  kind: 'money' | 'pct';
}

export interface ExitEvaluation {
  exit: Exit;
  verdict: Verdict;
  baseChecks: Check[];
  downsideChecks: Check[];
  reasons: string[];
}

export interface ScenarioRow {
  def: ScenarioDef;
  flip: FlipResult;
  wholesale: WholesaleResult;
}

export interface OfferLadder {
  exit: Exit;
  opening: number;
  target: number;
  walkAway: number;
  room: number; // walkAway - opening
}

export interface Recommendation {
  exit: Exit | null; // null = pass at this price
  verdict: Verdict;
  headline: string;
  reasons: string[];
  offer: OfferLadder;
  flipWalkAway: number;
  wholesaleWalkAway: number;
  absoluteCeiling: number;
  askingVsCeiling: number; // sellerAsking - absoluteCeiling (positive = gap)
}

export interface Analysis {
  rehabBudget: number;
  rehabScope: number;
  contingency: number;
  homeMarket: boolean;
  flip: FlipResult;
  wholesale: WholesaleResult;
  flipEval: ExitEvaluation;
  wholesaleEval: ExitEvaluation;
  scenarios: ScenarioRow[];
  flipMao: { min: number; target: number; downside: number };
  wholesaleMao: { min: number; target: number };
  recommendation: Recommendation;
  sensitivity: { arvPcts: number[]; rehabPcts: number[]; profit: number[][] };
}
