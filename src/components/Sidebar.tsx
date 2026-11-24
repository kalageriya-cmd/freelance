import {
  Briefcase,
  Building2,
  Clock,
  FileText,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
} from 'lucide-react';
import type { NavScreen, PracticeSettings } from '../types/practice';
import { PRINCIPAL_AVATAR } from '../data/initialData';
import { Avatar } from './Avatar';

interface SidebarProps {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  settings: PracticeSettings;
  counts: {
    activeProjects: number;
    pendingInvoices: number;
    unbilledEntries: number;
  };
}

interface NavItemConfig {
  id: NavScreen;
  label: string;
  icon: typeof LayoutDashboard;
  badgeCount?: number;
}

export function Sidebar({
  activeScreen,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  settings,
  counts,
}: SidebarProps) {
  const primaryNav: NavItemConfig[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'projects',
      label: 'Projects',
      icon: Briefcase,
      badgeCount: counts.activeProjects,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FileText,
      badgeCount: counts.pendingInvoices,
    },
    {
      id: 'time',
      label: 'Time Ledger',
      icon: Clock,
      badgeCount: counts.unbilledEntries,
    },
    { id: 'clients', label: 'Clients', icon: Building2 },
  ];

  const renderNavContent = (isCompact: boolean) => (
    <div className="flex h-full flex-col justify-between bg-[#FFFFFF] border-r border-[#E8EAF2]">
      <div>
        {/* Brand Header */}
        <div
          className={`flex h-16 items-center border-b border-[#E8EAF2] ${
            isCompact ? 'justify-center px-2' : 'justify-between px-5'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onNavigate('overview');
              onCloseMobile();
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] rounded-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#252B48] text-white font-semibold text-sm shrink-0">
              M
            </span>
            {!isCompact && (
              <span className="text-[15px] font-semibold tracking-[-0.015em] text-[#101632] whitespace-nowrap">
                Meridian
              </span>
            )}
          </button>

          {!isCompact && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] transition-colors"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isCompact && (
          <div className="hidden lg:flex justify-center pt-3 pb-1">
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] transition-colors"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav
          aria-label="Workspace navigation"
          className={`flex flex-col gap-1 ${isCompact ? 'px-2 pt-3' : 'px-3 pt-4'}`}
        >
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                title={isCompact ? item.label : undefined}
                className={`group flex items-center rounded-lg text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                  isCompact ? 'justify-center h-10 w-full px-0' : 'justify-between h-10 px-3'
                } ${
                  isActive
                    ? 'bg-[#F2F3FF] text-[#101632] font-semibold'
                    : 'text-[#46464D] hover:bg-[#F7F8FC] hover:text-[#101632]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`h-[17px] w-[17px] shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#6C63FF]'
                        : 'text-[#8A90A5] group-hover:text-[#252B48]'
                    }`}
                  />
                  {!isCompact && <span className="truncate">{item.label}</span>}
                </span>
                {!isCompact && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                  <span
                    className={`tnum text-[11px] font-medium ${
                      isActive ? 'text-[#4D41DF]' : 'text-[#8A90A5]'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings & Principal Profile */}
      <div className={`border-t border-[#E8EAF2] ${isCompact ? 'p-2' : 'p-3'}`}>
        <button
          type="button"
          onClick={() => {
            onNavigate('settings');
            onCloseMobile();
          }}
          title={isCompact ? 'Settings' : undefined}
          className={`flex items-center rounded-lg text-[13.5px] font-medium transition-colors whitespace-nowrap w-full mb-2 ${
            isCompact ? 'justify-center h-10' : 'gap-2.5 h-10 px-3'
          } ${
            activeScreen === 'settings'
              ? 'bg-[#F2F3FF] text-[#101632] font-semibold'
              : 'text-[#46464D] hover:bg-[#F7F8FC] hover:text-[#101632]'
          }`}
        >
          <Settings
            className={`h-[17px] w-[17px] shrink-0 ${
              activeScreen === 'settings' ? 'text-[#6C63FF]' : 'text-[#8A90A5]'
            }`}
          />
          {!isCompact && <span>Settings</span>}
        </button>

        <div
          className={`flex items-center rounded-lg bg-[#FAFBFD] border border-[#E8EAF2] ${
            isCompact ? 'justify-center p-1.5' : 'gap-2.5 p-2.5'
          }`}
        >
          <Avatar
            src={PRINCIPAL_AVATAR}
            alt={settings.principalName}
            initials="CV"
            size="sm"
          />
          {!isCompact && (
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-[#151B2C] truncate">
                {settings.principalName}
              </p>
              <p className="text-[11px] text-[#8A90A5] truncate">
                {settings.practiceName}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent collapsible sidebar: 260px default, 64px iconified */}
      <aside
        className={`hidden lg:block shrink-0 transition-[width] duration-200 ease-out ${
          collapsed ? 'w-[64px]' : 'w-[260px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{renderNavContent(collapsed)}</div>
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#101632]/35 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[260px] h-full shadow-xl">
            {renderNavContent(false)}
          </aside>
        </div>
      )}
    </>
  );
}
