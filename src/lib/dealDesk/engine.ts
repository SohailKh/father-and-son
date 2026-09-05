/**
 * Father & Son Deal Desk — calculation engine.
 *
 * Pure functions only. Given DealInputs + Settings, produces the flip model,
 * wholesale model, scenario table, offer solver output and a transparent
 * flip-vs-wholesale recommendation. No React, no storage, no DOM.
 */

import type {
  Analysis,
  ArvCase,
  Check,
  DealInputs,
  Exit,
  ExitEvaluation,
  FlipResult,
  LoanSizing,
  OfferLadder,
  Recommendation,
  ScenarioDef,
  ScenarioRow,
  Settings,
  Verdict,
  WholesaleResult,
} from './types.ts';
import { fmtMoney, fmtPct, roundDownTo } from './format.ts';

// ─── Rehab ────────────────────────────────────────────────────────────────

/** Rehab scope before contingency. Dad's revised estimate wins when present. */
export function rehabScope(inputs: DealInputs): number {
  if (inputs.rehabRevisedEstimate > 0) return inputs.rehabRevisedEstimate;
  if (inputs.rehabMethod === 'detailed') {
    return inputs.rehabLines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  }
  return (inputs.sqft || 0) * (inputs.rehabPerSqft || 0);
}

export function rehabBudget(inputs: DealInputs): number {
  return rehabScope(inputs) * (1 + (inputs.contingencyPct || 0));
}

export function arvFor(inputs: DealInputs, c: ArvCase): number {
  const v =
    c === 'conservative'
      ? inputs.arvConservative
      : c === 'aggressive'
        ? inputs.arvAggressive
        : inputs.arvExpected;
  // Fall back to expected so a half-filled deal still computes.
  return v > 0 ? v : inputs.arvExpected;
}

// ─── Flip ─────────────────────────────────────────────────────────────────

export interface FlipOpts {
  purchasePrice?: number;
  arv?: number; // sale price assumption (scenario-adjusted)
  rehabBudget?: number; // scenario-adjusted budget incl. contingency
  extraMonths?: number; // delay added after rehab (full balance drawn)
  loanArv?: number; // lender's ARV for LTARV cap (default: expected ARV)
  loanRehab?: number; // rehab the lender underwrote (default: base budget)
}

function sizeLoan(inputs: DealInputs, purchasePrice: number, loanRehab: number, loanArv: number): LoanSizing {
  if (inputs.purchaseMethod === 'cash') {
    return { purchaseLoan: 0, rehabLoan: 0, totalLoan: 0, ltarvCapApplied: false, maxLoan: 0 };
  }
  let purchaseLoan = purchasePrice * inputs.purchaseLtcPct;
  let rehabLoan = loanRehab * inputs.rehabFundedPct;
  const maxLoan = loanArv * inputs.maxLtarvPct;
  let capApplied = false;
  let excess = purchaseLoan + rehabLoan - maxLoan;
  if (excess > 0) {
    capApplied = true;
    // Lenders cut the rehab holdback first, then the purchase advance.
    const cutRehab = Math.min(excess, rehabLoan);
    rehabLoan -= cutRehab;
    excess -= cutRehab;
    if (excess > 0) purchaseLoan = Math.max(0, purchaseLoan - excess);
  }
  return {
    purchaseLoan,
    rehabLoan,
    totalLoan: purchaseLoan + rehabLoan,
    ltarvCapApplied: capApplied,
    maxLoan,
  };
}

export function computeFlip(inputs: DealInputs, opts: FlipOpts = {}): FlipResult {
  const P = opts.purchasePrice ?? inputs.purchasePrice;
  const baseBudget = rehabBudget(inputs);
  const R = opts.rehabBudget ?? baseBudget;
  const S = opts.arv ?? arvFor(inputs, 'expected');
  const rehabMonths = inputs.rehabMonths || 0;
  const extra = opts.extraMonths ?? 0;
  const H = rehabMonths + (inputs.marketingMonths || 0) + extra;

  const loan = sizeLoan(inputs, P, opts.loanRehab ?? baseBudget, opts.loanArv ?? arvFor(inputs, 'expected'));

  const acquisitionCosts = P * inputs.buyerClosingPct + inputs.buyerClosingFixed;

  // Financing
  let pointsCost = 0;
  let lenderFees = 0;
  let interest = 0;
  let extensionFees = 0;
  let extensions = 0;
  if (inputs.purchaseMethod === 'hardMoney' && loan.totalLoan > 0) {
    const r = inputs.annualRate / 12;
    pointsCost = loan.totalLoan * inputs.points;
    lenderFees = inputs.lenderFees;
    const purchaseInterest = loan.purchaseLoan * r * H;
    const postRehabMonths = Math.max(0, H - rehabMonths);
    const rehabInterest =
      inputs.interestMethod === 'fullBalance'
        ? loan.rehabLoan * r * H
        : loan.rehabLoan * r * (0.5 * rehabMonths + postRehabMonths); // straight-line draws
    interest = purchaseInterest + rehabInterest;
    if (H > inputs.loanTermMonths && inputs.extensionMonths > 0) {
      extensions = Math.ceil((H - inputs.loanTermMonths) / inputs.extensionMonths);
      extensionFees = loan.totalLoan * inputs.extensionFeePct * extensions;
    }
  }
  const financingCost = pointsCost + lenderFees + interest + extensionFees;

  // Holding
  const taxesAnnual = inputs.taxAnnualOverride > 0 ? inputs.taxAnnualOverride : P * inputs.taxRatePct;
  const holdingMonthly =
    taxesAnnual / 12 +
    inputs.insuranceMonthly +
    inputs.utilitiesMonthly +
    inputs.hoaMonthly +
    inputs.maintenanceMonthly +
    inputs.otherMonthly;
  const holdingCost = holdingMonthly * H;

  // Sale
  const commission = S * inputs.commissionPct;
  const sellerClosing = S * inputs.sellerClosingPct;
  const concessions = S * inputs.concessionsPct;
  const staging = inputs.stagingCost;
  const sellingCost = commission + sellerClosing + concessions + staging;

  const totalBasis = P + acquisitionCosts + R + financingCost + holdingCost;
  const totalProjectCost = totalBasis + sellingCost;
  const netProfit = S - totalProjectCost;

  const unfundedRehab = Math.max(0, R - loan.rehabLoan);
  const cashRequired = P - loan.purchaseLoan + acquisitionCosts + unfundedRehab + financingCost + holdingCost;

  const marginPct = S > 0 ? netProfit / S : 0;
  const cashOnCash = cashRequired > 0 ? netProfit / cashRequired : 0;
  const annualized = H > 0 ? cashOnCash * (12 / H) : 0;
  const monthlyBurn = holdingMonthly + (H > 0 ? interest / H : 0);

  const sellPctTotal = inputs.commissionPct + inputs.sellerClosingPct + inputs.concessionsPct;
  const breakEvenSalePrice = sellPctTotal < 1 ? (totalBasis + staging) / (1 - sellPctTotal) : 0;

  return {
    purchasePrice: P,
    arv: S,
    salePrice: S,
    rehabBudget: R,
    rehabMonths,
    holdMonths: H,
    loan,
    acquisitionCosts,
    pointsCost,
    lenderFees,
    interest,
    extensionFees,
    extensions,
    financingCost,
    taxesAnnual,
    holdingMonthly,
    holdingCost,
    commission,
    sellerClosing,
    concessions,
    staging,
    sellingCost,
    totalBasis,
    totalProjectCost,
    netProfit,
    marginPct,
    cashRequired,
    cashOnCash,
    annualized,
    monthlyBurn,
    breakEvenSalePrice,
    seventyRuleMax: 0.7 * S - R,
  };
}

// ─── Solver ───────────────────────────────────────────────────────────────

/**
 * Highest purchase price for which `ok(price)` holds. `ok` must be monotone
 * (true at low prices, false at high prices). Returns 0 when nothing works.
 */
export function solveMaxPrice(ok: (price: number) => boolean, upper: number): number {
  if (upper <= 0 || !ok(0)) return 0;
  if (ok(upper)) return upper;
  let lo = 0;
  let hi = upper;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (ok(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

function flipMeets(f: FlipResult, s: Settings, profitFloor: number): boolean {
  if (f.netProfit < profitFloor) return false;
  if (s.minFlipMarginPct > 0 && f.marginPct < s.minFlipMarginPct) return false;
  if (s.minCashOnCashPct > 0 && f.cashOnCash < s.minCashOnCashPct) return false;
  if (s.minAnnualizedPct > 0 && f.annualized < s.minAnnualizedPct) return false;
  return true;
}

function conservativeDef(s: Settings): ScenarioDef {
  return s.scenarios.find((x) => x.id === 'conservative') ?? s.scenarios[1] ?? s.scenarios[0];
}

function scenarioFlip(inputs: DealInputs, def: ScenarioDef, purchasePrice?: number): FlipResult {
  return computeFlip(inputs, {
    purchasePrice,
    arv: arvFor(inputs, 'expected') * (1 + def.arvPct),
    rehabBudget: rehabBudget(inputs) * (1 + def.rehabPct),
    extraMonths: def.extraMonths,
  });
}

export function solveFlipMao(inputs: DealInputs, s: Settings) {
  const upper = arvFor(inputs, 'expected');
  const cons = conservativeDef(s);
  const min = solveMaxPrice((p) => flipMeets(computeFlip(inputs, { purchasePrice: p }), s, s.minFlipProfit), upper);
  const target = solveMaxPrice(
    (p) => flipMeets(computeFlip(inputs, { purchasePrice: p }), s, Math.max(s.targetFlipProfit, s.minFlipProfit)),
    upper,
  );
  const downside = solveMaxPrice((p) => scenarioFlip(inputs, cons, p).netProfit >= s.downsideFloorProfit, upper);
  return { min, target, downside };
}

// ─── Wholesale ────────────────────────────────────────────────────────────

export interface WholesaleOpts {
  contractPrice?: number;
  arvPct?: number;
  rehabPct?: number;
}

function wholesaleFixedCosts(s: Settings): number {
  return s.wholesaleTransactionCost + s.marketingCostPerDeal;
}

export function computeWholesale(inputs: DealInputs, s: Settings, opts: WholesaleOpts = {}): WholesaleResult {
  const C = opts.contractPrice ?? inputs.purchasePrice;
  const buyerArv = arvFor(inputs, inputs.endBuyerArvCase) * (1 + (opts.arvPct ?? 0));
  const buyerRehab = rehabBudget(inputs) * (1 + (opts.rehabPct ?? 0)) * (1 + inputs.endBuyerRehabPadPct);

  const buyerMaoRule = Math.max(0, buyerArv * s.buyerArvFactorPct - buyerRehab);
  // Model-implied: what would a buyer using our cost structure pay to clear
  // their minimum profit? Sized on the buyer's own ARV/rehab view.
  const buyerMinProfit = buyerArv * s.buyerMinProfitPctOfArv;
  const buyerMaoModel = solveMaxPrice(
    (p) =>
      computeFlip(inputs, {
        purchasePrice: p,
        arv: buyerArv,
        rehabBudget: buyerRehab,
        loanArv: buyerArv,
        loanRehab: buyerRehab,
      }).netProfit >= buyerMinProfit,
    buyerArv,
  );
  const endBuyerPrice =
    s.endBuyerMethod === 'rule'
      ? buyerMaoRule
      : s.endBuyerMethod === 'model'
        ? buyerMaoModel
        : Math.min(buyerMaoRule, buyerMaoModel);

  const grossFee = endBuyerPrice - C;
  const transactionCost = s.wholesaleTransactionCost;
  const doubleCloseCost = inputs.wholesaleMethod === 'doubleClose' ? C * s.doubleCloseCostPct : 0;
  const marketingCost = s.marketingCostPerDeal;
  const netProfit = grossFee - transactionCost - doubleCloseCost - marketingCost;
  const daysToClose = s.wholesaleDaysToClose || 30;
  const cashExposure = inputs.emd;
  const annualized = cashExposure > 0 ? (netProfit / cashExposure) * (365 / daysToClose) : 0;

  return {
    contractPrice: C,
    buyerArv,
    buyerRehab,
    buyerMaoRule,
    buyerMaoModel,
    endBuyerPrice,
    grossFee,
    transactionCost,
    doubleCloseCost,
    marketingCost,
    netProfit,
    cashExposure,
    daysToClose,
    annualized,
  };
}

/** Max contract price that still nets `fee` after wholesale costs. */
export function wholesaleMaoFor(inputs: DealInputs, s: Settings, fee: number, endBuyerPrice: number): number {
  const numerator = endBuyerPrice - fee - wholesaleFixedCosts(s);
  const c = inputs.wholesaleMethod === 'doubleClose' ? numerator / (1 + s.doubleCloseCostPct) : numerator;
  return Math.max(0, c);
}

// ─── Evaluation ───────────────────────────────────────────────────────────

function check(label: string, actual: number, required: number, kind: Check['kind'], enabled = true): Check | null {
  if (!enabled) return null;
  return { label, actual, required, kind, pass: actual >= required };
}

function verdictFrom(base: Check[], downside: Check[]): Verdict {
  const baseOk = base.every((c) => c.pass);
  const downOk = downside.every((c) => c.pass);
  if (baseOk && downOk) return 'BUY';
  if (baseOk) return 'REVIEW';
  return 'PASS';
}

export function evaluateFlip(flip: FlipResult, cons: FlipResult, s: Settings): ExitEvaluation {
  const baseChecks = [
    check('Net profit', flip.netProfit, s.minFlipProfit, 'money'),
    check('Profit margin', flip.marginPct, s.minFlipMarginPct, 'pct', s.minFlipMarginPct > 0),
    check('Cash-on-cash', flip.cashOnCash, s.minCashOnCashPct, 'pct', s.minCashOnCashPct > 0),
    check('Annualized return', flip.annualized, s.minAnnualizedPct, 'pct', s.minAnnualizedPct > 0),
  ].filter((c): c is Check => c !== null);
  const downsideChecks = [
    check('Conservative-case profit', cons.netProfit, s.downsideFloorProfit, 'money', s.requireDownside),
  ].filter((c): c is Check => c !== null);
  const verdict = verdictFrom(baseChecks, downsideChecks);
  const reasons: string[] = [];
  for (const c of [...baseChecks, ...downsideChecks]) {
    const a = c.kind === 'money' ? fmtMoney(c.actual) : fmtPct(c.actual);
    const r = c.kind === 'money' ? fmtMoney(c.required) : fmtPct(c.required);
    reasons.push(`${c.pass ? '✓' : '✗'} ${c.label} ${a} vs ${r} minimum`);
  }
  if (flip.loan.ltarvCapApplied) {
    reasons.push(`⚠ Lender LTARV cap binds — loan limited to ${fmtMoney(flip.loan.maxLoan)}, more cash required`);
  }
  if (flip.extensions > 0) {
    reasons.push(`⚠ Hold exceeds loan term — ${flip.extensions} extension(s) assumed`);
  }
  return { exit: 'flip', verdict, baseChecks, downsideChecks, reasons };
}

export function evaluateWholesale(w: WholesaleResult, cons: WholesaleResult, s: Settings): ExitEvaluation {
  const baseChecks = [check('Net assignment profit', w.netProfit, s.minWholesaleFee, 'money')].filter(
    (c): c is Check => c !== null,
  );
  const downsideChecks = [
    check('Conservative-case fee', cons.netProfit, s.downsideFloorFee, 'money', s.requireDownside),
  ].filter((c): c is Check => c !== null);
  const verdict = verdictFrom(baseChecks, downsideChecks);
  const reasons: string[] = [];
  for (const c of [...baseChecks, ...downsideChecks]) {
    reasons.push(`${c.pass ? '✓' : '✗'} ${c.label} ${fmtMoney(c.actual)} vs ${fmtMoney(c.required)} minimum`);
  }
  reasons.push(
    `End buyer price ${fmtMoney(w.endBuyerPrice)} (rule ${fmtMoney(w.buyerMaoRule)}, model ${fmtMoney(w.buyerMaoModel)})`,
  );
  return { exit: 'wholesale', verdict, baseChecks, downsideChecks, reasons };
}

// ─── Recommendation ───────────────────────────────────────────────────────

const RANK: Record<Verdict, number> = { BUY: 2, REVIEW: 1, PASS: 0 };

function buildLadder(
  exit: Exit,
  inputs: DealInputs,
  s: Settings,
  walkAway: number,
  target: number,
): OfferLadder {
  const t = Math.min(target, walkAway);
  let opening = roundDownTo(t * (1 - s.openingDiscountPct), s.roundTo);
  if (inputs.sellerAsking > 0) opening = Math.min(opening, roundDownTo(inputs.sellerAsking, s.roundTo));
  opening = Math.max(0, opening);
  return {
    exit,
    opening,
    target: roundDownTo(t, s.roundTo),
    walkAway: roundDownTo(walkAway, s.roundTo),
    room: Math.max(0, roundDownTo(walkAway, s.roundTo) - opening),
  };
}

export function recommend(
  inputs: DealInputs,
  s: Settings,
  homeMarket: boolean,
  flip: FlipResult,
  flipCons: FlipResult,
  wholesale: WholesaleResult,
  flipEval: ExitEvaluation,
  wholesaleEval: ExitEvaluation,
  flipMao: { min: number; target: number; downside: number },
  wholesaleMao: { min: number; target: number },
): Recommendation {
  const reasons: string[] = [];
  const flipWalkAway = s.requireDownside ? Math.min(flipMao.min, flipMao.downside) : flipMao.min;
  const wholesaleWalkAway = wholesaleMao.min;
  const absoluteCeiling = Math.max(flipWalkAway, wholesaleWalkAway);

  if (!homeMarket) {
    reasons.push(`Outside home market (${inputs.county}) — flip thresholds raised ${s.outsideMarketPremium}x`);
  }

  let exit: Exit | null = null;
  const fr = RANK[flipEval.verdict];
  const wr = RANK[wholesaleEval.verdict];

  if (fr === 0 && wr === 0) {
    exit = null;
    reasons.push(`Neither exit clears minimums at ${fmtMoney(inputs.purchasePrice)}`);
  } else if (fr !== wr) {
    exit = fr > wr ? 'flip' : 'wholesale';
    reasons.push(
      exit === 'flip'
        ? `Flip (${flipEval.verdict}) outranks wholesale (${wholesaleEval.verdict})`
        : `Wholesale (${wholesaleEval.verdict}) outranks flip (${flipEval.verdict})`,
    );
  } else {
    // Both viable at the same verdict level — is the extra flip profit worth it?
    const mult = homeMarket ? 1 : s.outsideMarketPremium;
    const incremental = flip.netProfit - wholesale.netProfit;
    const needProfit = s.minIncrementalFlipProfit * mult;
    const needRoC = s.minIncrementalReturnOnCash * mult * flip.cashRequired;
    const need = Math.max(needProfit, needRoC);
    const clearsIncremental = incremental >= need;
    const downsideBeatsWholesale = flipCons.netProfit >= wholesale.netProfit;
    reasons.push(
      `${clearsIncremental ? '✓' : '✗'} Flip adds ${fmtMoney(incremental)} over wholesale vs ${fmtMoney(need)} required (max of ${fmtMoney(needProfit)} and ${fmtPct(s.minIncrementalReturnOnCash * mult, 0)} of ${fmtMoney(flip.cashRequired)} cash tied up)`,
    );
    reasons.push(
      `${downsideBeatsWholesale ? '✓' : '✗'} Conservative flip profit ${fmtMoney(flipCons.netProfit)} vs sure-thing wholesale ${fmtMoney(wholesale.netProfit)}`,
    );
    exit = clearsIncremental && downsideBeatsWholesale ? 'flip' : 'wholesale';
  }

  const ladderExit: Exit = exit ?? (flipWalkAway >= wholesaleWalkAway ? 'flip' : 'wholesale');
  const offer =
    ladderExit === 'flip'
      ? buildLadder('flip', inputs, s, flipWalkAway, flipMao.target)
      : buildLadder('wholesale', inputs, s, wholesaleWalkAway, wholesaleMao.target);

  const verdict: Verdict = exit === 'flip' ? flipEval.verdict : exit === 'wholesale' ? wholesaleEval.verdict : 'PASS';

  let headline: string;
  if (exit === null) {
    headline =
      absoluteCeiling > 0
        ? `PASS at ${fmtMoney(inputs.purchasePrice)} — highest supportable price is ${fmtMoney(roundDownTo(absoluteCeiling, s.roundTo))} (${ladderExit})`
        : `PASS — no price makes this deal work under current assumptions`;
  } else {
    headline = `${exit === 'flip' ? 'FLIP' : 'WHOLESALE'} — ${verdict} at ${fmtMoney(inputs.purchasePrice)}`;
  }

  return {
    exit,
    verdict,
    headline,
    reasons,
    offer,
    flipWalkAway,
    wholesaleWalkAway,
    absoluteCeiling,
    askingVsCeiling: inputs.sellerAsking > 0 ? inputs.sellerAsking - absoluteCeiling : 0,
  };
}

// ─── Full analysis ────────────────────────────────────────────────────────

export function analyze(inputs: DealInputs, s: Settings): Analysis {
  const scope = rehabScope(inputs);
  const budget = rehabBudget(inputs);
  const homeMarket = s.homeMarketCounties.includes(inputs.county);

  const flip = computeFlip(inputs);
  const wholesale = computeWholesale(inputs, s);

  const scenarios: ScenarioRow[] = s.scenarios.map((def) => ({
    def,
    flip: scenarioFlip(inputs, def),
    wholesale: computeWholesale(inputs, s, { arvPct: def.arvPct, rehabPct: def.rehabPct }),
  }));
  const consDef = conservativeDef(s);
  const consRow = scenarios.find((r) => r.def.id === consDef.id) ?? scenarios[0];

  const flipEval = evaluateFlip(flip, consRow.flip, s);
  const wholesaleEval = evaluateWholesale(wholesale, consRow.wholesale, s);

  const flipMao = solveFlipMao(inputs, s);
  const wholesaleMao = {
    min: wholesaleMaoFor(inputs, s, s.minWholesaleFee, wholesale.endBuyerPrice),
    target: wholesaleMaoFor(inputs, s, Math.max(s.targetWholesaleFee, s.minWholesaleFee), wholesale.endBuyerPrice),
  };

  const recommendation = recommend(
    inputs,
    s,
    homeMarket,
    flip,
    consRow.flip,
    wholesale,
    flipEval,
    wholesaleEval,
    flipMao,
    wholesaleMao,
  );

  const arvPcts = [-0.1, -0.05, 0, 0.05];
  const rehabPcts = [-0.1, 0, 0.1, 0.2, 0.3];
  const profit = arvPcts.map((a) =>
    rehabPcts.map(
      (r) =>
        computeFlip(inputs, {
          arv: arvFor(inputs, 'expected') * (1 + a),
          rehabBudget: budget * (1 + r),
        }).netProfit,
    ),
  );

  return {
    rehabBudget: budget,
    rehabScope: scope,
    contingency: budget - scope,
    homeMarket,
    flip,
    wholesale,
    flipEval,
    wholesaleEval,
    scenarios,
    flipMao,
    wholesaleMao,
    recommendation,
    sensitivity: { arvPcts, rehabPcts, profit },
  };
}
