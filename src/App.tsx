import { useEffect, useMemo, useState } from 'react';
import { CommandPalette } from './components/CommandPalette';
import { CreateClientModal } from './components/CreateClientModal';
import { CreateInvoiceModal } from './components/CreateInvoiceModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { InvoiceDrawer } from './components/InvoiceDrawer';
import { Sidebar } from './components/Sidebar';
import { TimeTrackerDock } from './components/TimeTrackerDock';
import { TopBar } from './components/TopBar';
import {
  INITIAL_CLIENTS,
  INITIAL_DELIVERABLES,
  INITIAL_INVOICES,
  INITIAL_PROJECTS,
  INITIAL_SETTINGS,
  INITIAL_TIME_ENTRIES,
} from './data/initialData';
import { ClientsScreen } from './screens/ClientsScreen';
import { InvoicesScreen } from './screens/InvoicesScreen';
import { OverviewScreen } from './screens/OverviewScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TimeLedgerScreen } from './screens/TimeLedgerScreen';
import type {
  ActiveTimerState,
  Client,
  Deliverable,
  Invoice,
  InvoiceStatus,
  NavScreen,
  PracticeSettings,
  Project,
  ProjectStatus,
  TimeEntry,
} from './types/practice';

const STORAGE_KEY = 'meridian_practice_state_v1';

interface StoredState {
  clients: Client[];
  projects: Project[];
  deliverables: Deliverable[];
  invoices: Invoice[];
  timeEntries: TimeEntry[];
  settings: PracticeSettings;
}

function loadInitialState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredState>;
      if (parsed.clients && parsed.projects && parsed.invoices) {
        return {
          clients: parsed.clients,
          projects: parsed.projects,
          deliverables: parsed.deliverables ?? INITIAL_DELIVERABLES,
          invoices: parsed.invoices,
          timeEntries: parsed.timeEntries ?? INITIAL_TIME_ENTRIES,
          settings: parsed.settings ?? INITIAL_SETTINGS,
        };
      }
    }
  } catch {
    // fallback to seed state
  }
  return {
    clients: INITIAL_CLIENTS,
    projects: INITIAL_PROJECTS,
    deliverables: INITIAL_DELIVERABLES,
    invoices: INITIAL_INVOICES,
    timeEntries: INITIAL_TIME_ENTRIES,
    settings: INITIAL_SETTINGS,
  };
}

export default function App() {
  const initial = useMemo(() => loadInitialState(), []);

  const [activeScreen, setActiveScreen] = useState<NavScreen>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [clients, setClients] = useState<Client[]>(initial.clients);
  const [projects, setProjects] = useState<Project[]>(initial.projects);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(
    initial.deliverables
  );
  const [invoices, setInvoices] = useState<Invoice[]>(initial.invoices);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(
    initial.timeEntries
  );
  const [settings, setSettings] = useState<PracticeSettings>(initial.settings);

  // Overlays & Modals
  const [commandOpen, setCommandOpen] = useState(false);
  const [inspectedInvoiceId, setInspectedInvoiceId] = useState<string | null>(
    null
  );
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [prefillInvoiceUnbilled, setPrefillInvoiceUnbilled] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createClientOpen, setCreateClientOpen] = useState(false);

  // Live Stopwatch Timer
  const [timer, setTimer] = useState<ActiveTimerState>({
    isRunning: false,
    projectId: initial.projects[0]?.id ?? 'prj-1',
    description: 'Liquidity console keyboard navigation & wire validation',
    elapsedSeconds: 5042, // 01:24:02 ready to resume or log
    startedAtMs: null,
  });

  // Persist domain state
  useEffect(() => {
    try {
      const payload: StoredState = {
        clients,
        projects,
        deliverables,
        invoices,
        timeEntries,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [clients, projects, deliverables, invoices, timeEntries, settings]);

  // Global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Stopwatch tick
  useEffect(() => {
    if (!timer.isRunning) return;
    const interval = window.setInterval(() => {
      setTimer((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timer.isRunning]);

  const unbilledEntries = useMemo(
    () => timeEntries.filter((e) => e.billable && !e.billedInvoiceId),
    [timeEntries]
  );

  const unbilledSummary = useMemo(() => {
    const hours = unbilledEntries.reduce(
      (sum, e) => sum + e.durationMinutes / 60,
      0
    );
    const amount = unbilledEntries.reduce((sum, e) => {
      const proj = projects.find((p) => p.id === e.projectId);
      return (
        sum +
        (e.durationMinutes / 60) *
          (proj?.hourlyRate ?? settings.defaultHourlyRate)
      );
    }, 0);
    return { hours, amount, count: unbilledEntries.length };
  }, [unbilledEntries, projects, settings.defaultHourlyRate]);

  const counts = useMemo(
    () => ({
      activeProjects: projects.filter((p) => p.status !== 'Completed').length,
      pendingInvoices: invoices.filter(
        (i) => i.status === 'In Review' || i.status === 'Overdue'
      ).length,
      unbilledEntries: unbilledEntries.length,
    }),
    [projects, invoices, unbilledEntries]
  );

  // Handlers
  const handleToggleTimer = () => {
    setTimer((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
      startedAtMs: !prev.isRunning ? Date.now() : null,
    }));
  };

  const handleStopAndLogTimer = () => {
    if (timer.elapsedSeconds === 0) return;
    const minutes = Math.max(15, Math.round(timer.elapsedSeconds / 60));
    const entry: TimeEntry = {
      id: `tm-${Date.now()}`,
      projectId: timer.projectId,
      description:
        timer.description.trim() || 'Focused client advisory & architecture',
      date: '2026-11-24',
      durationMinutes: minutes,
      billable: true,
    };
    setTimeEntries((prev) => [entry, ...prev]);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === timer.projectId
          ? {
              ...p,
              loggedHours: Number((p.loggedHours + minutes / 60).toFixed(1)),
            }
          : p
      )
    );
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      elapsedSeconds: 0,
      description: '',
      startedAtMs: null,
    }));
  };

  const handleStartTimerForProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    setTimer((prev) => ({
      ...prev,
      projectId,
      description:
        prev.projectId === projectId && prev.description
          ? prev.description
          : `${project?.name ?? 'Engagement'} sprint work`,
      isRunning: true,
      startedAtMs: Date.now(),
    }));
  };

  const handleToggleDeliverable = (deliverableId: string) => {
    setDeliverables((prev) =>
      prev.map((d) =>
        d.id === deliverableId
          ? {
              ...d,
              completed: !d.completed,
              status: !d.completed ? 'Done' : 'Active',
            }
          : d
      )
    );
  };

  const handleAddDeliverable = (projectId: string, title: string) => {
    const newDel: Deliverable = {
      id: `del-${Date.now()}`,
      projectId,
      title,
      dueDate: '2026-12-05',
      status: 'Active',
      completed: false,
    };
    setDeliverables((prev) => [newDel, ...prev]);
  };

  const handleUpdateProjectStatus = (
    projectId: string,
    status: ProjectStatus
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status } : p))
    );
  };

  const handleCreateProject = (project: Omit<Project, 'id'>) => {
    const created: Project = { ...project, id: `prj-${Date.now()}` };
    setProjects((prev) => [created, ...prev]);
  };

  const handleCreateClient = (client: Omit<Client, 'id'>) => {
    const created: Client = { ...client, id: `cli-${Date.now()}` };
    setClients((prev) => [created, ...prev]);
  };

  const handleCreateInvoice = (
    invoice: Omit<Invoice, 'id'>,
    linkedTimeEntryIds: string[]
  ) => {
    const newId = `inv-${Date.now()}`;
    const created: Invoice = { ...invoice, id: newId };
    setInvoices((prev) => [created, ...prev]);

    if (linkedTimeEntryIds.length > 0) {
      const idSet = new Set(linkedTimeEntryIds);
      setTimeEntries((prev) =>
        prev.map((t) => (idSet.has(t.id) ? { ...t, billedInvoiceId: newId } : t))
      );
    }
    setInspectedInvoiceId(newId);
  };

  const handleUpdateInvoiceStatus = (
    invoiceId: string,
    status: InvoiceStatus
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status } : inv))
    );
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    setTimeEntries((prev) =>
      prev.map((t) =>
        t.billedInvoiceId === invoiceId ? { ...t, billedInvoiceId: undefined } : t
      )
    );
  };

  const handleAddTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const created: TimeEntry = { ...entry, id: `tm-${Date.now()}` };
    setTimeEntries((prev) => [created, ...prev]);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === entry.projectId
          ? {
              ...p,
              loggedHours: Number(
                (p.loggedHours + entry.durationMinutes / 60).toFixed(1)
              ),
            }
          : p
      )
    );
  };

  const handleDeleteTimeEntry = (entryId: string) => {
    const target = timeEntries.find((t) => t.id === entryId);
    setTimeEntries((prev) => prev.filter((t) => t.id !== entryId));
    if (target) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === target.projectId
            ? {
                ...p,
                loggedHours: Math.max(
                  0,
                  Number(
                    (p.loggedHours - target.durationMinutes / 60).toFixed(1)
                  )
                ),
              }
            : p
        )
      );
    }
  };

  const handleResetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setClients(INITIAL_CLIENTS);
    setProjects(INITIAL_PROJECTS);
    setDeliverables(INITIAL_DELIVERABLES);
    setInvoices(INITIAL_INVOICES);
    setTimeEntries(INITIAL_TIME_ENTRIES);
    setSettings(INITIAL_SETTINGS);
  };

  const primaryActionConfig = useMemo(() => {
    switch (activeScreen) {
      case 'projects':
        return {
          label: 'New Project',
          action: () => setCreateProjectOpen(true),
        };
      case 'clients':
        return {
          label: 'Add Client',
          action: () => setCreateClientOpen(true),
        };
      default:
        return {
          label: 'New Invoice',
          action: () => {
            setPrefillInvoiceUnbilled(false);
            setCreateInvoiceOpen(true);
          },
        };
    }
  }, [activeScreen]);

  const inspectedInvoice =
    invoices.find((i) => i.id === inspectedInvoiceId) ?? null;

  const nextInvoiceNumber = 2050 + invoices.length;

  return (
    <div className="min-h-screen flex bg-[#F7F8FC] text-[#151B2C]">
      {/* Persistent Collapsible Sidebar */}
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        settings={settings}
        counts={counts}
      />

      {/* Main Content Shell */}
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeScreen={activeScreen}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandOpen(true)}
          onPrimaryAction={primaryActionConfig.action}
          primaryActionLabel={primaryActionConfig.label}
        />

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-40 sm:pb-32">
          {activeScreen === 'overview' && (
            <OverviewScreen
              clients={clients}
              projects={projects}
              deliverables={deliverables}
              invoices={invoices}
              timeEntries={timeEntries}
              settings={settings}
              activeTimer={timer}
              onNavigate={setActiveScreen}
              onToggleDeliverable={handleToggleDeliverable}
              onStartTimerForProject={handleStartTimerForProject}
              onOpenInvoice={(id) => setInspectedInvoiceId(id)}
            />
          )}

          {activeScreen === 'projects' && (
            <ProjectsScreen
              projects={projects}
              clients={clients}
              deliverables={deliverables}
              activeTimer={timer}
              onToggleDeliverable={handleToggleDeliverable}
              onAddDeliverable={handleAddDeliverable}
              onUpdateProjectStatus={handleUpdateProjectStatus}
              onStartTimerForProject={handleStartTimerForProject}
              onOpenNewProject={() => setCreateProjectOpen(true)}
            />
          )}

          {activeScreen === 'invoices' && (
            <InvoicesScreen
              invoices={invoices}
              clients={clients}
              onOpenInvoice={(id) => setInspectedInvoiceId(id)}
              onUpdateStatus={handleUpdateInvoiceStatus}
              onOpenCreateInvoice={() => {
                setPrefillInvoiceUnbilled(false);
                setCreateInvoiceOpen(true);
              }}
            />
          )}

          {activeScreen === 'time' && (
            <TimeLedgerScreen
              entries={timeEntries}
              projects={projects}
              clients={clients}
              onAddEntry={handleAddTimeEntry}
              onDeleteEntry={handleDeleteTimeEntry}
              onDraftInvoiceFromUnbilled={() => {
                setPrefillInvoiceUnbilled(true);
                setCreateInvoiceOpen(true);
              }}
            />
          )}

          {activeScreen === 'clients' && (
            <ClientsScreen
              clients={clients}
              projects={projects}
              invoices={invoices}
              onOpenNewClient={() => setCreateClientOpen(true)}
              onOpenInvoice={(id) => setInspectedInvoiceId(id)}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsScreen
              settings={settings}
              onSaveSettings={setSettings}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>

      {/* Persistent Floating Bottom-Right Time Tracker & Invoice Dock */}
      <TimeTrackerDock
        timer={timer}
        projects={projects}
        unbilledSummary={unbilledSummary}
        onToggleRun={handleToggleTimer}
        onStopAndLog={handleStopAndLogTimer}
        onChangeProject={(projectId) =>
          setTimer((prev) => ({ ...prev, projectId }))
        }
        onChangeDescription={(description) =>
          setTimer((prev) => ({ ...prev, description }))
        }
        onDraftInvoiceFromUnbilled={() => {
          setPrefillInvoiceUnbilled(true);
          setCreateInvoiceOpen(true);
        }}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        projects={projects}
        invoices={invoices}
        clients={clients}
        onNavigate={setActiveScreen}
        onStartTimerForProject={handleStartTimerForProject}
        onOpenInvoice={(id) => setInspectedInvoiceId(id)}
        onCreateInvoice={() => {
          setPrefillInvoiceUnbilled(false);
          setCreateInvoiceOpen(true);
        }}
      />

      {/* Slide-Over Invoice Inspector */}
      <InvoiceDrawer
        invoice={inspectedInvoice}
        client={clients.find((c) => c.id === inspectedInvoice?.clientId)}
        project={projects.find((p) => p.id === inspectedInvoice?.projectId)}
        settings={settings}
        onClose={() => setInspectedInvoiceId(null)}
        onUpdateStatus={handleUpdateInvoiceStatus}
        onDelete={handleDeleteInvoice}
      />

      {/* Creation Modals */}
      {createInvoiceOpen && (
        <CreateInvoiceModal
          open={createInvoiceOpen}
          onClose={() => setCreateInvoiceOpen(false)}
          clients={clients}
          projects={projects}
          unbilledEntries={unbilledEntries}
          invoicePrefix={settings.invoicePrefix}
          nextInvoiceNumber={nextInvoiceNumber}
          prefillUnbilled={prefillInvoiceUnbilled}
          onSubmit={handleCreateInvoice}
        />
      )}

      <CreateProjectModal
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        clients={clients}
        onSubmit={handleCreateProject}
      />

      <CreateClientModal
        open={createClientOpen}
        onClose={() => setCreateClientOpen(false)}
        onSubmit={handleCreateClient}
      />
    </div>
  );
}
