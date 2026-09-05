import { useMemo } from 'react';
import type { Analysis, County, Deal, DealStatus, Exit, Settings } from '../../lib/dealDesk/types.ts';
import { DEFAULT_SETTINGS } from '../../lib/dealDesk/defaults.ts';
import { analyze } from '../../lib/dealDesk/engine.ts';
import { fmtMoney, fmtNumber, fmtPct } from '../../lib/dealDesk/format.ts';
import { Grid, NumField, Section, SelectField, TextField, Toggle, VerdictPill } from './fields.tsx';

// ─── Settings ──────────────────────────────────────────────────────────────

const ALL_COUNTIES: County[] = ['Orange', 'Los Angeles', 'Riverside', 'San Bernardino', 'San Diego', 'Other'];

export function SettingsPanel({ s, set, onReset }: { s: Settings; set: (p: Partial<Settings>) => void; onReset: () => void }) {
  const toggleCounty = (c: County) =>
    set({ homeMarketCounties: s.homeMarketCounties.includes(c) ? s.homeMarketCounties.filter((x) => x !== c) : [...s.homeMarketCounties, c] });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-espresso/80">These are Father &amp; Son's buy-box rules. Every verdict, MAO and offer ladder is computed from them.</p>
        <button type="button" className="dd-btn-ghost" onClick={onReset}>
          Reset to defaults
        </button>
      </div>

      <Section title="Flip minimums" subtitle="A flip is BUY only if the base case clears all of these and the conservative case clears the floor.">
        <Grid cols={4}>
          <NumField label="Min net profit" value={s.minFlipProfit} onChange={(v) => set({ minFlipProfit: v })} />
          <NumField label="Target net profit" value={s.targetFlipProfit} onChange={(v) => set({ targetFlipProfit: v })} hint="drives the target offer" />
          <NumField label="Min margin" kind="pct" value={s.minFlipMarginPct} onChange={(v) => set({ minFlipMarginPct: v })} hint="profit ÷ sale · 0 = off" />
          <NumField label="Min cash-on-cash" kind="pct" value={s.minCashOnCashPct} onChange={(v) => set({ minCashOnCashPct: v })} hint="0 = off" />
          <NumField label="Min annualized" kind="pct" value={s.minAnnualizedPct} onChange={(v) => set({ minAnnualizedPct: v })} hint="0 = off" />
          <NumField label="Downside floor" value={s.downsideFloorProfit} onChange={(v) => set({ downsideFloorProfit: v })} hint="conservative-case profit ≥" />
          <div className="sm:col-span-2">
            <Toggle label="Require downside protection" value={s.requireDownside} onChange={(v) => set({ requireDownside: v })} hint="Walk-away price also respects the conservative case" />
          </div>
        </Grid>
      </Section>

      <Section title="Wholesale minimums">
        <Grid cols={4}>
          <NumField label="Min assignment fee" value={s.minWholesaleFee} onChange={(v) => set({ minWholesaleFee: v })} hint="net of costs" />
          <NumField label="Target fee" value={s.targetWholesaleFee} onChange={(v) => set({ targetWholesaleFee: v })} />
          <NumField label="Downside floor fee" value={s.downsideFloorFee} onChange={(v) => set({ downsideFloorFee: v })} hint="conservative ARV" />
          <NumField label="Transaction cost" value={s.wholesaleTransactionCost} onChange={(v) => set({ wholesaleTransactionCost: v })} hint="escrow, title, legal" />
          <NumField label="Double-close cost" kind="pct" value={s.doubleCloseCostPct} onChange={(v) => set({ doubleCloseCostPct: v })} hint="of contract, incl. funding" />
          <NumField label="Marketing per deal" value={s.marketingCostPerDeal} onChange={(v) => set({ marketingCostPerDeal: v })} hint="0 = don't attribute" />
          <NumField label="Days to close" kind="int" value={s.wholesaleDaysToClose} onChange={(v) => set({ wholesaleDaysToClose: v })} />
        </Grid>
      </Section>

      <Section title="End-buyer model" subtitle="How we estimate what an investor buyer will pay us.">
        <Grid cols={4}>
          <SelectField
            label="Method"
            value={s.endBuyerMethod}
            onChange={(v) => set({ endBuyerMethod: v })}
            options={[
              { value: 'lower', label: 'Lower of rule & model' },
              { value: 'rule', label: 'Rule only' },
              { value: 'model', label: 'Model only' },
            ]}
          />
          <NumField label="Rule: ARV factor" kind="pct" value={s.buyerArvFactorPct} onChange={(v) => set({ buyerArvFactorPct: v })} hint="the “70% rule”" />
          <NumField label="Model: buyer min profit" kind="pct" value={s.buyerMinProfitPctOfArv} onChange={(v) => set({ buyerMinProfitPctOfArv: v })} hint="% of ARV" />
        </Grid>
      </Section>

      <Section title="Flip vs wholesale preference" subtitle="When both work, flip only if the extra profit pays for the capital, time and construction risk.">
        <Grid cols={4}>
          <NumField label="Min extra profit" value={s.minIncrementalFlipProfit} onChange={(v) => set({ minIncrementalFlipProfit: v })} hint="flip − wholesale ≥" />
          <NumField label="…or % of cash tied up" kind="pct" value={s.minIncrementalReturnOnCash} onChange={(v) => set({ minIncrementalReturnOnCash: v })} hint="whichever is larger" />
          <NumField label="Outside-market premium" kind="dec" value={s.outsideMarketPremium} onChange={(v) => set({ outsideMarketPremium: v })} hint="multiplier on both" />
        </Grid>
        <div className="mt-3">
          <div className="mb-1 text-[11px] uppercase tracking-wider text-driftwood">Home-market counties (flip-friendly)</div>
          <div className="flex flex-wrap gap-2">
            {ALL_COUNTIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCounty(c)}
                className={`rounded-full border px-3 py-1 text-xs ${s.homeMarketCounties.includes(c) ? 'border-espresso bg-espresso text-cream' : 'border-espresso/20 bg-cream text-espresso/70'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Negotiation & rehab tiers">
        <Grid cols={4}>
          <NumField label="Opening offer discount" kind="pct" value={s.openingDiscountPct} onChange={(v) => set({ openingDiscountPct: v })} hint="below target" />
          <NumField label="Round offers to" value={s.roundTo} onChange={(v) => set({ roundTo: v })} />
        </Grid>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(s.rehabTiers) as (keyof Settings['rehabTiers'])[]).map((t) => (
            <NumField key={t} label={`${t} $/sf`} kind="psf" value={s.rehabTiers[t]} onChange={(v) => set({ rehabTiers: { ...s.rehabTiers, [t]: v } })} />
          ))}
        </div>
      </Section>

      <Section title="Scenarios" subtitle="The conservative case is the one that gates BUY vs REVIEW.">
        <div className="space-y-2">
          {s.scenarios.map((sc, idx) => (
            <div key={sc.id} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <TextField label="Label" value={sc.label} onChange={(v) => set({ scenarios: s.scenarios.map((x, k) => (k === idx ? { ...x, label: v } : x)) })} />
              <NumField label="ARV change" kind="pct" value={sc.arvPct} onChange={(v) => set({ scenarios: s.scenarios.map((x, k) => (k === idx ? { ...x, arvPct: v } : x)) })} />
              <NumField label="Rehab change" kind="pct" value={sc.rehabPct} onChange={(v) => set({ scenarios: s.scenarios.map((x, k) => (k === idx ? { ...x, rehabPct: v } : x)) })} />
              <NumField label="Extra months" kind="months" value={sc.extraMonths} onChange={(v) => set({ scenarios: s.scenarios.map((x, k) => (k === idx ? { ...x, extraMonths: v } : x)) })} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Deals list ────────────────────────────────────────────────────────────

const STATUSES: DealStatus[] = ['Lead', 'Offer Made', 'Under Contract', 'Assigned', 'Rehab', 'Listed', 'Sold', 'Dead'];

export function DealsPanel({ deals, s, currentId, onOpen, onDelete, onNew }: { deals: Deal[]; s: Settings; currentId: string; onOpen: (id: string) => void; onDelete: (id: string) => void; onNew: () => void }) {
  const rows = useMemo(
    () =>
      [...deals]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((d) => ({ d, a: analyze(d.inputs, s) })),
    [deals, s],
  );
  return (
    <div className="rounded-lg border border-espresso/10 bg-white/70">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-serif text-base">Saved deals ({deals.length})</span>
        <button type="button" className="dd-btn" onClick={onNew}>
          + New deal
        </button>
      </div>
      <div className="overflow-x-auto border-t border-espresso/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-driftwood">
              <th className="px-4 py-2 text-left font-medium">Property</th>
              <th className="px-2 py-2 text-left font-medium">Status</th>
              <th className="px-2 py-2 text-right font-medium">Price</th>
              <th className="px-2 py-2 text-right font-medium">ARV</th>
              <th className="px-2 py-2 text-right font-medium">Flip profit</th>
              <th className="px-2 py-2 text-right font-medium">Fee</th>
              <th className="px-2 py-2 text-left font-medium">Call</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ d, a }) => (
              <tr key={d.id} className={`border-t border-espresso/10 ${d.id === currentId ? 'bg-emerald-50/60' : 'hover:bg-cream/70'}`}>
                <td className="px-4 py-2">
                  <button type="button" className="text-left" onClick={() => onOpen(d.id)}>
                    <span className="block font-medium">{d.inputs.address || 'Untitled deal'}</span>
                    <span className="block text-[11px] text-driftwood">
                      {[d.inputs.city, d.inputs.county].filter(Boolean).join(', ')} · {new Date(d.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                </td>
                <td className="px-2 py-2 text-xs">{d.status}</td>
                <td className="px-2 py-2 text-right tabular-nums">{fmtMoney(d.inputs.purchasePrice)}</td>
                <td className="px-2 py-2 text-right tabular-nums">{fmtMoney(d.inputs.arvExpected)}</td>
                <td className={`px-2 py-2 text-right tabular-nums ${a.flip.netProfit >= 0 ? '' : 'text-red-700'}`}>{fmtMoney(a.flip.netProfit)}</td>
                <td className={`px-2 py-2 text-right tabular-nums ${a.wholesale.netProfit >= 0 ? '' : 'text-red-700'}`}>{fmtMoney(a.wholesale.netProfit)}</td>
                <td className="px-2 py-2 text-xs">
                  <VerdictPill verdict={a.recommendation.verdict} size="sm" /> {a.recommendation.exit ?? ''}
                </td>
                <td className="px-2 py-2 text-right">
                  <button type="button" className="dd-btn-ghost text-red-700" onClick={() => onDelete(d.id)} title="Delete deal">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-driftwood">
                  No saved deals yet. Every deal you underwrite is saved in this browser automatically.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Actuals ───────────────────────────────────────────────────────────────

export function ActualsPanel({ deal, a, set, setDeal }: { deal: Deal; a: Analysis; set: (p: Partial<Deal['actuals']>) => void; setDeal: (p: Partial<Deal>) => void }) {
  const x = deal.actuals;
  const f = a.flip;
  const isFlip = (deal.exitTaken ?? a.recommendation.exit) !== 'wholesale';
  const actualProfit = isFlip
    ? x.salePrice > 0
      ? x.salePrice - (x.purchasePrice + f.acquisitionCosts + x.rehabCost + x.financingCost + x.holdingCost + x.sellingCost)
      : 0
    : x.assignmentFee;
  const projected = isFlip ? f.netProfit : a.wholesale.netProfit;
  const varianceRows = isFlip
    ? [
        { label: 'Purchase price', proj: f.purchasePrice, act: x.purchasePrice, lowerIsBetter: true },
        { label: 'Rehab', proj: f.rehabBudget, act: x.rehabCost, lowerIsBetter: true },
        { label: 'Hold (months)', proj: f.holdMonths, act: x.holdMonths, lowerIsBetter: true, months: true },
        { label: 'Financing', proj: f.financingCost, act: x.financingCost, lowerIsBetter: true },
        { label: 'Holding', proj: f.holdingCost, act: x.holdingCost, lowerIsBetter: true },
        { label: 'Sale price', proj: f.salePrice, act: x.salePrice, lowerIsBetter: false },
        { label: 'Selling costs', proj: f.sellingCost, act: x.sellingCost, lowerIsBetter: true },
      ]
    : [
        { label: 'Contract price', proj: a.wholesale.contractPrice, act: x.purchasePrice, lowerIsBetter: true },
        { label: 'Assignment fee', proj: a.wholesale.netProfit, act: x.assignmentFee, lowerIsBetter: false },
      ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SelectField label="Status" value={deal.status} onChange={(v) => setDeal({ status: v })} options={STATUSES.map((v) => ({ value: v, label: v }))} />
        <SelectField
          label="Exit taken"
          value={(deal.exitTaken ?? '') as Exit | ''}
          onChange={(v) => setDeal({ exitTaken: v === '' ? null : v })}
          options={[
            { value: '', label: `Model's call (${a.recommendation.exit ?? 'pass'})` },
            { value: 'flip', label: 'Flip' },
            { value: 'wholesale', label: 'Wholesale' },
          ]}
        />
        <TextField label="Close date" type="date" value={x.closeDate} onChange={(v) => set({ closeDate: v })} />
      </div>

      <Section title="Actual results" subtitle="Fill these in as the deal progresses. The variance tells us where our underwriting is consistently off.">
        <Grid cols={4}>
          <NumField label={isFlip ? 'Actual purchase' : 'Actual contract price'} value={x.purchasePrice} onChange={(v) => set({ purchasePrice: v })} />
          {isFlip ? (
            <>
              <NumField label="Actual rehab" value={x.rehabCost} onChange={(v) => set({ rehabCost: v })} />
              <NumField label="Actual hold" kind="months" value={x.holdMonths} onChange={(v) => set({ holdMonths: v })} />
              <NumField label="Actual financing" value={x.financingCost} onChange={(v) => set({ financingCost: v })} />
              <NumField label="Actual holding" value={x.holdingCost} onChange={(v) => set({ holdingCost: v })} />
              <NumField label="Actual sale price" value={x.salePrice} onChange={(v) => set({ salePrice: v })} />
              <NumField label="Actual selling costs" value={x.sellingCost} onChange={(v) => set({ sellingCost: v })} />
              <TextField label="Sold date" type="date" value={x.soldDate} onChange={(v) => set({ soldDate: v })} />
            </>
          ) : (
            <>
              <NumField label="Actual net fee" value={x.assignmentFee} onChange={(v) => set({ assignmentFee: v })} />
              <TextField label="Assigned / closed" type="date" value={x.soldDate} onChange={(v) => set({ soldDate: v })} />
            </>
          )}
        </Grid>
        <div className="mt-3">
          <TextField label="Lessons learned" value={x.lessons} onChange={(v) => set({ lessons: v })} multiline placeholder="What did we miss? What would we underwrite differently next time?" />
        </div>
      </Section>

      <div className="rounded-lg border border-espresso/10 bg-white/70 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-serif text-base">Projected vs actual</span>
          <span className="text-xs text-driftwood">{isFlip ? 'Flip' : 'Wholesale'} exit</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-driftwood">
              <th className="py-1 text-left font-medium"></th>
              <th className="py-1 text-right font-medium">Projected</th>
              <th className="py-1 text-right font-medium">Actual</th>
              <th className="py-1 text-right font-medium">Variance</th>
            </tr>
          </thead>
          <tbody>
            {varianceRows.map((r) => {
              const has = r.act > 0;
              const diff = has ? r.act - r.proj : 0;
              const good = r.lowerIsBetter ? diff <= 0 : diff >= 0;
              const fmt = (n: number) => (r.months ? `${fmtNumber(n)} mo` : fmtMoney(n));
              return (
                <tr key={r.label} className="border-t border-espresso/10">
                  <td className="py-1.5 text-espresso/80">{r.label}</td>
                  <td className="py-1.5 text-right tabular-nums">{fmt(r.proj)}</td>
                  <td className="py-1.5 text-right tabular-nums">{has ? fmt(r.act) : '—'}</td>
                  <td className={`py-1.5 text-right tabular-nums ${!has ? 'text-driftwood' : good ? 'text-emerald-700' : 'text-red-700'}`}>
                    {has ? `${diff >= 0 ? '+' : ''}${fmt(diff)}${r.proj ? ` (${fmtPct(diff / r.proj, 1)})` : ''}` : '—'}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-espresso/15 font-semibold">
              <td className="py-2">Net profit</td>
              <td className="py-2 text-right tabular-nums">{fmtMoney(projected)}</td>
              <td className="py-2 text-right tabular-nums">{actualProfit !== 0 ? fmtMoney(actualProfit) : '—'}</td>
              <td className={`py-2 text-right tabular-nums ${actualProfit === 0 ? 'text-driftwood' : actualProfit - projected >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {actualProfit !== 0 ? fmtMoney(actualProfit - projected, { sign: true }) : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Insights across closed deals ──────────────────────────────────────────

export function InsightsPanel({ deals, s }: { deals: Deal[]; s: Settings }) {
  const closed = deals.filter((d) => (d.status === 'Sold' || d.status === 'Assigned') && d.actuals.purchasePrice > 0);
  if (closed.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-espresso/20 bg-cream/60 p-4 text-sm text-driftwood">
        Once deals are marked Sold or Assigned with actuals filled in, this panel shows where Father &amp; Son's underwriting runs hot or cold: rehab, timeline, sale price and financing variance across every closed project.
      </div>
    );
  }
  const flips = closed.filter((d) => d.status === 'Sold' && d.actuals.salePrice > 0);
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const rehabVar = avg(flips.map((d) => (d.actuals.rehabCost - analyze(d.inputs, s).flip.rehabBudget) / Math.max(1, analyze(d.inputs, s).flip.rehabBudget)));
  const holdVar = avg(flips.map((d) => d.actuals.holdMonths - analyze(d.inputs, s).flip.holdMonths));
  const saleVar = avg(flips.map((d) => (d.actuals.salePrice - analyze(d.inputs, s).flip.salePrice) / Math.max(1, analyze(d.inputs, s).flip.salePrice)));
  return (
    <div className="rounded-lg border border-espresso/10 bg-white/70 p-4">
      <div className="mb-2 font-serif text-base">Underwriting accuracy ({closed.length} closed)</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
        <div className="rounded bg-cream/80 px-3 py-2">Rehab estimates ran <b className={rehabVar > 0 ? 'text-red-700' : 'text-emerald-700'}>{fmtPct(Math.abs(rehabVar), 1)} {rehabVar > 0 ? 'under' : 'over'}</b> actual</div>
        <div className="rounded bg-cream/80 px-3 py-2">Timelines ran <b className={holdVar > 0 ? 'text-red-700' : 'text-emerald-700'}>{Math.abs(holdVar).toFixed(1)} mo {holdVar > 0 ? 'short' : 'long'}</b></div>
        <div className="rounded bg-cream/80 px-3 py-2">Sale prices came in <b className={saleVar < 0 ? 'text-red-700' : 'text-emerald-700'}>{fmtPct(Math.abs(saleVar), 1)} {saleVar < 0 ? 'below' : 'above'}</b> ARV</div>
      </div>
    </div>
  );
}

export { DEFAULT_SETTINGS };
