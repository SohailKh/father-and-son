import { useState } from 'react';
import type { ReactNode } from 'react';
import { fmtMoney, fmtPct } from '../../lib/dealDesk/format.ts';

type Kind = 'money' | 'pct' | 'int' | 'dec' | 'months' | 'psf';

function display(kind: Kind, v: number): string {
  if (!Number.isFinite(v)) return '';
  switch (kind) {
    case 'money':
      return fmtMoney(v);
    case 'pct':
      return fmtPct(v, v * 100 % 1 === 0 ? 0 : 2);
    case 'months':
      return `${Math.round(v * 10) / 10} mo`;
    case 'psf':
      return `$${Math.round(v)}/sf`;
    case 'int':
      return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
    default:
      return String(Math.round(v * 100) / 100);
  }
}

function raw(kind: Kind, v: number): string {
  if (!Number.isFinite(v) || v === 0) return '';
  if (kind === 'pct') return String(Math.round(v * 10000) / 100);
  return String(Math.round(v * 100) / 100);
}

function parse(kind: Kind, text: string): number | null {
  const cleaned = text.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return 0;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return kind === 'pct' ? n / 100 : n;
}

interface NumProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  kind?: Kind;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  emphasis?: boolean;
}

/** Numeric input that shows a formatted value until focused. Commits on every keystroke. */
export function NumField({ label, value, onChange, kind = 'money', hint, placeholder, disabled, emphasis }: NumProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(raw(kind, value));

  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="whitespace-nowrap text-[11px] uppercase tracking-wider text-driftwood">{label}</span>
        {hint && <span className="text-[10px] text-driftwood/70 truncate">{hint}</span>}
      </span>
      <input
        type="text"
        inputMode="decimal"
        disabled={disabled}
        placeholder={placeholder ?? (kind === 'pct' ? '0%' : kind === 'money' ? '$0' : '0')}
        value={focused ? text : value === 0 && !placeholder ? '' : display(kind, value)}
        onFocus={() => {
          setText(raw(kind, value));
          setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setText(e.target.value);
          const n = parse(kind, e.target.value);
          if (n !== null) onChange(n);
        }}
        className={`dd-input ${emphasis ? 'dd-input-emphasis' : ''} ${disabled ? 'opacity-50' : ''}`}
      />
    </label>
  );
}

interface TextProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}

export function TextField({ label, value, onChange, placeholder, multiline, type = 'text' }: TextProps) {
  return (
    <label className="block">
      <span className="whitespace-nowrap text-[11px] uppercase tracking-wider text-driftwood">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="dd-input resize-y min-h-[4.5rem]"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="dd-input"
        />
      )}
    </label>
  );
}

interface SelectProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  hint?: string;
}

export function SelectField<T extends string | number>({ label, value, onChange, options, hint }: SelectProps<T>) {
  const numeric = typeof value === 'number';
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="whitespace-nowrap text-[11px] uppercase tracking-wider text-driftwood">{label}</span>
        {hint && <span className="text-[10px] text-driftwood/70 truncate">{hint}</span>}
      </span>
      <select
        value={String(value)}
        onChange={(e) => onChange((numeric ? Number(e.target.value) : e.target.value) as T)}
        className="dd-input"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-3 rounded-md border border-espresso/15 bg-cream px-3 py-2 text-left"
    >
      <span>
        <span className="block text-[11px] uppercase tracking-wider text-driftwood">{label}</span>
        {hint && <span className="block text-xs text-espresso/70">{hint}</span>}
      </span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${value ? 'bg-emerald-600' : 'bg-espresso/25'}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </span>
    </button>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex rounded-md border border-espresso/15 bg-cream p-0.5 text-xs">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded px-3 py-1.5 font-medium transition-colors ${value === o.value ? 'bg-espresso text-cream' : 'text-espresso/70 hover:text-espresso'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Section({ title, subtitle, children, right, defaultOpen = true }: { title: string; subtitle?: string; children: ReactNode; right?: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-lg border border-espresso/10 bg-white/70">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <button type="button" onClick={() => setOpen(!open)} className="flex items-center gap-2 text-left">
          <span className={`inline-block text-driftwood transition-transform ${open ? 'rotate-90' : ''}`}>▸</span>
          <span>
            <span className="block font-serif text-base text-espresso">{title}</span>
            {subtitle && <span className="block text-xs text-driftwood">{subtitle}</span>}
          </span>
        </button>
        {right}
      </header>
      {open && <div className="border-t border-espresso/10 px-4 py-4">{children}</div>}
    </section>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const cls = cols === 4 ? 'sm:grid-cols-4' : cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
  return <div className={`grid grid-cols-1 gap-3 ${cls}`}>{children}</div>;
}

export function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'good' | 'bad' | 'warn' | 'muted' }) {
  const color =
    tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-red-700' : tone === 'warn' ? 'text-amber-700' : 'text-espresso';
  return (
    <div className="rounded-md bg-cream/80 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-driftwood">{label}</div>
      <div className={`font-serif text-lg leading-tight ${color}`}>{value}</div>
      {sub && <div className="text-[11px] text-driftwood">{sub}</div>}
    </div>
  );
}

export function Row({ label, value, strong, tone, indent }: { label: string; value: string; strong?: boolean; tone?: 'good' | 'bad' | 'muted'; indent?: boolean }) {
  const color = tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-red-700' : tone === 'muted' ? 'text-driftwood' : '';
  return (
    <div className={`flex items-baseline justify-between gap-3 py-1 text-sm ${strong ? 'border-t border-espresso/15 mt-1 pt-2 font-semibold' : ''} ${indent ? 'pl-3' : ''}`}>
      <span className={strong ? '' : 'text-espresso/80'}>{label}</span>
      <span className={`tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

export function VerdictPill({ verdict, size = 'md' }: { verdict: 'BUY' | 'REVIEW' | 'PASS'; size?: 'sm' | 'md' | 'lg' }) {
  const cls =
    verdict === 'BUY' ? 'bg-emerald-600 text-white' : verdict === 'REVIEW' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white';
  const sz = size === 'lg' ? 'px-4 py-1.5 text-base' : size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  return <span className={`inline-block rounded-full font-semibold tracking-wider ${cls} ${sz}`}>{verdict}</span>;
}
