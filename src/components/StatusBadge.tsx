import { AlertCircle, CheckCircle2, Clock, FileEdit } from 'lucide-react';

export type BadgeVariant =
  | 'Paid'
  | 'In Review'
  | 'Overdue'
  | 'Active'
  | 'Completed'
  | 'Done'
  | 'Draft'
  | 'Paused'
  | 'Action Required';

interface StatusBadgeProps {
  status: BadgeVariant | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'Paid':
    case 'Completed':
    case 'Done':
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: '#15803D',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{status}</span>
        </span>
      );

    case 'In Review':
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#B45309',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{status}</span>
        </span>
      );

    case 'Overdue':
    case 'Action Required':
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#B91C1C',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{status}</span>
        </span>
      );

    case 'Active':
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0"
          style={{
            backgroundColor: 'rgba(108, 99, 255, 0.1)',
            color: '#4D41DF',
            border: '1px solid rgba(108, 99, 255, 0.22)',
          }}
        >
          <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>Active</span>
        </span>
      );

    default:
      return (
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap shrink-0"
          style={{
            backgroundColor: '#F0F2F8',
            color: '#20243A',
            border: '1px solid #E8EAF2',
          }}
        >
          <FileEdit className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{status}</span>
        </span>
      );
  }
}
