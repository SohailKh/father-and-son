import type { Analysis, DealInputs, Settings, Exit } from '../../lib/dealDesk/types.ts';
import { fmtMoney, fmtNumber, fmtPct } from '../../lib/dealDesk/format.ts';
import { Row, Stat, VerdictPill } from './fields.tsx';

interface P {
  a: Analysis;
  i: DealInputs;
  s: Settings;
  onSetPrice: (v: number) => void;
}

export function VerdictCard({ a, i, onSetPrice }: P) {
  const r = a.recommendation;
  const tone = r.verdict === 'BUY' ? 'border-emerald-600' : r.verdict === 'REVIEW' ? 'border-amber-500' : 'border-red-600';
  const gap = r.askingVsCeiling;
  return (
    <div className={`rounded-lg border-2 ${tone} bg-white p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-driftwood">Recommendation</div>
          <div className="font-serif text-xl leading-tight text-espresso">
            {r.exit === null ? 'Pass at this price' : r.exit === 'flip' ? 'Flip it' : 'Wholesale it'}
          </div>
          <div className="mt-1 text-xs text-espresso/70">{r.headline}</div>
        </div>
        <VerdictPill verdict={r.verdict} size="lg" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => onSetPrice(r.offer.opening)} className="dd-offer" title="Set purchase price to this">
          <span className="text-[10px] uppercase tracking-wider text-driftwood">Opening offer</span>
          <span className="font-serif text-lg tabular-nums">{fmtMoney(r.offer.opening)}</span>
        </button>
        <button type="button" onClick={() => onSetPrice(r.offer.target)} className="dd-offer" title="Set purchase price to this">
          <span className="text-[10px] uppercase tracking-wider text-driftwood">Target</span>
          <span className="font-serif text-lg tabular-nums">{fmtMoney(r.offer.target)}</span>
        </button>
        <button type="button" onClick={() => onSetPrice(r.offer.walkAway)} className="dd-offer dd-offer-walk" title="Set purchase price to this">
          <span className="text-[10px] uppercase tracking-wider text-driftwood">Walk away</span>
          <span className="font-serif text-lg tabular-nums">{fmtMoney(r.offer.walkAway)}</span>
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-driftwood">
        <span>
          Ladder built for the <b>{r.offer.exit}</b> exit · {fmtMoney(r.offer.room)} of room
        </span>
        {i.sellerAsking > 0 && (
          <span className={gap > 0 ? 'text-red-700' : 'text-emerald-700'}>
            Asking {fmtMoney(i.sellerAsking)} is {gap > 0 ? `${fmtMoney(gap)} above` : `${fmtMoney(-gap)} below`} the ceiling
          </span>
        )}
      </div>

      <ul className="mt-3 space-y-1 border-t border-espresso/10 pt-3 text-xs text-espresso/80">
        {r.reasons.map((x, k) => (
          <li key={k}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

export function ExitComparison({ a, s }: P) {
  const f = a.flip;
  const w = a.wholesale;
  const cons = a.scenarios.find((x) => x.def.id === 'conservative') ?? a.scenarios[1] ?? a.scenarios[0];
  const cell = (exit: Exit) => (a.recommendation.exit === exit ? 'bg-emerald-50' : '');
  const rows: { label: string; flip: string; whole: string; ft?: 'good' | 'bad'; wt?: 'good' | 'bad' }[] = [
    { label: 'Net profit', flip: fmtMoney(f.netProfit), whole: fmtMoney(w.netProfit), ft: f.netProfit >= s.minFlipProfit ? 'good' : 'bad', wt: w.netProfit >= s.minWholesaleFee ? 'good' : 'bad' },
    { label: 'Conservative case', flip: fmtMoney(cons.flip.netProfit), whole: fmtMoney(cons.wholesale.netProfit), ft: cons.flip.netProfit >= s.downsideFloorProfit ? 'good' : 'bad', wt: cons.wholesale.netProfit >= s.downsideFloorFee ? 'good' : 'bad' },
    { label: 'Cash required', flip: fmtMoney(f.cashRequired), whole: fmtMoney(w.cashExposure) },
    { label: 'Timeline', flip: `${fmtNumber(f.holdMonths)} mo`, whole: `${w.daysToClose} days` },
    { label: 'Cash-on-cash', flip: fmtPct(f.cashOnCash), whole: '—' },
    { label: 'Annualized', flip: fmtPct(f.annualized), whole: '—' },
    { label: 'Max price', flip: fmtMoney(a.recommendation.flipWalkAway), whole: fmtMoney(a.recommendation.wholesaleWalkAway) },
  ];
  return (
    <div className="rounded-lg border border-espresso/10 bg-white/70 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-serif text-base">Flip vs wholesale</span>
        <span className="text-[11px] text-driftwood">at {fmtMoney(f.purchasePrice)}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-driftwood">
            <th className="py-1 text-left font-medium"></th>
            <th className={`py-1 text-right font-medium ${cell('flip')}`}>
              Flip <VerdictPill verdict={a.flipEval.verdict} size="sm" />
            </th>
            <th className={`py-1 text-right font-medium ${cell('wholesale')}`}>
              Wholesale <VerdictPill verdict={a.wholesaleEval.verdict} size="sm" />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-espresso/10">
              <td className="py-1.5 text-espresso/80">{r.label}</td>
              <td className={`py-1.5 text-right tabular-nums ${cell('flip')} ${r.ft === 'good' ? 'text-emerald-700' : r.ft === 'bad' ? 'text-red-700' : ''}`}>{r.flip}</td>
              <td className={`py-1.5 text-right tabular-nums ${cell('wholesale')} ${r.wt === 'good' ? 'text-emerald-700' : r.wt === 'bad' ? 'text-red-700' : ''}`}>{r.whole}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-driftwood">Flip checks</div>
          {a.flipEval.reasons.map((x, k) => (
            <div key={k} className="text-espresso/80">{x}</div>
          ))}
        </div>
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-driftwood">Wholesale checks</div>
          {a.wholesaleEval.reasons.map((x, k) => (
            <div key={k} className="text-espresso/80">{x}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FlipBreakdown({ a }: P) {
  const f = a.flip;
  return (
    <div className="rounded-lg border border-espresso/10 bg-white/70 p-4">
      <div className="mb-2 font-serif text-base">Flip — where the money goes</div>
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Net profit" value={fmtMoney(f.netProfit)} tone={f.netProfit >= 0 ? 'good' : 'bad'} />
        <Stat label="Margin" value={fmtPct(f.marginPct)} sub="of sale price" />
        <Stat label="Cash-on-cash" value={fmtPct(f.cashOnCash)} sub={`${fmtMoney(f.cashRequired)} in`} />
        <Stat label="Annualized" value={fmtPct(f.annualized)} sub={`${fmtNumber(f.holdMonths)} mo hold`} />
      </div>
      <Row label="Purchase price" value={fmtMoney(f.purchasePrice)} />
      <Row label="Acquisition closing" value={fmtMoney(f.acquisitionCosts)} indent />
      <Row label="Rehab incl. contingency" value={fmtMoney(f.rehabBudget)} />
      <Row label="Financing" value={fmtMoney(f.financingCost)} />
      <Row label={`Interest (${fmtNumber(f.holdMonths)} mo)`} value={fmtMoney(f.interest)} indent tone="muted" />
      <Row label="Points + lender fees" value={fmtMoney(f.pointsCost + f.lenderFees)} indent tone="muted" />
      {f.extensionFees > 0 && <Row label={`Extensions ×${f.extensions}`} value={fmtMoney(f.extensionFees)} indent tone="muted" />}
      <Row label={`Holding (${fmtMoney(f.holdingMonthly)}/mo)`} value={fmtMoney(f.holdingCost)} />
      <Row label="Total basis (all-in)" value={fmtMoney(f.totalBasis)} strong />
      <Row label="Selling costs" value={fmtMoney(f.sellingCost)} />
      <Row label="Commission" value={fmtMoney(f.commission)} indent tone="muted" />
      <Row label="Closing + concessions + staging" value={fmtMoney(f.sellerClosing + f.concessions + f.staging)} indent tone="muted" />
      <Row label="Total project cost" value={fmtMoney(f.totalProjectCost)} strong />
      <Row label="Sale price (ARV)" value={fmtMoney(f.salePrice)} />
      <Row label="Net profit" value={fmtMoney(f.netProfit)} strong tone={f.netProfit >= 0 ? 'good' : 'bad'} />
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div className="rounded bg-cream/80 px-2 py-1">Break-even sale <b className="block tabular-nums">{fmtMoney(f.breakEvenSalePrice)}</b></div>
        <div className="rounded bg-cream/80 px-2 py-1">Monthly burn <b className="block tabular-nums">{fmtMoney(f.monthlyBurn)}</b></div>
        <div className="rounded bg-cream/80 px-2 py-1">70% rule max <b className="block tabular-nums">{fmtMoney(f.seventyRuleMax)}</b></div>
      </div>
    </div>
  );
}

export function WholesaleBreakdown({ a, i }: P) {
  const w = a.wholesale;
  return (
    <div className="rounded-lg border border-espresso/10 bg-white/70 p-4">
      <div className="mb-2 font-serif text-base">Wholesale — the spread</div>
      <Row label={`Buyer's ARV (${i.endBuyerArvCase})`} value={fmtMoney(w.buyerArv)} />
      <Row label="Buyer's rehab view" value={fmtMoney(w.buyerRehab)} />
      <Row label="End buyer max price" value={fmtMoney(w.endBuyerPrice)} strong />
      <Row label="Our contract price" value={fmtMoney(w.contractPrice)} />
      <Row label="Gross spread" value={fmtMoney(w.grossFee)} strong tone={w.grossFee >= 0 ? 'good' : 'bad'} />
      <Row label="Transaction costs" value={fmtMoney(w.transactionCost)} indent tone="muted" />
      {w.doubleCloseCost > 0 && <Row label="Double-close costs" value={fmtMoney(w.doubleCloseCost)} indent tone="muted" />}
      {w.marketingCost > 0 && <Row label="Marketing attribution" value={fmtMoney(w.marketingCost)} indent tone="muted" />}
      <Row label="Net assignment profit" value={fmtMoney(w.netProfit)} strong tone={w.netProfit >= 0 ? 'good' : 'bad'} />
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-cream/80 px-2 py-1">Max contract (min fee) <b className="block tabular-nums">{fmtMoney(a.wholesaleMao.min)}</b></div>
        <div className="rounded bg-cream/80 px-2 py-1">Max contract (target fee) <b className="block tabular-nums">{fmtMoney(a.wholesaleMao.target)}</b></div>
      </div>
    </div>
  );
}

export function ScenarioTable({ a, s }: P) {
  return (
    <div className="rounded-lg border border-espresso/10 bg-white/70 p-4">
      <div className="mb-2 font-serif text-base">Scenarios</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-driftwood">
              <th className="py-1 text-left font-medium">Case</th>
              <th className="py-1 text-right font-medium">ARV</th>
              <th className="py-1 text-right font-medium">Rehab</th>
              <th className="py-1 text-right font-medium">Hold</th>
              <th className="py-1 text-right font-medium">Flip profit</th>
              <th className="py-1 text-right font-medium">CoC</th>
              <th className="py-1 text-right font-medium">Wholesale fee</th>
            </tr>
          </thead>
          <tbody>
            {a.scenarios.map((r) => (
              <tr key={r.def.id} className="border-t border-espresso/10">
                <td className="py-1.5">
                  {r.def.label}
                  <span className="block text-[10px] text-driftwood">
                    ARV {r.def.arvPct >= 0 ? '+' : ''}{fmtPct(r.def.arvPct, 0)} · rehab +{fmtPct(r.def.rehabPct, 0)} · +{r.def.extraMonths} mo
                  </span>
                </td>
                <td className="py-1.5 text-right tabular-nums">{fmtMoney(r.flip.arv)}</td>
                <td className="py-1.5 text-right tabular-nums">{fmtMoney(r.flip.rehabBudget)}</td>
                <td className="py-1.5 text-right tabular-nums">{fmtNumber(r.flip.holdMonths)} mo</td>
                <td className={`py-1.5 text-right tabular-nums font-semibold ${r.flip.netProfit >= s.minFlipProfit ? 'text-emerald-700' : r.flip.netProfit >= 0 ? 'text-amber-700' : 'text-red-700'}`}>{fmtMoney(r.flip.netProfit)}</td>
                <td className="py-1.5 text-right tabular-nums">{fmtPct(r.flip.cashOnCash)}</td>
                <td className={`py-1.5 text-right tabular-nums font-semibold ${r.wholesale.netProfit >= s.minWholesaleFee ? 'text-emerald-700' : r.wholesale.netProfit >= 0 ? 'text-amber-700' : 'text-red-700'}`}>{fmtMoney(r.wholesale.netProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SensitivityGrid({ a, s }: P) {
  const g = a.sensitivity;
  return (
    <div className="rounded-lg border border-espresso/10 bg-white/70 p-4">
      <div className="mb-1 font-serif text-base">Flip profit sensitivity</div>
      <div className="mb-2 text-[11px] text-driftwood">Rows: ARV change · Columns: rehab change · at the current purchase price</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="py-1 text-left font-medium text-driftwood">ARV \ Rehab</th>
              {g.rehabPcts.map((r) => (
                <th key={r} className="py-1 text-right font-medium text-driftwood">{r >= 0 ? '+' : ''}{fmtPct(r, 0)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.arvPcts.map((av, ai) => (
              <tr key={av} className="border-t border-espresso/10">
                <td className="py-1 font-medium">{av >= 0 ? '+' : ''}{fmtPct(av, 0)}</td>
                {g.profit[ai].map((p, ri) => (
                  <td
                    key={ri}
                    className={`py-1 text-right tabular-nums ${p >= s.minFlipProfit ? 'bg-emerald-50 text-emerald-800' : p >= 0 ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'}`}
                  >
                    {fmtMoney(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
