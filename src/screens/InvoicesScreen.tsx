import { useMemo, useState } from 'react';
import { Check, Eye, Plus, Search } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import type { Client, Invoice, InvoiceStatus } from '../types/practice';
import {
  formatCurrencyExact,
  formatShortDate,
  getInvoiceTotal,
} from '../utils/formatters';

interface InvoicesScreenProps {
  invoices: Invoice[];
  clients: Client[];
  onOpenInvoice: (invoiceId: string) => void;
  onUpdateStatus: (invoiceId: string, status: InvoiceStatus) => void;
  onOpenCreateInvoice: () => void;
}

export function InvoicesScreen({
  invoices,
  clients,
  onOpenInvoice,
  onUpdateStatus,
  onOpenCreateInvoice,
}: InvoicesScreenProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');
  const [search, setSearch] = useState('');

  const summary = useMemo(() => {
    const paid = invoices
      .filter((i) => i.status === 'Paid')
      .reduce((s, i) => s + getInvoiceTotal(i), 0);
    const pending = invoices
      .filter((i) => i.status === 'In Review' || i.status === 'Draft')
      .reduce((s, i) => s + getInvoiceTotal(i), 0);
    const overdue = invoices
      .filter((i) => i.status === 'Overdue')
      .reduce((s, i) => s + getInvoiceTotal(i), 0);
    return { paid, pending, overdue };
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter((inv) => {
      if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
      if (!q) return true;
      const client = clients.find((c) => c.id === inv.clientId);
      return (
        inv.number.toLowerCase().includes(q) ||
        (client?.company.toLowerCase().includes(q) ?? false) ||
        (client?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [invoices, clients, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* 3-Column Financial Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="elevation-1 rounded-3xl p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
            Settled &amp; Paid
          </p>
          <p className="mono-metric text-2xl font-semibold text-[#151B2C] mt-2">
            {formatCurrencyExact(summary.paid)}
          </p>
          <p className="text-xs text-[#15803D] font-medium mt-1">
            Cleared into operating account
          </p>
        </div>

        <div className="elevation-1 rounded-3xl p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
            In Review / Pending
          </p>
          <p className="mono-metric text-2xl font-semibold text-[#151B2C] mt-2">
            {formatCurrencyExact(summary.pending)}
          </p>
          <p className="text-xs text-[#B45309] font-medium mt-1">
            Awaiting client AP remittance
          </p>
        </div>

        <div className="elevation-1 rounded-3xl p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
            Overdue Balance
          </p>
          <p className="mono-metric text-2xl font-semibold text-[#151B2C] mt-2">
            {formatCurrencyExact(summary.overdue)}
          </p>
          <p className="text-xs text-[#B91C1C] font-medium mt-1">
            Requires follow-up notice
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter invoices"
          className="inline-flex flex-wrap items-center p-1 rounded-lg bg-[#F0F2F8] border border-[#E8EAF2] self-start"
        >
          {(['All', 'Paid', 'In Review', 'Overdue', 'Draft'] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-[#FFFFFF] text-[#151B2C] shadow-xs'
                    : 'text-[#46464D] hover:text-[#151B2C]'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="h-4 w-4 text-[#8A90A5] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice # or client..."
              aria-label="Search invoices"
              className="exec-input w-full pl-9"
            />
          </div>

          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="exec-btn-primary h-10 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="elevation-1 rounded-3xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-[#151B2C]">
              No invoices match this view
            </p>
            <p className="text-xs text-[#8A90A5] mt-1">
              Clear your search filter or issue a new statement.
            </p>
            <button
              type="button"
              onClick={onOpenCreateInvoice}
              className="exec-btn-primary mt-4"
            >
              Issue New Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] border-b border-[#E8EAF2]">
                  <th className="py-3 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Invoice #
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Client
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Issued
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Due Date
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Status
                  </th>
                  <th className="py-3 px-6 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF2]">
                {filtered.map((inv) => {
                  const client = clients.find((c) => c.id === inv.clientId);
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => onOpenInvoice(inv.id)}
                      className="h-[56px] hover:bg-[#F9FAFD] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-3 font-mono-tnum text-[13px] font-semibold text-[#151B2C] whitespace-nowrap">
                        {inv.number}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={client?.avatarUrl}
                            alt={client?.name ?? 'Client'}
                            initials={client?.initials ?? 'CL'}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-medium text-[#151B2C] truncate max-w-[200px]">
                              {client?.company ?? 'Client'}
                            </p>
                            <p className="text-xs text-[#8A90A5] truncate">
                              {client?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#46464D] tnum whitespace-nowrap">
                        {formatShortDate(inv.issueDate)}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#46464D] tnum whitespace-nowrap">
                        {formatShortDate(inv.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[13.5px] text-[#151B2C] tnum whitespace-nowrap">
                        {formatCurrencyExact(getInvoiceTotal(inv))}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td
                        className="px-6 py-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          {inv.status !== 'Paid' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(inv.id, 'Paid')}
                              className="h-8 px-2.5 rounded-lg border border-[#E8EAF2] bg-[#FFFFFF] text-xs font-medium text-[#15803D] hover:bg-[#F0FDF4] inline-flex items-center gap-1 transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Mark Paid</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onOpenInvoice(inv.id)}
                            aria-label={`Inspect ${inv.number}`}
                            className="h-8 px-2.5 rounded-lg border border-[#E8EAF2] bg-[#FFFFFF] text-xs font-medium text-[#20243A] hover:bg-[#F7F8FC] inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#8A90A5]" />
                            <span>View</span>
                          </button>
                        </div>
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
