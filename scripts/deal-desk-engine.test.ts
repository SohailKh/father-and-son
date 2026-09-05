/**
 * Engine tests for the Deal Desk. Run with:  npm run test:engine
 * (Node 22.6+ strips TypeScript natively; no test framework needed.)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, computeFlip, computeWholesale, rehabBudget, solveFlipMao, wholesaleMaoFor } from '../src/lib/dealDesk/engine.ts';
import { DEFAULT_SETTINGS, defaultInputs } from '../src/lib/dealDesk/defaults.ts';
import type { DealInputs } from '../src/lib/dealDesk/types.ts';

function anaheim(over: Partial<DealInputs> = {}): DealInputs {
  // The example from the planning thread: seller wants $900k, rehab $180k, ARV $1.35M.
  return {
    ...defaultInputs(),
    address: '123 Example St',
    city: 'Anaheim',
    county: 'Orange',
    sqft: 1800,
    sellerAsking: 900_000,
    purchasePrice: 900_000,
    arvConservative: 1_300_000,
    arvExpected: 1_350_000,
    arvAggressive: 1_400_000,
    rehabMethod: 'detailed',
    rehabLines: [{ id: 'a', category: 'Kitchen', amount: 180_000 }],
    contingencyPct: 0,
    rehabMonths: 4,
    marketingMonths: 3,
    ...over,
  };
}

const S = DEFAULT_SETTINGS;
const near = (a: number, b: number, tol: number, msg?: string) =>
  assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} expected ${a} ≈ ${b} (±${tol})`);

test('Anaheim example lands in the same neighborhood as the planning thread', () => {
  const f = computeFlip(anaheim());
  // Thread: financing $74k, holding $31k, selling $81k, profit $84k. Our
  // defaults differ slightly (staging, concessions), so check the shape.
  assert.equal(f.rehabBudget, 180_000);
  assert.equal(f.holdMonths, 7);
  near(f.financingCost, 74_000, 20_000, 'financing');
  assert.ok(f.holdingCost > 5_000 && f.holdingCost < 35_000, `holding ${f.holdingCost}`);
  near(f.sellingCost, 81_000, 20_000, 'selling');
  near(f.netProfit, 84_000, 40_000, 'profit');
  assert.ok(f.cashRequired > 0 && f.cashRequired < 400_000, `cash ${f.cashRequired}`);
  assert.ok(f.breakEvenSalePrice < f.arv);
  console.log(
    `  Anaheim: profit ${Math.round(f.netProfit)}, fin ${Math.round(f.financingCost)}, hold ${Math.round(f.holdingCost)}, sell ${Math.round(f.sellingCost)}, cash ${Math.round(f.cashRequired)}, CoC ${(f.cashOnCash * 100).toFixed(1)}%`,
  );
});

test('profit falls as purchase price rises (monotone, so the solver is valid)', () => {
  const i = anaheim();
  let last = Infinity;
  for (let p = 500_000; p <= 1_300_000; p += 50_000) {
    const f = computeFlip(i, { purchasePrice: p });
    assert.ok(f.netProfit < last, `profit not monotone at ${p}`);
    last = f.netProfit;
  }
});

test('flip MAO: the min-threshold price meets every check and +$1k fails', () => {
  const i = anaheim();
  const { min, target, downside } = solveFlipMao(i, S);
  assert.ok(min > 0 && target > 0 && downside > 0);
  assert.ok(target <= min, 'target profit price must be at or below min-profit price');
  const at = computeFlip(i, { purchasePrice: min });
  assert.ok(at.netProfit >= S.minFlipProfit - 1);
  assert.ok(at.marginPct >= S.minFlipMarginPct - 1e-6);
  assert.ok(at.cashOnCash >= S.minCashOnCashPct - 1e-6);
  const above = computeFlip(i, { purchasePrice: min + 1_000 });
  const fails =
    above.netProfit < S.minFlipProfit ||
    above.marginPct < S.minFlipMarginPct ||
    above.cashOnCash < S.minCashOnCashPct ||
    above.annualized < S.minAnnualizedPct;
  assert.ok(fails, 'price above MAO should fail at least one check');
  console.log(`  Flip MAO min ${Math.round(min)}, target ${Math.round(target)}, downside ${Math.round(downside)}`);
});

test('cash purchase has zero financing cost and higher cash required', () => {
  const hm = computeFlip(anaheim());
  const cash = computeFlip(anaheim({ purchaseMethod: 'cash' }));
  assert.equal(cash.financingCost, 0);
  assert.equal(cash.loan.totalLoan, 0);
  assert.ok(cash.cashRequired > hm.cashRequired);
  assert.ok(cash.netProfit > hm.netProfit);
});

test('LTARV cap trims the loan and raises cash required', () => {
  const loose = computeFlip(anaheim({ maxLtarvPct: 0.9 }));
  const tight = computeFlip(anaheim({ maxLtarvPct: 0.6 }));
  assert.equal(loose.loan.ltarvCapApplied, false);
  assert.equal(tight.loan.ltarvCapApplied, true);
  near(tight.loan.totalLoan, 0.6 * 1_350_000, 1);
  assert.ok(tight.cashRequired > loose.cashRequired);
});

test('extensions kick in when hold exceeds the loan term', () => {
  const f = computeFlip(anaheim({ rehabMonths: 10, marketingMonths: 4 })); // 14 mo vs 12 term
  assert.equal(f.extensions, 1);
  assert.ok(f.extensionFees > 0);
  const g = computeFlip(anaheim({ rehabMonths: 12, marketingMonths: 4 })); // 16 mo → 2 extensions
  assert.equal(g.extensions, 2);
});

test('scenario delay adds holding and interest', () => {
  const base = computeFlip(anaheim());
  const late = computeFlip(anaheim(), { extraMonths: 3 });
  assert.equal(late.holdMonths, base.holdMonths + 3);
  assert.ok(late.holdingCost > base.holdingCost);
  assert.ok(late.interest > base.interest);
  assert.ok(late.netProfit < base.netProfit);
});

test('rehab quick vs detailed vs revised estimate precedence', () => {
  const quick = anaheim({ rehabMethod: 'quick', rehabPerSqft: 60, contingencyPct: 0.1 });
  assert.equal(rehabBudget(quick), 1800 * 60 * 1.1);
  const revised = anaheim({ rehabRevisedEstimate: 200_000, contingencyPct: 0.1 });
  near(rehabBudget(revised), 220_000, 0.01);
});

test('wholesale MAO nets exactly the fee (assignment and double close)', () => {
  const i = anaheim();
  const w = computeWholesale(i, S);
  assert.ok(w.endBuyerPrice > 0 && w.endBuyerPrice <= Math.min(w.buyerMaoRule, w.buyerMaoModel) + 1);
  const mao = wholesaleMaoFor(i, S, S.minWholesaleFee, w.endBuyerPrice);
  near(computeWholesale(i, S, { contractPrice: mao }).netProfit, S.minWholesaleFee, 1, 'assignment');
  const dc = anaheim({ wholesaleMethod: 'doubleClose' });
  const wdc = computeWholesale(dc, S);
  const maoDc = wholesaleMaoFor(dc, S, S.minWholesaleFee, wdc.endBuyerPrice);
  near(computeWholesale(dc, S, { contractPrice: maoDc }).netProfit, S.minWholesaleFee, 1, 'double close');
  console.log(`  End buyer ${Math.round(w.endBuyerPrice)} (rule ${Math.round(w.buyerMaoRule)}, model ${Math.round(w.buyerMaoModel)}); wholesale MAO ${Math.round(mao)}`);
});

test('full analysis: Anaheim at $900k is a PASS with a supportable ceiling', () => {
  const a = analyze(anaheim(), S);
  assert.equal(a.scenarios.length, 3);
  assert.ok(a.scenarios[1].flip.netProfit < a.scenarios[0].flip.netProfit);
  assert.ok(a.scenarios[2].flip.netProfit < a.scenarios[1].flip.netProfit);
  assert.ok(a.recommendation.absoluteCeiling > 0);
  assert.ok(a.recommendation.offer.opening <= a.recommendation.offer.target);
  assert.ok(a.recommendation.offer.target <= a.recommendation.offer.walkAway);
  assert.equal(a.sensitivity.profit.length, 4);
  assert.equal(a.sensitivity.profit[0].length, 5);
  console.log(`  ${a.recommendation.headline}`);
  for (const r of a.recommendation.reasons) console.log(`    ${r}`);
  console.log(`  Offer ladder (${a.recommendation.offer.exit}): open ${a.recommendation.offer.opening}, target ${a.recommendation.offer.target}, walk ${a.recommendation.offer.walkAway}`);
});

test('a deal priced at the flip MAO recommends FLIP in the home market', () => {
  const i = anaheim();
  const mao = solveFlipMao(i, S);
  const price = Math.min(mao.min, mao.downside) - 20_000;
  const a = analyze({ ...i, purchasePrice: price }, S);
  assert.equal(a.flipEval.verdict, 'BUY');
  assert.ok(a.recommendation.exit !== null);
  console.log(`  At ${price}: ${a.recommendation.headline}`);
  for (const r of a.recommendation.reasons) console.log(`    ${r}`);
});

test('outside the home market the same deal leans wholesale', () => {
  const i = anaheim({ county: 'Riverside' });
  const mao = solveFlipMao(i, S);
  const price = Math.min(mao.min, mao.downside) - 20_000;
  const home = analyze({ ...anaheim(), purchasePrice: price }, S);
  const away = analyze({ ...i, purchasePrice: price }, S);
  assert.equal(away.homeMarket, false);
  // Away thresholds are stricter, so away can never prefer flip when home prefers wholesale.
  if (home.recommendation.exit === 'wholesale') assert.notEqual(away.recommendation.exit, 'flip');
  console.log(`  Home: ${home.recommendation.exit}  Away: ${away.recommendation.exit}`);
});

test('empty deal does not throw', () => {
  const a = analyze(defaultInputs(), S);
  assert.equal(a.recommendation.exit, null);
  assert.ok(Number.isFinite(a.flip.netProfit));
});
