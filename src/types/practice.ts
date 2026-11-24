export type NavScreen =
  | 'overview'
  | 'projects'
  | 'invoices'
  | 'time'
  | 'clients'
  | 'settings';

export type ProjectStatus = 'Active' | 'In Review' | 'Completed';
export type InvoiceStatus = 'Paid' | 'In Review' | 'Overdue' | 'Draft';
export type DeliverableStatus = 'Active' | 'In Review' | 'Overdue' | 'Done';

export interface Client {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  retainerType: 'Retainer' | 'Fixed Scope' | 'Hourly Advisory';
  hourlyRate: number;
  paymentTerms: 'Net 15' | 'Net 30';
  location: string;
  status: 'Active' | 'Paused';
}

export interface Deliverable {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  status: DeliverableStatus;
  completed: boolean;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  code: string;
  scopeSummary: string;
  billingModel: 'Hourly' | 'Retainer' | 'Milestone';
  hourlyRate: number;
  budgetCapHours: number;
  loggedHours: number;
  status: ProjectStatus;
  dueDate: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  description: string;
  date: string;
  durationMinutes: number;
  billable: boolean;
  billedInvoiceId?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  hoursOrQty: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  projectId?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  notes?: string;
}

export interface PracticeSettings {
  practiceName: string;
  principalName: string;
  principalTitle: string;
  email: string;
  taxId: string;
  defaultHourlyRate: number;
  defaultTerms: 'Net 15' | 'Net 30';
  invoicePrefix: string;
  monthlyRevenueTarget: number;
}

export interface ActiveTimerState {
  isRunning: boolean;
  projectId: string;
  description: string;
  elapsedSeconds: number;
  startedAtMs: number | null;
}
