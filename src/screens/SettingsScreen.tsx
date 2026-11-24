import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { PracticeSettings } from '../types/practice';

interface SettingsScreenProps {
  settings: PracticeSettings;
  onSaveSettings: (next: PracticeSettings) => void;
  onResetDemoData: () => void;
}

export function SettingsScreen({
  settings,
  onSaveSettings,
  onResetDemoData,
}: SettingsScreenProps) {
  const [form, setForm] = useState<PracticeSettings>(settings);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2600);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form
        onSubmit={handleSubmit}
        className="elevation-1 rounded-3xl p-6 sm:p-8 space-y-6"
      >
        <div className="pb-4 border-b border-[#E8EAF2] flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#151B2C]">
              Practice Identity &amp; Billing Defaults
            </h2>
            <p className="text-xs text-[#8A90A5] mt-0.5">
              Used on generated client statements, retainers, and revenue targets.
            </p>
          </div>
          {savedBanner && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
              <Check className="h-4 w-4" />
              <span>Changes saved</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Practice / Studio Name
            </label>
            <input
              type="text"
              required
              value={form.practiceName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, practiceName: e.target.value }))
              }
              className="exec-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Principal Consultant Name
            </label>
            <input
              type="text"
              required
              value={form.principalName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, principalName: e.target.value }))
              }
              className="exec-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Billing Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="exec-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Tax ID / Entity Number
            </label>
            <input
              type="text"
              value={form.taxId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, taxId: e.target.value }))
              }
              className="exec-input w-full font-mono-tnum"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E8EAF2]">
          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Default Rate ($/hr)
            </label>
            <input
              type="number"
              min="50"
              required
              value={form.defaultHourlyRate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  defaultHourlyRate: Number(e.target.value),
                }))
              }
              className="exec-input w-full tnum"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Invoice Prefix
            </label>
            <input
              type="text"
              required
              value={form.invoicePrefix}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  invoicePrefix: e.target.value.toUpperCase(),
                }))
              }
              className="exec-input w-full font-mono-tnum uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#46464D] mb-1.5">
              Monthly Revenue Target ($)
            </label>
            <input
              type="number"
              min="1000"
              step="500"
              required
              value={form.monthlyRevenueTarget}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  monthlyRevenueTarget: Number(e.target.value),
                }))
              }
              className="exec-input w-full tnum"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8EAF2]">
          <button
            type="button"
            onClick={() => {
              onResetDemoData();
              setSavedBanner(true);
              setTimeout(() => setSavedBanner(false), 2600);
            }}
            className="exec-btn-secondary h-9 inline-flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#8A90A5]" />
            <span>Reset Sample Practice Data</span>
          </button>

          <button type="submit" className="exec-btn-primary h-9">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
