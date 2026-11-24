import { useMemo, useState } from 'react';
import { FilePlus2, Plus, Trash2 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import type { Client, Project, TimeEntry } from '../types/practice';
import {
  formatCurrencyExact,
  formatMinutesToDuration,
  formatShortDate,
} from '../utils/formatters';

interface TimeLedgerScreenProps {
  entries: TimeEntry[];
  projects: Project[];
  clients: Client[];
  onAddEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  onDeleteEntry: (entryId: string) => void;
  onDraftInvoiceFromUnbilled: () => void;
}

export function TimeLedgerScreen({
  entries,
  projects,
  clients,
  onAddEntry,
  onDeleteEntry,
  onDraftInvoiceFromUnbilled,
}: TimeLedgerScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unbilled' | 'billed'>('all');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [hoursInput, setHoursInput] = useState('1.5');
  const [date, setDate] = useState('2026-11-24');
  const [billable, setBillable] = useState(true);

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (filter === 'unbilled') return entry.billable && !entry.billedInvoiceId;
      if (filter === 'billed') return Boolean(entry.billedInvoiceId);
      return true;
    });
  }, [entries, filter]);

  const unbilledStats = useMemo(() => {
    const list = entries.filter((e) => e.billable && !e.billedInvoiceId);
    const hours = list.reduce((s, e) => s + e.durationMinutes / 60, 0);
    const amount = list.reduce((s, e) => {
      const p = projects.find((pr) => pr.id === e.projectId);
      return s + (e.durationMinutes / 60) * (p?.hourlyRate ?? 240);
    }, 0);
    return { count: list.length, hours, amount };
  }, [entries, projects]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(hoursInput);
    if (!projectId || !description.trim() || isNaN(hours) || hours <= 0) return;

    onAddEntry({
      projectId,
      description: description.trim(),
      date,
      durationMinutes: Math.round(hours * 60),
      billable,
    });
    setDescription('');
    setHoursInput('1.0');
  };

  return (
    <div className="space-y-6">
      {/* Manual Time Entry Bar */}
      <form
        onSubmit={handleLogSubmit}
        className="elevation-1 rounded-3xl p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-[15px] font-semibold text-[#151B2C]">
              Log Billable Session
            </h2>
            <p className="text-xs text-[#8A90A5] mt-0.5">
              Entries automatically sync with project hour caps and invoice drafting.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#46464D] tnum">
              Unbilled:{' '}
              <strong className="font-semibold text-[#151B2C]">
                {unbilledStats.hours.toFixed(1)}h (
                {formatCurrencyExact(unbilledStats.amount)})
              </strong>
            </span>
            <button
              type="button"
              onClick={onDraftInvoiceFromUnbilled}
              disabled={unbilledStats.count === 0}
              className="exec-btn-accent h-9 inline-flex items-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              <span>Invoice Unbilled</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-[#46464D] mb-1">
              Engagement
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="exec-input w-full"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-[#46464D] mb-1">
              Work Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Advisory session, spec review, or sprint delivery..."
              className="exec-input w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[#46464D] mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="exec-input w-full tnum"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-[#46464D] mb-1">
              Hours
            </label>
            <input
              type="number"
              step="0.25"
              min="0.25"
              required
              value={hoursInput}
              onChange={(e) => setHoursInput(e.target.value)}
              className="exec-input w-full tnum text-right"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#46464D] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={billable}
                onChange={(e) => setBillable(e.target.checked)}
                className="h-4 w-4 rounded accent-[#6C63FF]"
              />
              <span>Billable</span>
            </label>

            <button
              type="submit"
              className="exec-btn-primary h-10 flex-1 inline-flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Log</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div
          role="tablist"
          aria-label="Time entry filter"
          className="inline-flex items-center p-1 rounded-lg bg-[#F0F2F8] border border-[#E8EAF2]"
        >
          {(
            [
              { id: 'all', label: 'All Entries' },
              { id: 'unbilled', label: 'Unbilled Ready' },
              { id: 'billed', label: 'Invoiced' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#FFFFFF] text-[#151B2C] shadow-xs'
                  : 'text-[#46464D] hover:text-[#151B2C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="elevation-1 rounded-3xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-[#151B2C]">
              No time logs in this view
            </p>
            <p className="text-xs text-[#8A90A5] mt-1">
              Use the stopwatch dock or form above to record billable sessions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#E8EAF2]">
                  <th className="py-3 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Date
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Engagement &amp; Work Performed
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Duration
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Billable Value
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Billing State
                  </th>
                  <th className="py-3 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF2]">
                {filtered.map((entry) => {
                  const project = projects.find((p) => p.id === entry.projectId);
                  const client = clients.find((c) => c.id === project?.clientId);
                  const value =
                    entry.billable && project
                      ? (entry.durationMinutes / 60) * project.hourlyRate
                      : 0;

                  return (
                    <tr
                      key={entry.id}
                      className="h-[54px] hover:bg-[#F9FAFD] transition-colors"
                    >
                      <td className="px-6 py-3 text-[13px] text-[#46464D] tnum whitespace-nowrap">
                        {formatShortDate(entry.date)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13.5px] font-medium text-[#151B2C]">
                          {entry.description}
                        </p>
                        <p className="text-xs text-[#8A90A5] tnum">
                          {project?.code} · {client?.company ?? 'Client'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-mono-tnum text-[13px] font-medium text-[#20243A] whitespace-nowrap">
                        {formatMinutesToDuration(entry.durationMinutes)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[13.5px] text-[#151B2C] tnum whitespace-nowrap">
                        {entry.billable ? formatCurrencyExact(value) : 'Non-billable'}
                      </td>
                      <td className="px-4 py-3">
                        {entry.billedInvoiceId ? (
                          <StatusBadge status="Paid" />
                        ) : entry.billable ? (
                          <StatusBadge status="Active" />
                        ) : (
                          <StatusBadge status="Draft" />
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteEntry(entry.id)}
                          aria-label="Delete time entry"
                          className="h-8 w-8 rounded-lg text-[#8A90A5] hover:text-[#B91C1C] hover:bg-[#FEE2E2]/50 inline-flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
