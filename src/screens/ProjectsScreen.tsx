import { useMemo, useState } from 'react';
import { Check, Play, Plus, Search } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import type {
  ActiveTimerState,
  Client,
  Deliverable,
  Project,
  ProjectStatus,
} from '../types/practice';
import { formatCurrency, formatShortDate } from '../utils/formatters';

interface ProjectsScreenProps {
  projects: Project[];
  clients: Client[];
  deliverables: Deliverable[];
  activeTimer: ActiveTimerState;
  onToggleDeliverable: (deliverableId: string) => void;
  onAddDeliverable: (projectId: string, title: string) => void;
  onUpdateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  onStartTimerForProject: (projectId: string) => void;
  onOpenNewProject: () => void;
}

export function ProjectsScreen({
  projects,
  clients,
  deliverables,
  activeTimer,
  onToggleDeliverable,
  onAddDeliverable,
  onUpdateProjectStatus,
  onStartTimerForProject,
  onOpenNewProject,
}: ProjectsScreenProps) {
  const [filter, setFilter] = useState<'All' | ProjectStatus>('All');
  const [search, setSearch] = useState('');
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({});

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter !== 'All' && p.status !== filter) return false;
      if (!q) return true;
      const client = clients.find((c) => c.id === p.clientId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        (client?.company.toLowerCase().includes(q) ?? false)
      );
    });
  }, [projects, clients, filter, search]);

  const handleQuickAddDeliverable = (projectId: string) => {
    const val = (newTaskInputs[projectId] ?? '').trim();
    if (!val) return;
    onAddDeliverable(projectId, val);
    setNewTaskInputs((prev) => ({ ...prev, [projectId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter projects by status"
          className="inline-flex items-center p-1 rounded-lg bg-[#F0F2F8] border border-[#E8EAF2] self-start"
        >
          {(['All', 'Active', 'In Review', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                filter === tab
                  ? 'bg-[#FFFFFF] text-[#151B2C] shadow-xs'
                  : 'text-[#46464D] hover:text-[#151B2C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 text-[#8A90A5] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search engagements..."
              aria-label="Search engagements"
              className="exec-input w-full pl-9"
            />
          </div>
          <button
            type="button"
            onClick={onOpenNewProject}
            className="exec-btn-secondary h-10 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4 text-[#6C63FF]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="elevation-1 rounded-3xl p-12 text-center">
          <p className="text-sm font-semibold text-[#151B2C]">
            No matching engagements
          </p>
          <p className="text-xs text-[#8A90A5] mt-1">
            Adjust your status filter or create a new client engagement.
          </p>
          <button
            type="button"
            onClick={onOpenNewProject}
            className="exec-btn-primary mt-4"
          >
            Create Engagement
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const client = clients.find((c) => c.id === project.clientId);
            const projDeliverables = deliverables.filter(
              (d) => d.projectId === project.id
            );
            const pct = Math.min(
              100,
              Math.round((project.loggedHours / project.budgetCapHours) * 100)
            );
            const isTimerActive =
              activeTimer.isRunning && activeTimer.projectId === project.id;

            return (
              <article
                key={project.id}
                className="elevation-1 elevation-2-hover rounded-3xl p-6 flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-[#8A90A5] font-medium tnum">
                        {project.code} · {client?.company ?? 'Client'} ·{' '}
                        {project.billingModel}
                      </p>
                      <h3 className="text-base font-semibold text-[#151B2C] mt-1">
                        {project.name}
                      </h3>
                    </div>

                    <select
                      aria-label={`Status for ${project.name}`}
                      value={project.status}
                      onChange={(e) =>
                        onUpdateProjectStatus(
                          project.id,
                          e.target.value as ProjectStatus
                        )
                      }
                      className="h-8 px-2.5 rounded-lg border border-[#E8EAF2] bg-[#FAFBFD] text-xs font-medium text-[#20243A] focus:outline-none focus:border-[#6C63FF]"
                    >
                      <option value="Active">Active</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <p className="text-[13px] text-[#46464D] mt-2.5 leading-relaxed">
                    {project.scopeSummary}
                  </p>

                  {/* Burn / Cap Bar */}
                  <div className="mt-4 pt-4 border-t border-[#E8EAF2]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#8A90A5] font-medium">
                        Budget Utilization ({pct}%)
                      </span>
                      <span className="font-semibold text-[#151B2C] tnum">
                        {project.loggedHours.toFixed(1)} / {project.budgetCapHours}{' '}
                        hrs · {formatCurrency(project.loggedHours * project.hourlyRate)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F0F2F8] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#6C63FF] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Deliverables List */}
                  <div className="mt-5">
                    <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#8A90A5] mb-2">
                      Deliverables ({projDeliverables.filter((d) => d.completed).length}/
                      {projDeliverables.length})
                    </p>
                    <ul className="divide-y divide-[#E8EAF2]">
                      {projDeliverables.map((del) => (
                        <li
                          key={del.id}
                          className="py-2 flex items-center justify-between gap-2"
                        >
                          <button
                            type="button"
                            onClick={() => onToggleDeliverable(del.id)}
                            className="flex items-center gap-2.5 text-left min-w-0 flex-1"
                          >
                            <span
                              className={`h-4 w-4 rounded-[4px] flex items-center justify-center shrink-0 ${
                                del.completed
                                  ? 'bg-[#6C63FF] border border-[#6C63FF] text-white'
                                  : 'bg-[#FFFFFF] border-[1.5px] border-[#D5D8E4]'
                              }`}
                            >
                              {del.completed && (
                                <Check className="h-3 w-3 stroke-[2.5]" />
                              )}
                            </span>
                            <span
                              className={`text-[13px] truncate ${
                                del.completed
                                  ? 'line-through text-[#8A90A5]'
                                  : 'text-[#20243A]'
                              }`}
                            >
                              {del.title}
                            </span>
                          </button>
                          <span className="text-[11px] text-[#8A90A5] tnum shrink-0">
                            {formatShortDate(del.dueDate)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Inline Add Deliverable */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        value={newTaskInputs[project.id] ?? ''}
                        onChange={(e) =>
                          setNewTaskInputs((prev) => ({
                            ...prev,
                            [project.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleQuickAddDeliverable(project.id);
                          }
                        }}
                        placeholder="Add milestone deliverable..."
                        className="exec-input h-8 text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickAddDeliverable(project.id)}
                        className="exec-btn-secondary h-8 px-3 text-xs whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E8EAF2]">
                  <div className="flex items-center gap-2.5">
                    <StatusBadge status={project.status} />
                    <span className="text-xs text-[#8A90A5] tnum">
                      Due {formatShortDate(project.dueDate)}
                    </span>
                  </div>

                  {project.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => onStartTimerForProject(project.id)}
                      className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                        isTimerActive
                          ? 'bg-[#6C63FF] text-white'
                          : 'bg-[#252B48] text-white hover:bg-[#1B1F34]'
                      }`}
                    >
                      <Play className="h-3 w-3" />
                      <span>{isTimerActive ? 'Timer Active' : 'Start Timer'}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
