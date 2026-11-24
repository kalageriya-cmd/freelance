import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FilePlus2,
  Pause,
  Play,
  Square,
} from 'lucide-react';
import type { ActiveTimerState, Project } from '../types/practice';
import { formatCurrency, formatStopwatch } from '../utils/formatters';

interface TimeTrackerDockProps {
  timer: ActiveTimerState;
  projects: Project[];
  unbilledSummary: {
    hours: number;
    amount: number;
    count: number;
  };
  onToggleRun: () => void;
  onStopAndLog: () => void;
  onChangeProject: (projectId: string) => void;
  onChangeDescription: (description: string) => void;
  onDraftInvoiceFromUnbilled: () => void;
}

export function TimeTrackerDock({
  timer,
  projects,
  unbilledSummary,
  onToggleRun,
  onStopAndLog,
  onChangeProject,
  onChangeDescription,
  onDraftInvoiceFromUnbilled,
}: TimeTrackerDockProps) {
  const [minimized, setMinimized] = useState(false);

  const activeProject =
    projects.find((p) => p.id === timer.projectId) ?? projects[0];

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <div className="elevation-3 rounded-[12px] px-3.5 py-2.5 flex items-center gap-3">
          {timer.isRunning && (
            <span
              className="h-2 w-2 rounded-full bg-[#6C63FF] animate-pulse shrink-0"
              aria-label="Timer running"
            />
          )}
          <span className="font-mono-tnum text-sm font-semibold text-[#151B2C]">
            {formatStopwatch(timer.elapsedSeconds)}
          </span>
          <button
            type="button"
            onClick={onToggleRun}
            aria-label={timer.isRunning ? 'Pause timer' : 'Start timer'}
            className="h-7 w-7 rounded-md bg-[#6C63FF] text-white flex items-center justify-center hover:bg-[#5B52E0] transition-colors"
          >
            {timer.isRunning ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5 ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMinimized(false)}
            aria-label="Expand time tracker dock"
            className="h-7 w-7 rounded-md text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] flex items-center justify-center transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Time Tracker and Invoice Dock"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[348px] elevation-3 rounded-[12px] overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAFBFD] border-b border-[#E8EAF2]">
        <div className="flex items-center gap-2 min-w-0">
          {timer.isRunning && (
            <span
              className="h-2 w-2 rounded-full bg-[#6C63FF] animate-pulse shrink-0"
              aria-hidden="true"
            />
          )}
          <span className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#46464D] truncate">
            {timer.isRunning ? 'Tracking Billable Time' : 'Time Tracker Dock'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMinimized(true)}
          aria-label="Minimize time tracker dock"
          className="h-6 w-6 rounded text-[#8A90A5] hover:bg-[#F0F2F8] hover:text-[#20243A] flex items-center justify-center transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Timer & Controls */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-mono-tnum text-2xl font-semibold text-[#151B2C] leading-none">
              {formatStopwatch(timer.elapsedSeconds)}
            </div>
            <p className="text-[11.5px] text-[#8A90A5] mt-1 tnum">
              {activeProject
                ? `${activeProject.code} · $${activeProject.hourlyRate}/hr`
                : 'Select project'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleRun}
              aria-label={timer.isRunning ? 'Pause timer' : 'Start timer'}
              className={`h-9 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                timer.isRunning
                  ? 'bg-[#F2F3FF] text-[#4D41DF] border border-[#6C63FF]/30 hover:bg-[#EAEDFF]'
                  : 'bg-[#6C63FF] text-white hover:bg-[#5B52E0]'
              }`}
            >
              {timer.isRunning ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Start</span>
                </>
              )}
            </button>

            {timer.elapsedSeconds > 0 && (
              <button
                type="button"
                onClick={onStopAndLog}
                title="Stop and log time entry"
                aria-label="Stop and log time entry"
                className="h-9 px-2.5 rounded-lg bg-[#252B48] text-white hover:bg-[#1B1F34] text-xs font-medium inline-flex items-center gap-1 transition-colors"
              >
                <Square className="h-3 w-3 fill-current" />
                <span>Log</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <select
            aria-label="Active timer project"
            value={timer.projectId}
            onChange={(e) => onChangeProject(e.target.value)}
            className="w-full h-9 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8EAF2] text-[13px] font-medium text-[#20243A] focus:outline-none focus:border-[#6C63FF]"
          >
            {projects
              .filter((p) => p.status !== 'Completed')
              .map((project) => (
                <option key={project.id} value={project.id}>
                  {project.code} — {project.name}
                </option>
              ))}
          </select>

          <input
            type="text"
            value={timer.description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="What are you working on?"
            aria-label="Work session description"
            className="w-full h-9 px-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8EAF2] text-[13px] text-[#20243A] placeholder:text-[#8A90A5] focus:outline-none focus:border-[#6C63FF]"
          />
        </div>
      </div>

      {/* Unbilled Invoice Footer Dock */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#FAFBFD] border-t border-[#E8EAF2]">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-[#8A90A5]">Unbilled Ready</p>
          <p className="text-[13px] font-semibold text-[#151B2C] tnum truncate">
            {unbilledSummary.hours.toFixed(1)} hrs ·{' '}
            {formatCurrency(unbilledSummary.amount)}
          </p>
        </div>

        <button
          type="button"
          onClick={onDraftInvoiceFromUnbilled}
          disabled={unbilledSummary.count === 0}
          className="exec-btn-secondary h-8 px-2.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <FilePlus2 className="h-3.5 w-3.5 text-[#6C63FF]" />
          <span>Draft Invoice</span>
        </button>
      </div>
    </aside>
  );
}
