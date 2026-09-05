import type { Deal, Settings } from './types.ts';
import { DEFAULT_SETTINGS, defaultInputs, emptyActuals } from './defaults.ts';

const KEY = 'fs-deal-desk:v1';
const UNLOCK_KEY = 'fs-deal-desk:unlocked';

export interface Store {
  version: 1;
  deals: Deal[];
  settings: Settings;
}

export function mergeSettings(partial: Partial<Settings> | undefined): Settings {
  const s = { ...DEFAULT_SETTINGS, ...(partial ?? {}) };
  s.rehabTiers = { ...DEFAULT_SETTINGS.rehabTiers, ...(partial?.rehabTiers ?? {}) };
  if (!Array.isArray(s.scenarios) || s.scenarios.length === 0) s.scenarios = DEFAULT_SETTINGS.scenarios;
  if (!Array.isArray(s.homeMarketCounties)) s.homeMarketCounties = DEFAULT_SETTINGS.homeMarketCounties;
  return s;
}

function mergeDeal(raw: Partial<Deal>, settings: Settings): Deal {
  const now = new Date().toISOString();
  return {
    id: raw.id ?? Math.random().toString(36).slice(2),
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
    status: raw.status ?? 'Lead',
    exitTaken: raw.exitTaken ?? null,
    inputs: { ...defaultInputs(settings), ...(raw.inputs ?? {}) },
    actuals: { ...emptyActuals(), ...(raw.actuals ?? {}) },
  };
}

export function normalizeStore(raw: unknown): Store {
  const r = (raw ?? {}) as Partial<Store>;
  const settings = mergeSettings(r.settings);
  const deals = Array.isArray(r.deals) ? r.deals.map((d) => mergeDeal(d, settings)) : [];
  return { version: 1, deals, settings };
}

export function loadStore(): Store {
  try {
    const text = localStorage.getItem(KEY);
    if (!text) return normalizeStore(null);
    return normalizeStore(JSON.parse(text));
  } catch {
    return normalizeStore(null);
  }
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

export function exportJson(store: Store): string {
  return JSON.stringify({ ...store, exportedAt: new Date().toISOString() }, null, 2);
}

export function importJson(text: string): Store {
  return normalizeStore(JSON.parse(text));
}

export function isUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

export function setUnlocked(v: boolean): void {
  try {
    if (v) localStorage.setItem(UNLOCK_KEY, '1');
    else localStorage.removeItem(UNLOCK_KEY);
  } catch {
    /* ignore */
  }
}

export function passcode(): string {
  const env = (import.meta.env?.VITE_DEAL_DESK_PASSCODE as string | undefined)?.trim();
  return env && env.length > 0 ? env : 'fatherson';
}
