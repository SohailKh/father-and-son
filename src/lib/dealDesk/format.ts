export function fmtMoney(n: number, opts: { cents?: boolean; sign?: boolean } = {}): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const s = abs.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: opts.cents ? 2 : 0,
    minimumFractionDigits: opts.cents ? 2 : 0,
  });
  if (n < 0) return `(${s})`;
  return opts.sign && n > 0 ? `+${s}` : s;
}

export function fmtPct(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return '—';
  return `${(n * 100).toFixed(digits)}%`;
}

export function fmtMonths(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const r = Math.round(n * 10) / 10;
  return `${r} mo`;
}

export function fmtNumber(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function roundDownTo(n: number, step: number): number {
  if (step <= 0) return n;
  return Math.floor(n / step) * step;
}

export function roundTo(n: number, step: number): number {
  if (step <= 0) return n;
  return Math.round(n / step) * step;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
