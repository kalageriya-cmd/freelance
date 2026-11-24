import { useState } from 'react';
import { X } from 'lucide-react';
import type { Client } from '../types/practice';

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id'>) => void;
}

export function CreateClientModal({
  open,
  onClose,
  onSubmit,
}: CreateClientModalProps) {
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('New York, NY');
  const [retainerType, setRetainerType] =
    useState<Client['retainerType']>('Retainer');
  const [hourlyRate, setHourlyRate] = useState(250);
  const [paymentTerms, setPaymentTerms] =
    useState<Client['paymentTerms']>('Net 15');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !name.trim()) return;

    const parts = name.trim().split(/\s+/);
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name.trim().slice(0, 2).toUpperCase();

    onSubmit({
      company: company.trim(),
      name: name.trim(),
      role: role.trim() || 'Executive Sponsor',
      email: email.trim() || 'billing@client.com',
      initials,
      retainerType,
      hourlyRate,
      paymentTerms,
      location: location.trim() || 'Remote',
      status: 'Active',
    });

    setCompany('');
    setName('');
    setRole('');
    setEmail('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add Client"
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
            Onboard New Client
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
              Organization Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Meridian Capital Group"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="exec-input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Primary Contact
              </label>
              <input
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="exec-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Title / Role
              </label>
              <input
                type="text"
                placeholder="VP of Product"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="exec-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Billing Email
              </label>
              <input
                type="email"
                required
                placeholder="ap@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="exec-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="exec-input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Engagement Type
              </label>
              <select
                value={retainerType}
                onChange={(e) =>
                  setRetainerType(e.target.value as Client['retainerType'])
                }
                className="exec-input w-full"
              >
                <option value="Retainer">Retainer</option>
                <option value="Fixed Scope">Fixed Scope</option>
                <option value="Hourly Advisory">Hourly Advisory</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#46464D] mb-1.5">
                Hourly Rate ($)
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
                Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) =>
                  setPaymentTerms(e.target.value as Client['paymentTerms'])
                }
                className="exec-input w-full"
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
              </select>
            </div>
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
            Add Client
          </button>
        </div>
      </form>
    </div>
  );
}
