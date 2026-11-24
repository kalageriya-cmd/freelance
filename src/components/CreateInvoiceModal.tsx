import { useMemo, useState } from 'react';
import { Clock, Plus, Trash2, X } from 'lucide-react';
import type {
  Client,
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
  Project,
  TimeEntry,
} from '../types/practice';
import { formatCurrencyExact } from '../utils/formatters';

interface CreateInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  clients: Client[];
  projects: Project[];
  unbilledEntries: TimeEntry[];
  invoicePrefix: string;
  nextInvoiceNumber: number;
  prefillUnbilled?: boolean;
  onSubmit: (
    invoice: Omit<Invoice, 'id'>,
    linkedTimeEntryIds: string[]
  ) => void;
}

export function CreateInvoiceModal({
  open,
  onClose,
  clients,
  projects,
  unbilledEntries,
  invoicePrefix,
  nextInvoiceNumber,
  prefillUnbilled = false,
  onSubmit,
}: CreateInvoiceModalProps) {
  const defaultClientId = clients[0]?.id ?? '';
  const [clientId, setClientId] = useState(defaultClientId);
  const [status, setStatus] = useState<InvoiceStatus>('In Review');
  const [issueDate, setIssueDate] = useState('2026-11-24');
  const [dueDate, setDueDate] = useState('2026-12-09');
  const [notes, setNotes] = useState(
    'Remittance via ACH Wire or Corporate Clearing. Thank you.'
  );
  const [linkedTimeIds, setLinkedTimeIds] = useState<string[]>(() =>
    prefillUnbilled ? unbilledEntries.map((e) => e.id) : []
  );

  const clientProjects = useMemo(
    () => projects.filter((p) => p.clientId === clientId),
    [projects, clientId]
  );

  const availableUnbilledForClient = useMemo(() => {
    const projectIds = new Set(clientProjects.map((p) => p.id));
    return unbilledEntries.filter((entry) => projectIds.has(entry.projectId));
  }, [clientProjects, unbilledEntries]);

  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(() => {
    if (prefillUnbilled && unbilledEntries.length > 0) {
      return unbilledEntries.map((entry, idx) => {
        const proj = projects.find((p) => p.id === entry.projectId);
        return {
          id: `new-li-${idx}-${Date.now()}`,
          description: `${proj ? `${proj.code} — ` : ''}${entry.description}`,
          hoursOrQty: Number((entry.durationMinutes / 60).toFixed(2)),
          unitPrice: proj?.hourlyRate ?? 240,
        };
      });
    }
    const firstClient = clients[0];
    return [
      {
        id: `new-li-${Date.now()}`,
        description: 'Executive Product & Strategy Advisory',
        hoursOrQty: 20,
        unitPrice: firstClient?.hourlyRate ?? 240,
      },
    ];
  });

  if (!open) return null;

  const invoiceNumber = `${invoicePrefix}-${nextInvoiceNumber}`;
  const total = lineItems.reduce(
    (sum, item) => sum + item.hoursOrQty * item.unitPrice,
    0
  );

  const handleImportUnbilled = () => {
    if (availableUnbilledForClient.length === 0) return;
    const imported: InvoiceLineItem[] = availableUnbilledForClient.map(
      (entry, idx) => {
        const proj = projects.find((p) => p.id === entry.projectId);
        return {
          id: `imp-${entry.id}-${idx}`,
          description: `${proj ? `${proj.code} — ` : ''}${entry.description}`,
          hoursOrQty: Number((entry.durationMinutes / 60).toFixed(2)),
          unitPrice: proj?.hourlyRate ?? 240,
        };
      }
    );
    setLineItems(imported);
    setLinkedTimeIds(availableUnbilledForClient.map((e) => e.id));
  };

  const handleAddLine = () => {
    const client = clients.find((c) => c.id === clientId);
    setLineItems((prev) => [
      ...prev,
      {
        id: `li-${Date.now()}`,
        description: '',
        hoursOrQty: 1,
        unitPrice: client?.hourlyRate ?? 240,
      },
    ]);
  };

  const handleUpdateLine = (
    id: string,
    field: keyof InvoiceLineItem,
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveLine = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = lineItems.filter(
      (li) => li.description.trim().length > 0 && li.hoursOrQty > 0
    );
    if (!clientId || validItems.length === 0) return;

    onSubmit(
      {
        number: invoiceNumber,
        clientId,
        projectId: clientProjects[0]?.id,
        issueDate,
        dueDate,
        status,
        lineItems: validItems,
        notes: notes.trim() || undefined,
      },
      linkedTimeIds
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create Invoice"
    >
      <div
        className="fixed inset-0 bg-[#101632]/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <form
        onSubmit={handleFormSubmit}
        className="relative z-10 w-full max-w-2xl elevation-3 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EAF2] bg-[#FAFBFD]">
          <div>
            <h2 className="text-base font-semibold text-[#151B2C]">
              Create Invoice ·{' '}
              <span className="font-mono-tnum text-[#4D41DF]">
                {invoiceNumber}
              </span>
            </h2>
            <p className="text-xs text-[#8A90A5] mt-0.5">
              Issue a client statement or convert unbilled time logs.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 rounded-lg text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Client Organization
              </label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setLinkedTimeIds([]);
                }}
                className="exec-input w-full"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="exec-input w-full"
              >
                <option value="In Review">In Review (Sent)</option>
                <option value="Draft">Draft</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="exec-input w-full tnum"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="exec-input w-full tnum"
              />
            </div>
          </div>

          {/* Unbilled Time Banner */}
          {availableUnbilledForClient.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#F2F3FF] border border-[#DCE2F9]">
              <div className="flex items-center gap-2.5 text-xs text-[#20243A]">
                <Clock className="h-4 w-4 text-[#6C63FF] shrink-0" />
                <span>
                  <strong className="font-semibold">
                    {availableUnbilledForClient.length} unbilled time{' '}
                    {availableUnbilledForClient.length === 1 ? 'entry' : 'entries'}
                  </strong>{' '}
                  found for this client.
                </span>
              </div>
              <button
                type="button"
                onClick={handleImportUnbilled}
                className="exec-btn-secondary h-8 px-3 text-xs whitespace-nowrap"
              >
                Import Unbilled Hours
              </button>
            </div>
          )}

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[#46464D]">
                Line Items
              </label>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs font-medium text-[#4D41DF] hover:text-[#3622CA] inline-flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Line</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {lineItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <input
                    type="text"
                    required
                    placeholder="Deliverable or service description"
                    value={item.description}
                    onChange={(e) =>
                      handleUpdateLine(item.id, 'description', e.target.value)
                    }
                    className="exec-input col-span-6"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    aria-label="Hours or quantity"
                    value={item.hoursOrQty}
                    onChange={(e) =>
                      handleUpdateLine(
                        item.id,
                        'hoursOrQty',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="exec-input col-span-2 text-right tnum"
                  />
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    aria-label="Hourly rate"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleUpdateLine(
                        item.id,
                        'unitPrice',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="exec-input col-span-3 text-right tnum"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(item.id)}
                    disabled={lineItems.length <= 1}
                    aria-label="Remove line item"
                    className="col-span-1 h-10 flex items-center justify-center rounded-lg text-[#8A90A5] hover:text-[#B91C1C] hover:bg-[#FEE2E2]/50 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Payment Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="exec-input w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E8EAF2] bg-[#FAFBFD]">
          <div>
            <span className="text-xs text-[#8A90A5] mr-2">Invoice Total</span>
            <span className="mono-metric text-lg font-semibold text-[#151B2C]">
              {formatCurrencyExact(total)}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="exec-btn-secondary h-9"
            >
              Cancel
            </button>
            <button type="submit" className="exec-btn-primary h-9">
              Issue Invoice
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
