import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Building2,
  Clock,
  FileText,
  LayoutDashboard,
  Play,
  Plus,
  Search,
  Settings,
  X,
} from 'lucide-react';
import type { Client, Invoice, NavScreen, Project } from '../types/practice';
import { formatCurrency, getInvoiceTotal } from '../utils/formatters';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  invoices: Invoice[];
  clients: Client[];
  onNavigate: (screen: NavScreen) => void;
  onStartTimerForProject: (projectId: string) => void;
  onOpenInvoice: (invoiceId: string) => void;
  onCreateInvoice: () => void;
}

export function CommandPalette({
  open,
  onClose,
  projects,
  invoices,
  clients,
  onNavigate,
  onStartTimerForProject,
  onOpenInvoice,
  onCreateInvoice,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const q = query.trim().toLowerCase();

  const filteredScreens = useMemo(() => {
    const items: { id: NavScreen; label: string; icon: typeof LayoutDashboard }[] = [
      { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
      { id: 'projects', label: 'Projects & Deliverables', icon: Briefcase },
      { id: 'invoices', label: 'Invoices & Billing', icon: FileText },
      { id: 'time', label: 'Time Ledger', icon: Clock },
      { id: 'clients', label: 'Client Directory', icon: Building2 },
      { id: 'settings', label: 'Practice Settings', icon: Settings },
    ];
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [q]);

  const filteredProjects = useMemo(() => {
    if (!q) return projects.slice(0, 3);
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
  }, [projects, q]);

  const filteredInvoices = useMemo(() => {
    if (!q) return invoices.slice(0, 3);
    return invoices.filter((inv) => {
      const client = clients.find((c) => c.id === inv.clientId);
      return (
        inv.number.toLowerCase().includes(q) ||
        (client?.company.toLowerCase().includes(q) ?? false)
      );
    });
  }, [invoices, clients, q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="fixed inset-0 bg-[#101632]/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl elevation-3 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 h-13 border-b border-[#E8EAF2]">
          <Search className="h-4 w-4 text-[#8A90A5] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search screens, projects, invoices, or start a timer..."
            className="w-full h-11 text-sm text-[#151B2C] placeholder:text-[#8A90A5] focus:outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="h-7 w-7 rounded-md text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          <div>
            <p className="px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
              Quick Actions
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onCreateInvoice();
              }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#20243A] hover:bg-[#F2F3FF] hover:text-[#101632] transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Plus className="h-4 w-4 text-[#6C63FF]" />
                <span>Create New Invoice</span>
              </span>
              <span className="text-[11px] text-[#8A90A5]">Billing</span>
            </button>
          </div>

          {/* Screens */}
          {filteredScreens.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Screens
              </p>
              {filteredScreens.map((screen) => {
                const Icon = screen.icon;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => {
                      onNavigate(screen.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#20243A] hover:bg-[#F2F3FF] hover:text-[#101632] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#8A90A5]" />
                      <span>{screen.label}</span>
                    </span>
                    <span className="text-[11px] text-[#8A90A5]">Go to</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Projects — Start Timer
              </p>
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    onStartTimerForProject(project.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#20243A] hover:bg-[#F2F3FF] hover:text-[#101632] transition-colors"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Play className="h-3.5 w-3.5 text-[#6C63FF] shrink-0" />
                    <span className="truncate">{project.name}</span>
                  </span>
                  <span className="text-[11px] text-[#8A90A5] tnum shrink-0 ml-2">
                    {project.code} · ${project.hourlyRate}/hr
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <p className="px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5]">
                Invoices
              </p>
              {filteredInvoices.map((inv) => {
                const client = clients.find((c) => c.id === inv.clientId);
                return (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() => {
                      onOpenInvoice(inv.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#20243A] hover:bg-[#F2F3FF] hover:text-[#101632] transition-colors"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-3.5 w-3.5 text-[#8A90A5] shrink-0" />
                      <span className="font-mono-tnum text-xs">{inv.number}</span>
                      <span className="text-[#8A90A5] truncate">
                        · {client?.company ?? 'Client'}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-[#151B2C] tnum shrink-0 ml-2">
                      {formatCurrency(getInvoiceTotal(inv))}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
