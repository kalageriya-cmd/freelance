import { Menu, Plus, Search } from 'lucide-react';
import type { NavScreen } from '../types/practice';

interface TopBarProps {
  activeScreen: NavScreen;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
}

const SCREEN_TITLES: Record<NavScreen, string> = {
  overview: 'Executive Overview',
  projects: 'Projects & Deliverables',
  invoices: 'Invoices & Billing',
  time: 'Time Ledger',
  clients: 'Client Directory',
  settings: 'Practice Settings',
};

export function TopBar({
  activeScreen,
  onOpenMobileMenu,
  onOpenCommandPalette,
  onPrimaryAction,
  primaryActionLabel,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E8EAF2] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile Menu + Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-[#E8EAF2] text-[#20243A] hover:bg-[#F7F8FC] shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-[#8A90A5] font-medium whitespace-nowrap hidden sm:inline">
            Workspace
          </span>
          <span className="text-[#C7C5CE] hidden sm:inline" aria-hidden="true">
            /
          </span>
          <span className="font-semibold text-[#151B2C] truncate">
            {SCREEN_TITLES[activeScreen]}
          </span>
        </nav>
      </div>

      {/* Zone 2 & 3: Quick Command Search + 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center justify-between gap-6 h-9 px-3 rounded-lg bg-[#FAFBFD] border border-[#E8EAF2] text-[13px] text-[#8A90A5] hover:border-[#D5D8E4] hover:text-[#20243A] transition-colors whitespace-nowrap shrink-0"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-[#8A90A5]" />
            <span>Jump to project, invoice, or screen...</span>
          </span>
          <kbd className="font-mono-tnum text-[11px] font-medium text-[#8A90A5] bg-[#FFFFFF] border border-[#E8EAF2] rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onPrimaryAction}
          className="exec-btn-primary inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 h-9"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>{primaryActionLabel}</span>
        </button>
      </div>
    </header>
  );
}
