import type { Analysis, County, DealInputs, PropertyType, Settings, RehabTier, Occupancy, Confidence, ArvCase } from '../../lib/dealDesk/types.ts';
import { LEAD_SOURCES, REHAB_CATEGORIES } from '../../lib/dealDesk/defaults.ts';
import { fmtMoney, fmtNumber, fmtPct, uid } from '../../lib/dealDesk/format.ts';
import { Grid, NumField, Section, Segmented, SelectField, TextField } from './fields.tsx';

export type Patch = (p: Partial<DealInputs>) => void;

interface P {
  i: DealInputs;
  set: Patch;
  s: Settings;
  a: Analysis;
}

const COUNTIES: County[] = ['Orange', 'Los Angeles', 'Riverside', 'San Bernardino', 'San Diego', 'Other'];
const TYPES: PropertyType[] = ['SFR', 'Condo', 'Townhome', '2-4 Units', 'Other'];
const opts = <T extends string>(xs: readonly T[]) => xs.map((x) => ({ value: x, label: x }));

export function PropertySection({ i, set, a }: P) {
  return (
    <Section title="1. Property & lead" subtitle="Who, where, what they want">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <TextField label="Address" value={i.address} onChange={(v) => set({ address: v })} placeholder="123 Main St" />
        </div>
        <div className="sm:col-span-2">
          <TextField label="City" value={i.city} onChange={(v) => set({ city: v })} placeholder="Anaheim" />
        </div>
        <div className="sm:col-span-2">
          <SelectField label="County" value={i.county} onChange={(v) => set({ county: v })} options={opts(COUNTIES)} hint={a.homeMarket ? 'home market' : 'outside home market'} />
        </div>
        <div className="sm:col-span-2">
          <SelectField label="Type" value={i.propertyType} onChange={(v) => set({ propertyType: v })} options={opts(TYPES)} />
        </div>
        <div className="sm:col-span-2">
          <SelectField label="Occupancy" value={i.occupancy} onChange={(v) => set({ occupancy: v as Occupancy })} options={opts(['Vacant', 'Owner', 'Tenant'] as const)} />
        </div>
        <div className="sm:col-span-2">
          <NumField label="Sq ft" kind="int" value={i.sqft} onChange={(v) => set({ sqft: v })} />
        </div>
        <div className="sm:col-span-1">
          <NumField label="Beds" kind="int" value={i.beds} onChange={(v) => set({ beds: v })} />
        </div>
        <div className="sm:col-span-1">
          <NumField label="Baths" kind="dec" value={i.baths} onChange={(v) => set({ baths: v })} />
        </div>
        <div className="sm:col-span-2">
          <NumField label="Year built" kind="int" value={i.yearBuilt} onChange={(v) => set({ yearBuilt: v })} />
        </div>
        <div className="sm:col-span-2">
          <SelectField label="Lead source" value={i.leadSource} onChange={(v) => set({ leadSource: v })} options={opts(LEAD_SOURCES)} />
        </div>
        <div className="sm:col-span-2">
          <SelectField
            label="Seller motivation"
            value={i.sellerMotivation}
            onChange={(v) => set({ sellerMotivation: v as 1 | 2 | 3 | 4 | 5 })}
            options={[
              { value: 1, label: '1 — Fishing' },
              { value: 2, label: '2 — Curious' },
              { value: 3, label: '3 — Motivated' },
              { value: 4, label: '4 — Needs to sell' },
              { value: 5, label: '5 — Urgent' },
            ]}
          />
        </div>
        <div className="sm:col-span-2">
          <NumField label="Seller asking" value={i.sellerAsking} onChange={(v) => set({ sellerAsking: v })} />
        </div>
        <div className="sm:col-span-6">
          <TextField label="Notes" value={i.notes} onChange={(v) => set({ notes: v })} multiline placeholder="Condition, story, timeline, anything from the call…" />
        </div>
      </div>
    </Section>
  );
}

export function ValuationSection({ i, set, a }: P) {
  const compPsf = i.comps.filter((c) => c.price > 0 && c.sqft > 0);
  const avgPsf = compPsf.length ? compPsf.reduce((s, c) => s + c.price / c.sqft, 0) / compPsf.length : 0;
  const impliedArv = avgPsf > 0 && i.sqft > 0 ? avgPsf * i.sqft : 0;
  const spread = i.arvExpected > 0 && i.arvConservative > 0 ? (i.arvExpected - i.arvConservative) / i.arvExpected : 0;
  return (
    <Section title="2. Valuation" subtitle="Three ARV views. The model shows how much the deal leans on this number.">
      <Grid cols={4}>
        <NumField label="ARV — conservative" value={i.arvConservative} onChange={(v) => set({ arvConservative: v })} />
        <NumField label="ARV — expected" value={i.arvExpected} onChange={(v) => set({ arvExpected: v })} emphasis />
        <NumField label="ARV — aggressive" value={i.arvAggressive} onChange={(v) => set({ arvAggressive: v })} />
        <NumField label="As-is value" value={i.asIsValue} onChange={(v) => set({ asIsValue: v })} hint="what it sells for today" />
      </Grid>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <SelectField label="ARV confidence" value={i.arvConfidence} onChange={(v) => set({ arvConfidence: v as Confidence })} options={opts(['Low', 'Medium', 'High'] as const)} />
        <div className="rounded-md bg-cream/80 px-3 py-2 sm:col-span-3">
          <div className="text-[10px] uppercase tracking-wider text-driftwood">Sanity check</div>
          <div className="text-sm text-espresso/80">
            {i.sqft > 0 && i.arvExpected > 0 ? <>Expected ARV = <b>{fmtMoney(i.arvExpected / i.sqft)}/sf</b>. </> : null}
            {spread > 0 ? <>Conservative is <b>{fmtPct(spread, 1)}</b> below expected. </> : null}
            {impliedArv > 0 ? <>Comps imply <b>{fmtMoney(impliedArv)}</b> ({fmtMoney(avgPsf)}/sf). </> : null}
            Break-even sale price at this purchase: <b>{fmtMoney(a.flip.breakEvenSalePrice)}</b>.
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-driftwood">Comparable sales (optional)</span>
          <button type="button" className="dd-btn-ghost" onClick={() => set({ comps: [...i.comps, { id: uid(), address: '', price: 0, sqft: 0 }] })}>
            + Add comp
          </button>
        </div>
        {i.comps.length === 0 && <p className="text-xs text-driftwood">Add a few sold comps to get an implied $/sf next to your ARV.</p>}
        <div className="space-y-2">
          {i.comps.map((c) => (
            <div key={c.id} className="grid grid-cols-12 gap-2">
              <div className="col-span-12 sm:col-span-5">
                <input className="dd-input" placeholder="Comp address" value={c.address} onChange={(e) => set({ comps: i.comps.map((x) => (x.id === c.id ? { ...x, address: e.target.value } : x)) })} />
              </div>
              <div className="col-span-5 sm:col-span-3">
                <NumField label="" value={c.price} onChange={(v) => set({ comps: i.comps.map((x) => (x.id === c.id ? { ...x, price: v } : x)) })} placeholder="Sold price" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <NumField label="" kind="int" value={c.sqft} onChange={(v) => set({ comps: i.comps.map((x) => (x.id === c.id ? { ...x, sqft: v } : x)) })} placeholder="Sq ft" />
              </div>
              <div className="col-span-2 flex items-end justify-between gap-1 sm:col-span-2">
                <span className="pb-2 text-xs tabular-nums text-driftwood">{c.price > 0 && c.sqft > 0 ? `${fmtMoney(c.price / c.sqft)}/sf` : ''}</span>
                <button type="button" className="dd-btn-ghost text-red-700" onClick={() => set({ comps: i.comps.filter((x) => x.id !== c.id) })}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function RehabSection({ i, set, s, a }: P) {
  const tierOpts = (Object.keys(s.rehabTiers) as RehabTier[]).map((t) => ({ value: t, label: `${t[0].toUpperCase()}${t.slice(1)} — $${s.rehabTiers[t]}/sf` }));
  const total = i.rehabLines.reduce((x, l) => x + (l.amount || 0), 0);
  return (
    <Section
      title="3. Rehab"
      subtitle={`Budget ${fmtMoney(a.rehabBudget)} incl. ${fmtPct(i.contingencyPct, 0)} contingency${i.rehabRevisedEstimate > 0 ? ' · using Dad’s revised number' : ''}`}
      right={
        <Segmented
          value={i.rehabMethod}
          onChange={(v) => set({ rehabMethod: v })}
          options={[
            { value: 'quick', label: 'Quick $/sf' },
            { value: 'detailed', label: 'Detailed scope' },
          ]}
        />
      }
    >
      {i.rehabMethod === 'quick' ? (
        <Grid cols={4}>
          <SelectField
            label="Tier"
            value={i.rehabTier}
            onChange={(v) => set({ rehabTier: v, rehabPerSqft: s.rehabTiers[v] })}
            options={tierOpts}
          />
          <NumField label="$ per sq ft" kind="psf" value={i.rehabPerSqft} onChange={(v) => set({ rehabPerSqft: v })} />
          <NumField label="Sq ft" kind="int" value={i.sqft} onChange={(v) => set({ sqft: v })} />
          <div className="rounded-md bg-cream/80 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-driftwood">Scope</div>
            <div className="font-serif text-lg">{fmtMoney(a.rehabScope)}</div>
          </div>
        </Grid>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {i.rehabLines.map((l) => (
            <div key={l.id} className="flex items-center gap-2">
              <select
                className="dd-input !w-1/2"
                value={l.category}
                onChange={(e) => set({ rehabLines: i.rehabLines.map((x) => (x.id === l.id ? { ...x, category: e.target.value } : x)) })}
              >
                {[...new Set([...REHAB_CATEGORIES, l.category])].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex-1">
                <NumField label="" value={l.amount} onChange={(v) => set({ rehabLines: i.rehabLines.map((x) => (x.id === l.id ? { ...x, amount: v } : x)) })} />
              </div>
              <button type="button" className="dd-btn-ghost text-red-700" onClick={() => set({ rehabLines: i.rehabLines.filter((x) => x.id !== l.id) })}>
                ✕
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between sm:col-span-2">
            <button type="button" className="dd-btn-ghost" onClick={() => set({ rehabLines: [...i.rehabLines, { id: uid(), category: 'Other', amount: 0 }] })}>
              + Add line
            </button>
            <span className="text-sm">
              Scope total <b className="tabular-nums">{fmtMoney(total)}</b>
            </span>
          </div>
        </div>
      )}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <NumField label="Contingency" kind="pct" value={i.contingencyPct} onChange={(v) => set({ contingencyPct: v })} />
        <NumField label="Rehab months" kind="months" value={i.rehabMonths} onChange={(v) => set({ rehabMonths: v })} />
        <NumField label="List-to-close months" kind="months" value={i.marketingMonths} onChange={(v) => set({ marketingMonths: v })} hint="DOM + escrow" />
        <NumField label="Dad’s revised estimate" value={i.rehabRevisedEstimate} onChange={(v) => set({ rehabRevisedEstimate: v })} hint="overrides scope when set" />
      </div>
    </Section>
  );
}

export function FinancingSection({ i, set, a }: P) {
  const hm = i.purchaseMethod === 'hardMoney';
  const f = a.flip;
  return (
    <Section
      title="4. Financing & acquisition"
      subtitle={hm ? `Loan ${fmtMoney(f.loan.totalLoan)} · financing cost ${fmtMoney(f.financingCost)} · ${fmtMoney(f.cashRequired)} cash in` : `All cash · ${fmtMoney(f.cashRequired)} cash in`}
      right={
        <Segmented
          value={i.purchaseMethod}
          onChange={(v) => set({ purchaseMethod: v })}
          options={[
            { value: 'hardMoney', label: 'Hard money' },
            { value: 'cash', label: 'Cash' },
          ]}
        />
      }
    >
      <Grid cols={4}>
        <NumField label="Buyer closing %" kind="pct" value={i.buyerClosingPct} onChange={(v) => set({ buyerClosingPct: v })} hint="of price" />
        <NumField label="Buyer closing fixed $" value={i.buyerClosingFixed} onChange={(v) => set({ buyerClosingFixed: v })} />
      </Grid>
      {hm && (
        <>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <NumField label="Purchase financed" kind="pct" value={i.purchaseLtcPct} onChange={(v) => set({ purchaseLtcPct: v })} hint="% of price" />
            <NumField label="Rehab financed" kind="pct" value={i.rehabFundedPct} onChange={(v) => set({ rehabFundedPct: v })} hint="% of budget" />
            <NumField label="Max LTARV" kind="pct" value={i.maxLtarvPct} onChange={(v) => set({ maxLtarvPct: v })} hint={f.loan.ltarvCapApplied ? '⚠ cap binding' : 'lender cap'} />
            <NumField label="Interest rate" kind="pct" value={i.annualRate} onChange={(v) => set({ annualRate: v })} />
            <NumField label="Points" kind="pct" value={i.points} onChange={(v) => set({ points: v })} />
            <NumField label="Lender fees" value={i.lenderFees} onChange={(v) => set({ lenderFees: v })} hint="doc, processing, etc." />
            <SelectField
              label="Interest on rehab funds"
              value={i.interestMethod}
              onChange={(v) => set({ interestMethod: v })}
              options={[
                { value: 'asDrawn', label: 'As drawn' },
                { value: 'fullBalance', label: 'Full balance (Dutch)' },
              ]}
            />
            <NumField label="Loan term" kind="months" value={i.loanTermMonths} onChange={(v) => set({ loanTermMonths: v })} />
            <NumField label="Extension length" kind="months" value={i.extensionMonths} onChange={(v) => set({ extensionMonths: v })} />
            <NumField label="Extension fee" kind="pct" value={i.extensionFeePct} onChange={(v) => set({ extensionFeePct: v })} hint="of loan, each" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div className="rounded bg-cream/80 px-2 py-1">Purchase loan <b className="block tabular-nums">{fmtMoney(f.loan.purchaseLoan)}</b></div>
            <div className="rounded bg-cream/80 px-2 py-1">Rehab holdback <b className="block tabular-nums">{fmtMoney(f.loan.rehabLoan)}</b></div>
            <div className="rounded bg-cream/80 px-2 py-1">Interest ({fmtNumber(f.holdMonths)} mo) <b className="block tabular-nums">{fmtMoney(f.interest)}</b></div>
            <div className="rounded bg-cream/80 px-2 py-1">Points + fees + ext. <b className="block tabular-nums">{fmtMoney(f.pointsCost + f.lenderFees + f.extensionFees)}</b></div>
          </div>
        </>
      )}
    </Section>
  );
}

export function HoldingSaleSection({ i, set, a }: P) {
  const f = a.flip;
  return (
    <Section title="5. Holding & sale" subtitle={`${fmtMoney(f.holdingMonthly)}/mo carry · selling costs ${fmtMoney(f.sellingCost)}`}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <NumField label="Tax rate (annual)" kind="pct" value={i.taxRatePct} onChange={(v) => set({ taxRatePct: v })} hint="on purchase price" />
        <NumField label="Tax override (annual $)" value={i.taxAnnualOverride} onChange={(v) => set({ taxAnnualOverride: v })} hint="0 = use rate" />
        <NumField label="Insurance / mo" value={i.insuranceMonthly} onChange={(v) => set({ insuranceMonthly: v })} />
        <NumField label="Utilities / mo" value={i.utilitiesMonthly} onChange={(v) => set({ utilitiesMonthly: v })} />
        <NumField label="HOA / mo" value={i.hoaMonthly} onChange={(v) => set({ hoaMonthly: v })} />
        <NumField label="Maintenance / mo" value={i.maintenanceMonthly} onChange={(v) => set({ maintenanceMonthly: v })} hint="yard, pool, security" />
        <NumField label="Other / mo" value={i.otherMonthly} onChange={(v) => set({ otherMonthly: v })} />
        <div className="rounded-md bg-cream/80 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-driftwood">Total hold</div>
          <div className="font-serif text-lg">{fmtNumber(f.holdMonths)} mo → {fmtMoney(f.holdingCost)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <NumField label="Commission" kind="pct" value={i.commissionPct} onChange={(v) => set({ commissionPct: v })} hint="both sides" />
        <NumField label="Seller closing" kind="pct" value={i.sellerClosingPct} onChange={(v) => set({ sellerClosingPct: v })} hint="escrow, title, transfer" />
        <NumField label="Buyer concessions" kind="pct" value={i.concessionsPct} onChange={(v) => set({ concessionsPct: v })} hint="credits, repairs" />
        <NumField label="Staging & prep" value={i.stagingCost} onChange={(v) => set({ stagingCost: v })} />
      </div>
    </Section>
  );
}

export function WholesaleSection({ i, set, a, s }: P) {
  const w = a.wholesale;
  return (
    <Section
      title="6. Wholesale assumptions"
      subtitle={`End buyer pays ~${fmtMoney(w.endBuyerPrice)} · fee at this price ${fmtMoney(w.netProfit)}`}
      right={
        <Segmented
          value={i.wholesaleMethod}
          onChange={(v) => set({ wholesaleMethod: v })}
          options={[
            { value: 'assignment', label: 'Assignment' },
            { value: 'doubleClose', label: 'Double close' },
          ]}
        />
      }
    >
      <Grid cols={4}>
        <SelectField
          label="Buyer underwrites to"
          value={i.endBuyerArvCase}
          onChange={(v) => set({ endBuyerArvCase: v as ArvCase })}
          options={[
            { value: 'conservative', label: 'Conservative ARV' },
            { value: 'expected', label: 'Expected ARV' },
            { value: 'aggressive', label: 'Aggressive ARV' },
          ]}
        />
        <NumField label="Buyer rehab padding" kind="pct" value={i.endBuyerRehabPadPct} onChange={(v) => set({ endBuyerRehabPadPct: v })} hint="buyers pad our scope" />
        <NumField label="EMD" value={i.emd} onChange={(v) => set({ emd: v })} hint="cash at risk" />
        <div className="rounded-md bg-cream/80 px-3 py-2 text-xs">
          <div className="text-[10px] uppercase tracking-wider text-driftwood">Buyer max price</div>
          <div>Rule ({fmtPct(s.buyerArvFactorPct, 0)} ARV − rehab): <b className="tabular-nums">{fmtMoney(w.buyerMaoRule)}</b></div>
          <div>Model ({fmtPct(s.buyerMinProfitPctOfArv, 0)} of ARV profit): <b className="tabular-nums">{fmtMoney(w.buyerMaoModel)}</b></div>
          <div className="text-driftwood">Using: {s.endBuyerMethod === 'lower' ? 'lower of the two' : s.endBuyerMethod}</div>
        </div>
      </Grid>
    </Section>
  );
}
