
export interface VoucherData {
  id: string;
  code: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  expiryDate: string;
  status: 'active' | 'used' | 'archived';
  createdAt: string;
  usedAt?: string;
}

export interface LaybyData {
  id: string;
  customerName: string;
  customerPhone: string;
  item: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  payments: Array<{
    amount: number;
    date: string;
    method: string;
  }>;
}

export interface CustomerRequestData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  plantType: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  createdAt: string;
  assignedTo?: string;
}

export interface TimeEntryData {
  id: string;
  employeeName: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  date: string;
}

export interface EmployeeNoteData {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface ImportantMessageData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  acknowledgedBy: Array<{
    employeeName: string;
    acknowledgedAt: string;
  }>;
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  images?: string[];
  beforeImage?: string;
  afterImage?: string;
}

// Simple localStorage-based database simulation
// In a real app, this would use SQLite or a proper database
class LocalDatabase {
  private getKey(table: string): string {
    return `nursery_${table}`;
  }

  private getData<T>(table: string): T[] {
    const data = localStorage.getItem(this.getKey(table));
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(table: string, data: T[]): void {
    localStorage.setItem(this.getKey(table), JSON.stringify(data));
  }

  // Vouchers
  getVouchers(): VoucherData[] {
    return this.getData<VoucherData>('vouchers');
  }

  addVoucher(voucher: VoucherData): void {
    const vouchers = this.getVouchers();
    vouchers.push(voucher);
    this.setData('vouchers', vouchers);
  }

  updateVoucher(id: string, updates: Partial<VoucherData>): void {
    const vouchers = this.getVouchers();
    const index = vouchers.findIndex(v => v.id === id);
    if (index !== -1) {
      vouchers[index] = { ...vouchers[index], ...updates };
      this.setData('vouchers', vouchers);
    }
  }

  archiveVoucher(id: string): void {
    this.updateVoucher(id, { status: 'archived' });
  }

  // Laybys
  getLaybys(): LaybyData[] {
    return this.getData<LaybyData>('laybys');
  }

  addLayby(layby: LaybyData): void {
    const laybys = this.getLaybys();
    laybys.push(layby);
    this.setData('laybys', laybys);
  }

  updateLayby(id: string, updates: Partial<LaybyData>): void {
    const laybys = this.getLaybys();
    const index = laybys.findIndex(l => l.id === id);
    if (index !== -1) {
      laybys[index] = { ...laybys[index], ...updates };
      this.setData('laybys', laybys);
    }
  }

  archiveLayby(id: string): void {
    this.updateLayby(id, { status: 'archived' });
  }

  // Customer Requests
  getCustomerRequests(): CustomerRequestData[] {
    return this.getData<CustomerRequestData>('customer_requests');
  }

  addCustomerRequest(request: CustomerRequestData): void {
    const requests = this.getCustomerRequests();
    requests.push(request);
    this.setData('customer_requests', requests);
  }

  updateCustomerRequest(id: string, updates: Partial<CustomerRequestData>): void {
    const requests = this.getCustomerRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      this.setData('customer_requests', requests);
    }
  }

  archiveCustomerRequest(id: string): void {
    this.updateCustomerRequest(id, { status: 'archived' });
  }

  // Time Entries
  getTimeEntries(): TimeEntryData[] {
    return this.getData<TimeEntryData>('time_entries');
  }

  addTimeEntry(entry: TimeEntryData): void {
    const entries = this.getTimeEntries();
    entries.push(entry);
    this.setData('time_entries', entries);
  }

  updateTimeEntry(id: string, updates: Partial<TimeEntryData>): void {
    const entries = this.getTimeEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates };
      this.setData('time_entries', entries);
    }
  }

  // Employee Notes
  getEmployeeNotes(): EmployeeNoteData[] {
    return this.getData<EmployeeNoteData>('employee_notes');
  }

  addEmployeeNote(note: EmployeeNoteData): void {
    const notes = this.getEmployeeNotes();
    notes.push(note);
    this.setData('employee_notes', notes);
  }

  deleteEmployeeNote(id: string): void {
    const notes = this.getEmployeeNotes();
    const filteredNotes = notes.filter(n => n.id !== id);
    this.setData('employee_notes', filteredNotes);
  }

  // Important Messages
  getImportantMessages(): ImportantMessageData[] {
    return this.getData<ImportantMessageData>('important_messages');
  }

  addImportantMessage(message: ImportantMessageData): void {
    const messages = this.getImportantMessages();
    messages.push(message);
    this.setData('important_messages', messages);
  }

  updateImportantMessage(id: string, updates: Partial<ImportantMessageData>): void {
    const messages = this.getImportantMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates };
      this.setData('important_messages', messages);
    }
  }

  deleteImportantMessage(id: string): void {
    const messages = this.getImportantMessages();
    const filteredMessages = messages.filter(m => m.id !== id);
    this.setData('important_messages', filteredMessages);
  }

  // Tasks
  getTasks(): TaskData[] {
    return this.getData<TaskData>('tasks');
  }

  addTask(task: TaskData): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.setData('tasks', tasks);
  }

  updateTask(id: string, updates: Partial<TaskData>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.setData('tasks', tasks);
    }
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    this.setData('tasks', filteredTasks);
  }
}

export const db = new LocalDatabase();
