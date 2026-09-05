import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Deal, DealInputs, Settings } from '../../lib/dealDesk/types.ts';
import { analyze } from '../../lib/dealDesk/engine.ts';
import { DEFAULT_SETTINGS, newDeal } from '../../lib/dealDesk/defaults.ts';
import { exportJson, importJson, isUnlocked, loadStore, mergeSettings, passcode, saveStore, setUnlocked } from '../../lib/dealDesk/storage.ts';
import type { Store } from '../../lib/dealDesk/storage.ts';
import { fmtMoney } from '../../lib/dealDesk/format.ts';
import { NumField, VerdictPill } from './fields.tsx';
import { FinancingSection, HoldingSaleSection, PropertySection, RehabSection, ValuationSection, WholesaleSection } from './sections.tsx';
import { ExitComparison, FlipBreakdown, ScenarioTable, SensitivityGrid, VerdictCard, WholesaleBreakdown } from './results.tsx';
import { ActualsPanel, DealsPanel, InsightsPanel, SettingsPanel } from './panels.tsx';

type Tab = 'underwrite' | 'scenarios' | 'actuals' | 'deals' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'underwrite', label: 'Underwrite' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'actuals', label: 'Actuals' },
  { id: 'deals', label: 'Deals' },
  { id: 'settings', label: 'Rules' },
];

function useNoIndex() {
  useEffect(() => {
    document.title = 'Deal Desk · Father & Son';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = 'noindex, nofollow';
    return () => {
      if (created) meta?.remove();
      else if (meta) meta.content = prev;
    };
  }, []);
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-linen px-4">
      <form
        className="w-full max-w-sm rounded-lg border border-espresso/10 bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim() === passcode()) {
            setUnlocked(true);
            onUnlock();
          } else setErr(true);
        }}
      >
        <div className="text-[11px] uppercase tracking-wider text-driftwood">Father &amp; Son Home Buyers</div>
        <h1 className="font-serif text-2xl text-espresso">Deal Desk</h1>
        <p className="mt-1 text-sm text-espresso/70">Internal underwriting tool. Enter the team passcode.</p>
        <input
          type="password"
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setErr(false);
          }}
          className={`dd-input mt-4 ${err ? '!border-red-600' : ''}`}
          placeholder="Passcode"
        />
        {err && <p className="mt-1 text-xs text-red-700">That's not it.</p>}
        <button type="submit" className="dd-btn mt-3 w-full">
          Open Deal Desk
        </button>
      </form>
    </div>
  );
}

export function DealDeskPage() {
  useNoIndex();
  const [unlocked, setUnlockedState] = useState(isUnlocked());
  const [store, setStore] = useState<Store>(() => {
    const st = loadStore();
    return st.deals.length > 0 ? st : { ...st, deals: [newDeal(st.settings)] };
  });
  const [currentId, setCurrentId] = useState<string>(() => store.deals[0]?.id ?? '');
  const [tab, setTab] = useState<Tab>('underwrite');
  const fileRef = useRef<HTMLInputElement>(null);

  // Persist (debounced).
  useEffect(() => {
    const t = setTimeout(() => saveStore(store), 250);
    return () => clearTimeout(t);
  }, [store]);

  const deal = store.deals.find((d) => d.id === currentId) ?? store.deals[0];
  const settings = store.settings;

  const patchDeal = useCallback(
    (id: string, fn: (d: Deal) => Deal) =>
      setStore((st) => ({ ...st, deals: st.deals.map((d) => (d.id === id ? { ...fn(d), updatedAt: new Date().toISOString() } : d)) })),
    [],
  );
  const setInputs = useCallback((p: Partial<DealInputs>) => deal && patchDeal(deal.id, (d) => ({ ...d, inputs: { ...d.inputs, ...p } })), [deal, patchDeal]);
  const setActuals = useCallback((p: Partial<Deal['actuals']>) => deal && patchDeal(deal.id, (d) => ({ ...d, actuals: { ...d.actuals, ...p } })), [deal, patchDeal]);
  const setDealMeta = useCallback((p: Partial<Deal>) => deal && patchDeal(deal.id, (d) => ({ ...d, ...p })), [deal, patchDeal]);
  const setSettings = useCallback((p: Partial<Settings>) => setStore((st) => ({ ...st, settings: mergeSettings({ ...st.settings, ...p }) })), []);

  const a = useMemo(() => (deal ? analyze(deal.inputs, settings) : null), [deal, settings]);

  const addDeal = () => {
    const d = newDeal(settings);
    setStore((st) => ({ ...st, deals: [d, ...st.deals] }));
    setCurrentId(d.id);
    setTab('underwrite');
  };
  const duplicateDeal = () => {
    if (!deal) return;
    const d = { ...newDeal(settings), inputs: { ...deal.inputs, address: `${deal.inputs.address} (copy)` } };
    setStore((st) => ({ ...st, deals: [d, ...st.deals] }));
    setCurrentId(d.id);
  };
  const deleteDeal = (id: string) => {
    const target = store.deals.find((d) => d.id === id);
    if (!window.confirm(`Delete "${target?.inputs.address || 'this deal'}"? This cannot be undone.`)) return;
    setStore((st) => {
      const rest = st.deals.filter((d) => d.id !== id);
      return { ...st, deals: rest.length > 0 ? rest : [newDeal(st.settings)] };
    });
  };
  const doExport = () => {
    const blob = new Blob([exportJson(store)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const aEl = document.createElement('a');
    aEl.href = url;
    aEl.download = `deal-desk-${new Date().toISOString().slice(0, 10)}.json`;
    aEl.click();
    URL.revokeObjectURL(url);
  };
  const doImport = async (file: File) => {
    try {
      const incoming = importJson(await file.text());
      const merge = window.confirm(`Import ${incoming.deals.length} deal(s).\n\nOK = merge into existing deals\nCancel = replace everything (deals + rules)`);
      setStore((st) => {
        if (!merge) return incoming.deals.length > 0 ? incoming : { ...incoming, deals: [newDeal(incoming.settings)] };
        const ids = new Set(st.deals.map((d) => d.id));
        return { ...st, deals: [...incoming.deals.filter((d) => !ids.has(d.id)), ...st.deals] };
      });
    } catch {
      window.alert('That file could not be read as a Deal Desk export.');
    }
  };

  if (!unlocked) return <Gate onUnlock={() => setUnlockedState(true)} />;
  if (!deal || !a) return <div className="min-h-screen bg-linen" />;

  const r = a.recommendation;

  return (
    <div className="min-h-screen bg-linen text-espresso">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-espresso/10 bg-linen/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
          <div className="mr-auto">
            <div className="text-[10px] uppercase tracking-wider text-driftwood">Father &amp; Son</div>
            <div className="font-serif text-lg leading-none">Deal Desk</div>
          </div>
          <nav className="order-last flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${tab === t.id ? 'bg-espresso text-cream' : 'text-espresso/70 hover:bg-cream'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button type="button" className="dd-btn-ghost" onClick={doExport} title="Download all deals + rules as JSON">
              Export
            </button>
            <button type="button" className="dd-btn-ghost" onClick={() => fileRef.current?.click()} title="Import a JSON export">
              Import
            </button>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
            <button
              type="button"
              className="dd-btn-ghost"
              onClick={() => {
                setUnlocked(false);
                setUnlockedState(false);
              }}
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:pb-8">
        {/* Deal strip */}
        {tab !== 'deals' && tab !== 'settings' && (
          <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-espresso/10 bg-white/70 px-4 py-3">
            <label className="block min-w-[14rem] flex-1">
              <span className="text-[11px] uppercase tracking-wider text-driftwood">Deal</span>
              <select className="dd-input" value={deal.id} onChange={(e) => setCurrentId(e.target.value)}>
                {store.deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.inputs.address || 'Untitled deal'}
                    {d.inputs.city ? ` — ${d.inputs.city}` : ''} ({d.status})
                  </option>
                ))}
              </select>
            </label>
            <div className="w-44">
              <NumField label="Purchase price" value={deal.inputs.purchasePrice} onChange={(v) => setInputs({ purchasePrice: v })} emphasis hint="the price we're testing" />
            </div>
            <div className="flex gap-1 pb-0.5">
              <button type="button" className="dd-btn" onClick={addDeal}>
                + New
              </button>
              <button type="button" className="dd-btn-ghost" onClick={duplicateDeal} title="Duplicate this deal">
                Duplicate
              </button>
            </div>
          </div>
        )}

        {tab === 'underwrite' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              <PropertySection i={deal.inputs} set={setInputs} s={settings} a={a} />
              <ValuationSection i={deal.inputs} set={setInputs} s={settings} a={a} />
              <RehabSection i={deal.inputs} set={setInputs} s={settings} a={a} />
              <FinancingSection i={deal.inputs} set={setInputs} s={settings} a={a} />
              <HoldingSaleSection i={deal.inputs} set={setInputs} s={settings} a={a} />
              <WholesaleSection i={deal.inputs} set={setInputs} s={settings} a={a} />
            </div>
            <div className="space-y-3 lg:col-span-5">
              <div className="space-y-3 lg:sticky lg:top-16">
                <VerdictCard a={a} i={deal.inputs} s={settings} onSetPrice={(v) => setInputs({ purchasePrice: v })} />
                <ExitComparison a={a} i={deal.inputs} s={settings} onSetPrice={(v) => setInputs({ purchasePrice: v })} />
              </div>
            </div>
          </div>
        )}

        {tab === 'scenarios' && (
          <div className="space-y-3">
            <VerdictCard a={a} i={deal.inputs} s={settings} onSetPrice={(v) => setInputs({ purchasePrice: v })} />
            <ScenarioTable a={a} i={deal.inputs} s={settings} onSetPrice={() => {}} />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <FlipBreakdown a={a} i={deal.inputs} s={settings} onSetPrice={() => {}} />
              <WholesaleBreakdown a={a} i={deal.inputs} s={settings} onSetPrice={() => {}} />
            </div>
            <SensitivityGrid a={a} i={deal.inputs} s={settings} onSetPrice={() => {}} />
          </div>
        )}

        {tab === 'actuals' && <ActualsPanel deal={deal} a={a} set={setActuals} setDeal={setDealMeta} />}

        {tab === 'deals' && (
          <div className="space-y-3">
            <InsightsPanel deals={store.deals} s={settings} />
            <DealsPanel
              deals={store.deals}
              s={settings}
              currentId={deal.id}
              onOpen={(id) => {
                setCurrentId(id);
                setTab('underwrite');
              }}
              onDelete={deleteDeal}
              onNew={addDeal}
            />
          </div>
        )}

        {tab === 'settings' && (
          <SettingsPanel
            s={settings}
            set={setSettings}
            onReset={() => window.confirm('Reset all rules to Father & Son defaults?') && setStore((st) => ({ ...st, settings: DEFAULT_SETTINGS }))}
          />
        )}
      </main>

      {/* Mobile summary bar */}
      {tab === 'underwrite' && (
        <button
          type="button"
          onClick={() => setTab('scenarios')}
          className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-espresso/10 bg-white px-4 py-3 text-left lg:hidden"
        >
          <span className="flex items-center gap-2">
            <VerdictPill verdict={r.verdict} size="sm" />
            <span className="text-sm font-medium">{r.exit === null ? 'Pass' : r.exit === 'flip' ? 'Flip' : 'Wholesale'}</span>
          </span>
          <span className="text-xs text-driftwood">
            Walk-away <b className="text-espresso tabular-nums">{fmtMoney(r.offer.walkAway)}</b>
          </span>
        </button>
      )}
    </div>
  );
}
