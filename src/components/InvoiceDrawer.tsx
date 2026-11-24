import { Check, Printer, Send, Trash2, X } from 'lucide-react';
import type {
  Client,
  Invoice,
  InvoiceStatus,
  PracticeSettings,
  Project,
} from '../types/practice';
import {
  formatCurrencyExact,
  formatShortDate,
  getInvoiceTotal,
} from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface InvoiceDrawerProps {
  invoice: Invoice | null;
  client?: Client;
  project?: Project;
  settings: PracticeSettings;
  onClose: () => void;
  onUpdateStatus: (invoiceId: string, status: InvoiceStatus) => void;
  onDelete: (invoiceId: string) => void;
}

export function InvoiceDrawer({
  invoice,
  client,
  project,
  settings,
  onClose,
  onUpdateStatus,
  onDelete,
}: InvoiceDrawerProps) {
  if (!invoice) return null;

  const total = getInvoiceTotal(invoice);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`Invoice ${invoice.number}`}
    >
      <div
        className="fixed inset-0 bg-[#101632]/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl bg-[#FFFFFF] h-full shadow-2xl border-l border-[#E8EAF2] flex flex-col">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E8EAF2] bg-[#FAFBFD]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono-tnum text-sm font-semibold text-[#151B2C]">
              {invoice.number}
            </span>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="exec-btn-secondary h-8 px-2.5 text-xs inline-flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5 text-[#8A90A5]" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice drawer"
              className="h-8 w-8 rounded-lg text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Sender & Recipient */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#E8EAF2]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#252B48] text-white font-semibold text-xs">
                  M
                </span>
                <span className="text-sm font-semibold text-[#101632]">
                  {settings.practiceName}
                </span>
              </div>
              <p className="text-xs text-[#46464D]">{settings.principalName}</p>
              <p className="text-xs text-[#8A90A5]">{settings.email}</p>
              <p className="text-xs text-[#8A90A5] mt-0.5">{settings.taxId}</p>
            </div>

            <div className="sm:text-right">
              <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Billed To
              </p>
              <p className="text-sm font-semibold text-[#151B2C] mt-1">
                {client?.company ?? 'Client Organization'}
              </p>
              <p className="text-xs text-[#46464D]">{client?.name}</p>
              <p className="text-xs text-[#8A90A5]">{client?.email}</p>
            </div>
          </div>

          {/* Dates & Project Metadata */}
          <div className="grid grid-cols-3 gap-4 pb-6 border-b border-[#E8EAF2]">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Issue Date
              </p>
              <p className="text-[13px] font-medium text-[#151B2C] mt-1 tnum">
                {formatShortDate(invoice.issueDate)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Due Date
              </p>
              <p className="text-[13px] font-medium text-[#151B2C] mt-1 tnum">
                {formatShortDate(invoice.dueDate)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Engagement
              </p>
              <p className="text-[13px] font-medium text-[#151B2C] mt-1 truncate">
                {project ? project.code : client?.paymentTerms ?? 'Net 15'}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="border border-[#E8EAF2] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-[#E8EAF2]">
                    <th className="py-2.5 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                      Description
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                      Qty / Hrs
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                      Rate
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAF2]">
                  {invoice.lineItems.map((item) => (
                    <tr key={item.id} className="text-[13px] text-[#20243A]">
                      <td className="py-3 px-4 font-medium">{item.description}</td>
                      <td className="py-3 px-3 text-right tnum text-[#46464D]">
                        {item.hoursOrQty.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right tnum text-[#46464D]">
                        {formatCurrencyExact(item.unitPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold tnum text-[#151B2C]">
                        {formatCurrencyExact(item.hoursOrQty * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-5">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-xs text-[#46464D]">
                  <span>Subtotal</span>
                  <span className="tnum">{formatCurrencyExact(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#46464D]">
                  <span>Tax (0%)</span>
                  <span className="tnum">$0.00</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-[#E8EAF2]">
                  <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#8A90A5]">
                    Total Due
                  </span>
                  <span className="mono-metric text-xl font-semibold text-[#151B2C]">
                    {formatCurrencyExact(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="pt-4 border-t border-[#E8EAF2]">
              <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Remittance Notes
              </p>
              <p className="text-[13px] text-[#46464D] mt-1.5 leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E8EAF2] bg-[#FAFBFD]">
          <button
            type="button"
            onClick={() => {
              onDelete(invoice.id);
              onClose();
            }}
            className="h-9 px-3 rounded-lg text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2]/60 inline-flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            {invoice.status === 'Draft' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(invoice.id, 'In Review')}
                className="exec-btn-secondary h-9 inline-flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5 text-[#6C63FF]" />
                <span>Send to Client</span>
              </button>
            )}

            {invoice.status !== 'Paid' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(invoice.id, 'Paid')}
                className="exec-btn-accent h-9 inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Mark as Paid</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
