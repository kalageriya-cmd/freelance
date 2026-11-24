import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Play,
  TrendingUp,
} from 'lucide-react';
import { RevenueChart } from '../components/RevenueChart';
import { StatusBadge } from '../components/StatusBadge';
import { REVENUE_SERIES_6M } from '../data/initialData';
import type {
  ActiveTimerState,
  Client,
  Deliverable,
  Invoice,
  NavScreen,
  PracticeSettings,
  Project,
  TimeEntry,
} from '../types/practice';
import {
  formatCurrency,
  formatShortDate,
  getInvoiceTotal,
} from '../utils/formatters';

interface OverviewScreenProps {
  clients: Client[];
  projects: Project[];
  deliverables: Deliverable[];
  invoices: Invoice[];
  timeEntries: TimeEntry[];
  settings: PracticeSettings;
  activeTimer: ActiveTimerState;
  onNavigate: (screen: NavScreen) => void;
  onToggleDeliverable: (deliverableId: string) => void;
  onStartTimerForProject: (projectId: string) => void;
  onOpenInvoice: (invoiceId: string) => void;
}

export function OverviewScreen({
  clients,
  projects,
  deliverables,
  invoices,
  timeEntries,
  settings,
  activeTimer,
  onNavigate,
  onToggleDeliverable,
  onStartTimerForProject,
  onOpenInvoice,
}: OverviewScreenProps) {
  const paidTotal = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + getInvoiceTotal(i), 0);

  const outstandingInvoices = invoices.filter(
    (i) => i.status === 'In Review' || i.status === 'Overdue'
  );
  const outstandingTotal = outstandingInvoices.reduce(
    (sum, i) => sum + getInvoiceTotal(i),
    0
  );

  const unbilledEntries = timeEntries.filter(
    (t) => t.billable && !t.billedInvoiceId
  );
  const unbilledHours = unbilledEntries.reduce(
    (sum, t) => sum + t.durationMinutes / 60,
    0
  );
  const unbilledAmount = unbilledEntries.reduce((sum, t) => {
    const proj = projects.find((p) => p.id === t.projectId);
    return sum + (t.durationMinutes / 60) * (proj?.hourlyRate ?? settings.defaultHourlyRate);
  }, 0);

  const activeProjects = projects.filter((p) => p.status !== 'Completed');
  const totalLogged = activeProjects.reduce((s, p) => s + p.loggedHours, 0);
  const totalCap = activeProjects.reduce((s, p) => s + p.budgetCapHours, 0);
  const utilizationPct = totalCap > 0 ? Math.min(100, (totalLogged / totalCap) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 4-Column KPI Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="elevation-1 elevation-2-hover rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
              Collected Revenue
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tnum"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#15803D',
              }}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +14.2%
            </span>
          </div>
          <p className="mono-metric text-2xl sm:text-[26px] font-semibold text-[#20243A] mt-3">
            {formatCurrency(paidTotal)}
          </p>
          <p className="text-xs text-[#8A90A5] mt-1.5 tnum">
            {invoices.filter((i) => i.status === 'Paid').length} settled statements
          </p>
        </div>

        <div className="elevation-1 elevation-2-hover rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
              Unbilled Balance
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tnum"
              style={{
                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                color: '#4D41DF',
              }}
            >
              {unbilledHours.toFixed(1)} hrs
            </span>
          </div>
          <p className="mono-metric text-2xl sm:text-[26px] font-semibold text-[#20243A] mt-3">
            {formatCurrency(unbilledAmount)}
          </p>
          <p className="text-xs text-[#8A90A5] mt-1.5 tnum">
            {unbilledEntries.length} billable logs ready to invoice
          </p>
        </div>

        <div className="elevation-1 elevation-2-hover rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
              Outstanding A/R
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tnum"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#B45309',
              }}
            >
              {outstandingInvoices.length} open
            </span>
          </div>
          <p className="mono-metric text-2xl sm:text-[26px] font-semibold text-[#20243A] mt-3">
            {formatCurrency(outstandingTotal)}
          </p>
          <p className="text-xs text-[#8A90A5] mt-1.5">
            {invoices.some((i) => i.status === 'Overdue')
              ? '1 statement past due'
              : 'All within Net terms'}
          </p>
        </div>

        <div className="elevation-1 elevation-2-hover rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
              Retainer Capacity
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-[#F0F2F8] text-[#20243A] tnum">
              Target 80%
            </span>
          </div>
          <p className="mono-metric text-2xl sm:text-[26px] font-semibold text-[#20243A] mt-3">
            {utilizationPct.toFixed(1)}%
          </p>
          <p className="text-xs text-[#8A90A5] mt-1.5 tnum">
            {totalLogged.toFixed(1)} of {totalCap} committed hrs
          </p>
        </div>
      </div>

      {/* 12-Column Middle Grid: 8-Col Chart + 4-Col Deliverables */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-8">
          <RevenueChart
            data={REVENUE_SERIES_6M}
            monthlyTarget={settings.monthlyRevenueTarget}
          />
        </div>

        <section className="xl:col-span-4 elevation-1 rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E8EAF2]">
              <div>
                <h2 className="text-[15px] font-semibold text-[#151B2C]">
                  Upcoming Deliverables
                </h2>
                <p className="text-xs text-[#8A90A5] mt-0.5">
                  Milestones across active retainers
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="text-xs font-medium text-[#4D41DF] hover:text-[#3622CA] inline-flex items-center gap-0.5 whitespace-nowrap"
              >
                <span>All</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <ul className="divide-y divide-[#E8EAF2] mt-1">
              {deliverables.slice(0, 5).map((del) => {
                const proj = projects.find((p) => p.id === del.projectId);
                return (
                  <li
                    key={del.id}
                    className="py-3.5 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={del.completed}
                        aria-label={`Toggle ${del.title}`}
                        onClick={() => onToggleDeliverable(del.id)}
                        className={`mt-0.5 h-4 w-4 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                          del.completed
                            ? 'bg-[#6C63FF] border border-[#6C63FF] text-white'
                            : 'bg-[#FFFFFF] border-[1.5px] border-[#D5D8E4] hover:border-[#6C63FF]'
                        }`}
                      >
                        {del.completed && <Check className="h-3 w-3 stroke-[2.5]" />}
                      </button>

                      <div className="min-w-0">
                        <p
                          className={`text-[13px] font-medium leading-snug ${
                            del.completed
                              ? 'line-through text-[#8A90A5]'
                              : 'text-[#151B2C]'
                          }`}
                        >
                          {del.title}
                        </p>
                        <p className="text-[11.5px] text-[#8A90A5] mt-1 tnum">
                          {proj?.code ?? 'PRJ'} · Due {formatShortDate(del.dueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <StatusBadge
                        status={del.completed ? 'Done' : del.status}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="exec-btn-secondary w-full mt-4 h-9 inline-flex items-center justify-center gap-1.5"
          >
            <span>Manage Deliverables</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#8A90A5]" />
          </button>
        </section>
      </div>

      {/* 12-Column Bottom Grid: 7-Col Active Engagements + 5-Col Recent Invoices */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Active Engagements Table */}
        <section className="xl:col-span-7 elevation-1 rounded-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[#E8EAF2]">
            <div>
              <h2 className="text-[15px] font-semibold text-[#151B2C]">
                Active Engagements
              </h2>
              <p className="text-xs text-[#8A90A5] mt-0.5">
                Retainer allocation and live stopwatch controls
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="text-xs font-medium text-[#4D41DF] hover:text-[#3622CA] inline-flex items-center gap-0.5 whitespace-nowrap"
            >
              <span>View all</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#E8EAF2]">
                  <th className="py-2.5 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Engagement
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Allocation
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Status
                  </th>
                  <th className="py-2.5 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Timer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF2]">
                {projects.map((proj) => {
                  const client = clients.find((c) => c.id === proj.clientId);
                  const pct = Math.min(
                    100,
                    Math.round((proj.loggedHours / proj.budgetCapHours) * 100)
                  );
                  const isTimerActive =
                    activeTimer.isRunning && activeTimer.projectId === proj.id;

                  return (
                    <tr
                      key={proj.id}
                      className="h-[56px] hover:bg-[#F9FAFD] transition-colors"
                    >
                      <td className="px-6 py-3">
                        <p className="text-[13.5px] font-semibold text-[#151B2C] truncate max-w-[230px]">
                          {proj.name}
                        </p>
                        <p className="text-xs text-[#8A90A5] tnum">
                          {client?.company} · ${proj.hourlyRate}/hr
                        </p>
                      </td>
                      <td className="px-3 py-3 min-w-[130px]">
                        <div className="flex items-center justify-between text-xs tnum mb-1">
                          <span className="font-medium text-[#20243A]">
                            {proj.loggedHours.toFixed(1)}h
                          </span>
                          <span className="text-[#8A90A5]">
                            / {proj.budgetCapHours}h
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#F0F2F8] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#6C63FF]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={proj.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        {proj.status !== 'Completed' ? (
                          <button
                            type="button"
                            onClick={() => onStartTimerForProject(proj.id)}
                            className={`h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors whitespace-nowrap ${
                              isTimerActive
                                ? 'bg-[#6C63FF] text-white'
                                : 'border border-[#E8EAF2] bg-[#FFFFFF] text-[#20243A] hover:bg-[#F7F8FC]'
                            }`}
                          >
                            <Play className="h-3 w-3" />
                            <span>{isTimerActive ? 'Active' : 'Track'}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-[#8A90A5]">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Invoices Ledger */}
        <section className="xl:col-span-5 elevation-1 rounded-3xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-[#E8EAF2]">
            <div>
              <h2 className="text-[15px] font-semibold text-[#151B2C]">
                Recent Invoices
              </h2>
              <p className="text-xs text-[#8A90A5] mt-0.5">
                Click any statement to inspect or record payment
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('invoices')}
              className="text-xs font-medium text-[#4D41DF] hover:text-[#3622CA] inline-flex items-center gap-0.5 whitespace-nowrap"
            >
              <span>Ledger</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#E8EAF2]">
                  <th className="py-2.5 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Statement
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Amount
                  </th>
                  <th className="py-2.5 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF2]">
                {invoices.slice(0, 5).map((inv) => {
                  const client = clients.find((c) => c.id === inv.clientId);
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => onOpenInvoice(inv.id)}
                      className="h-[54px] hover:bg-[#F9FAFD] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-3">
                        <p className="text-[13.5px] font-semibold text-[#151B2C] font-mono-tnum">
                          {inv.number}
                        </p>
                        <p className="text-xs text-[#8A90A5] truncate max-w-[160px]">
                          {client?.company ?? 'Client'}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-[13.5px] text-[#151B2C] tnum">
                        {formatCurrency(getInvoiceTotal(inv))}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <StatusBadge status={inv.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
