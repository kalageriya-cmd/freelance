import { useMemo, useState } from 'react';
import { Mail, MapPin, Plus, Search, X } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import type { Client, Invoice, Project } from '../types/practice';
import { formatCurrency, getInvoiceTotal } from '../utils/formatters';

interface ClientsScreenProps {
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  onOpenNewClient: () => void;
  onOpenInvoice: (invoiceId: string) => void;
}

export function ClientsScreen({
  clients,
  projects,
  invoices,
  onOpenNewClient,
  onOpenInvoice,
}: ClientsScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? null;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-[#8A90A5] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client organizations or contacts..."
            aria-label="Search clients"
            className="exec-input w-full pl-9"
          />
        </div>

        <button
          type="button"
          onClick={onOpenNewClient}
          className="exec-btn-primary h-10 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredClients.map((client) => {
          const clientProjects = projects.filter((p) => p.clientId === client.id);
          const clientInvoices = invoices.filter((i) => i.clientId === client.id);
          const lifetimeBilled = clientInvoices.reduce(
            (s, i) => s + getInvoiceTotal(i),
            0
          );

          return (
            <article
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className="elevation-1 elevation-2-hover rounded-3xl p-6 cursor-pointer flex flex-col justify-between gap-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <Avatar
                    src={client.avatarUrl}
                    alt={client.name}
                    initials={client.initials}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[#151B2C] truncate">
                      {client.company}
                    </h3>
                    <p className="text-[13px] text-[#46464D] truncate">
                      {client.name} · {client.role}
                    </p>
                  </div>
                </div>
                <StatusBadge status={client.status} />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E8EAF2]">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Model
                  </p>
                  <p className="text-[13px] font-medium text-[#151B2C] mt-1">
                    {client.retainerType}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Standard Rate
                  </p>
                  <p className="text-[13px] font-semibold text-[#151B2C] mt-1 tnum">
                    ${client.hourlyRate}/hr
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                    Total Billed
                  </p>
                  <p className="text-[13px] font-semibold text-[#151B2C] mt-1 tnum">
                    {formatCurrency(lifetimeBilled)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E8EAF2] text-xs text-[#8A90A5]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{client.location}</span>
                </span>
                <span className="tnum">
                  {clientProjects.length} engagement
                  {clientProjects.length === 1 ? '' : 's'} · {client.paymentTerms}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Client Detail Drawer */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={selectedClient.company}
        >
          <div
            className="fixed inset-0 bg-[#101632]/35 backdrop-blur-[1px]"
            onClick={() => setSelectedClientId(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg bg-[#FFFFFF] h-full shadow-2xl border-l border-[#E8EAF2] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EAF2] bg-[#FAFBFD]">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={selectedClient.avatarUrl}
                  alt={selectedClient.name}
                  initials={selectedClient.initials}
                  size="md"
                />
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-[#151B2C] truncate">
                    {selectedClient.company}
                  </h2>
                  <p className="text-xs text-[#8A90A5] truncate">
                    {selectedClient.name} · {selectedClient.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClientId(null)}
                aria-label="Close client detail"
                className="h-8 w-8 rounded-lg text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFBFD] border border-[#E8EAF2]">
                <div className="flex items-center gap-2 text-xs text-[#46464D]">
                  <Mail className="h-4 w-4 text-[#8A90A5]" />
                  <span>{selectedClient.email}</span>
                </div>
                <span className="text-xs font-semibold text-[#151B2C] tnum">
                  {selectedClient.paymentTerms} · ${selectedClient.hourlyRate}/hr
                </span>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] mb-3">
                  Engagements
                </h3>
                <div className="divide-y divide-[#E8EAF2] border border-[#E8EAF2] rounded-2xl overflow-hidden">
                  {projects
                    .filter((p) => p.clientId === selectedClient.id)
                    .map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 flex items-center justify-between gap-3 bg-[#FFFFFF]"
                      >
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-semibold text-[#151B2C] truncate">
                            {proj.name}
                          </p>
                          <p className="text-xs text-[#8A90A5] tnum">
                            {proj.code} · {proj.loggedHours.toFixed(1)} /{' '}
                            {proj.budgetCapHours} hrs
                          </p>
                        </div>
                        <StatusBadge status={proj.status} />
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] mb-3">
                  Statement History
                </h3>
                <div className="divide-y divide-[#E8EAF2] border border-[#E8EAF2] rounded-2xl overflow-hidden">
                  {invoices
                    .filter((inv) => inv.clientId === selectedClient.id)
                    .map((inv) => (
                      <button
                        key={inv.id}
                        type="button"
                        onClick={() => {
                          setSelectedClientId(null);
                          onOpenInvoice(inv.id);
                        }}
                        className="w-full p-4 flex items-center justify-between gap-3 bg-[#FFFFFF] hover:bg-[#F9FAFD] text-left transition-colors"
                      >
                        <div>
                          <p className="text-[13px] font-semibold text-[#151B2C] font-mono-tnum">
                            {inv.number}
                          </p>
                          <p className="text-xs text-[#8A90A5] tnum">
                            Due {inv.dueDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[13.5px] font-semibold text-[#151B2C] tnum">
                            {formatCurrency(getInvoiceTotal(inv))}
                          </span>
                          <StatusBadge status={inv.status} />
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
