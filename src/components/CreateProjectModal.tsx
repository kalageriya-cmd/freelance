import { useState } from 'react';
import { X } from 'lucide-react';
import type { Client, Project } from '../types/practice';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  clients: Client[];
  onSubmit: (project: Omit<Project, 'id'>) => void;
}

export function CreateProjectModal({
  open,
  onClose,
  clients,
  onSubmit,
}: CreateProjectModalProps) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [scopeSummary, setScopeSummary] = useState('');
  const [billingModel, setBillingModel] = useState<Project['billingModel']>('Retainer');
  const [hourlyRate, setHourlyRate] = useState(250);
  const [budgetCapHours, setBudgetCapHours] = useState(60);
  const [dueDate, setDueDate] = useState('2026-12-20');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientId) return;

    onSubmit({
      clientId,
      name: name.trim(),
      code:
        code.trim().toUpperCase() ||
        `PRJ-${Math.floor(100 + Math.random() * 899)}`,
      scopeSummary:
        scopeSummary.trim() || 'Executive product architecture and advisory.',
      billingModel,
      hourlyRate,
      budgetCapHours,
      loggedHours: 0,
      status: 'Active',
      dueDate,
    });
    setName('');
    setCode('');
    setScopeSummary('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="New Engagement"
    >
      <div
        className="fixed inset-0 bg-[#101632]/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg elevation-3 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EAF2] bg-[#FAFBFD]">
          <h2 className="text-base font-semibold text-[#151B2C]">
            New Client Engagement
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="h-8 w-8 rounded-lg text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Client
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                const nextId = e.target.value;
                setClientId(nextId);
                const c = clients.find((cl) => cl.id === nextId);
                if (c) setHourlyRate(c.hourlyRate);
              }}
              className="exec-input w-full"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Engagement Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Treasury Wire Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="exec-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Code
              </label>
              <input
                type="text"
                placeholder="VTS-401"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="exec-input w-full font-mono-tnum uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Scope Summary
            </label>
            <input
              type="text"
              placeholder="Core deliverables and target architecture..."
              value={scopeSummary}
              onChange={(e) => setScopeSummary(e.target.value)}
              className="exec-input w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Billing Model
              </label>
              <select
                value={billingModel}
                onChange={(e) =>
                  setBillingModel(e.target.value as Project['billingModel'])
                }
                className="exec-input w-full"
              >
                <option value="Retainer">Retainer</option>
                <option value="Hourly">Hourly</option>
                <option value="Milestone">Milestone</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Rate ($/hr)
              </label>
              <input
                type="number"
                min="50"
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="exec-input w-full tnum"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Hour Cap
              </label>
              <input
                type="number"
                min="5"
                required
                value={budgetCapHours}
                onChange={(e) => setBudgetCapHours(Number(e.target.value))}
                className="exec-input w-full tnum"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Target Delivery Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="exec-input w-full tnum"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[#E8EAF2] bg-[#FAFBFD]">
          <button
            type="button"
            onClick={onClose}
            className="exec-btn-secondary h-9"
          >
            Cancel
          </button>
          <button type="submit" className="exec-btn-primary h-9">
            Create Engagement
          </button>
        </div>
      </form>
    </div>
  );
}
