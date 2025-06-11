
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  urgent: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  before_image_url?: string;
  after_image_url?: string;
  hidden_until?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  role: 'employee' | 'manager';
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out?: string;
  total_hours?: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerRequest {
  id: string;
  category: 'indoor' | 'outdoor' | 'pots' | 'tools' | 'other';
  common_name: string;
  botanical_name?: string;
  size_specs?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'sourcing' | 'available' | 'fulfilled' | 'archived';
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Voucher {
  id: string;
  code: string;
  amount: number;
  used_amount: number;
  customer_name: string;
  customer_email?: string;
  from_name?: string;
  expiry_date?: string;
  status: 'active' | 'used' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Layby {
  id: string;
  layby_number: string;
  customer_name: string;
  customer_phone?: string;
  items: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CustomerCredit {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  credit_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
