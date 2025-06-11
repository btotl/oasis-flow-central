
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  role TEXT DEFAULT 'employee' CHECK (role IN ('employee', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES public.profiles(id),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  urgent BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  hidden_until TIMESTAMP WITH TIME ZONE
);

-- Create vouchers table
CREATE TABLE public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  used_amount DECIMAL(10,2) DEFAULT 0,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  from_name TEXT,
  expiry_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create laybys table
CREATE TABLE public.laybys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  layby_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  items TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  remaining_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer requests table
CREATE TABLE public.customer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT DEFAULT 'indoor' CHECK (category IN ('indoor', 'outdoor', 'pots', 'tools', 'other')),
  common_name TEXT NOT NULL,
  botanical_name TEXT,
  size_specs TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sourcing', 'available', 'fulfilled', 'archived')),
  notes TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time entries table
CREATE TABLE public.time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.profiles(id) NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out TIMESTAMP WITH TIME ZONE,
  total_hours DECIMAL(5,2),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employee notes table
CREATE TABLE public.employee_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create important messages table
CREATE TABLE public.important_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message acknowledgments table
CREATE TABLE public.message_acknowledgments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.important_messages(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, employee_id)
);

-- Create gift cards table (for future use)
CREATE TABLE public.gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer credit table (for future use)
CREATE TABLE public.customer_credit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  credit_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laybys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.important_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_credit ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for tasks
CREATE POLICY "Everyone can view tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Managers can create tasks" ON public.tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);
CREATE POLICY "Managers can update tasks" ON public.tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);
CREATE POLICY "Employees can update their assigned tasks" ON public.tasks FOR UPDATE USING (
  assigned_to = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);
CREATE POLICY "Managers can delete tasks" ON public.tasks FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Create RLS policies for vouchers
CREATE POLICY "Everyone can view vouchers" ON public.vouchers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create vouchers" ON public.vouchers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update vouchers" ON public.vouchers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can delete vouchers" ON public.vouchers FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Create RLS policies for laybys
CREATE POLICY "Everyone can view laybys" ON public.laybys FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create laybys" ON public.laybys FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update laybys" ON public.laybys FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can delete laybys" ON public.laybys FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Create RLS policies for customer requests
CREATE POLICY "Everyone can view customer requests" ON public.customer_requests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create customer requests" ON public.customer_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update customer requests" ON public.customer_requests FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can delete customer requests" ON public.customer_requests FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Create RLS policies for time entries
CREATE POLICY "Users can view their own time entries" ON public.time_entries FOR SELECT USING (
  employee_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);
CREATE POLICY "Users can create their own time entries" ON public.time_entries FOR INSERT WITH CHECK (employee_id = auth.uid());
CREATE POLICY "Users can update their own time entries" ON public.time_entries FOR UPDATE USING (
  employee_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Create RLS policies for employee notes
CREATE POLICY "Everyone can view employee notes" ON public.employee_notes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create notes" ON public.employee_notes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Managers can delete notes" ON public.employee_notes FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Create RLS policies for important messages
CREATE POLICY "Everyone can view important messages" ON public.important_messages FOR SELECT USING (true);
CREATE POLICY "Managers can create messages" ON public.important_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);
CREATE POLICY "Managers can update messages" ON public.important_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);
CREATE POLICY "Managers can delete messages" ON public.important_messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Create RLS policies for message acknowledgments
CREATE POLICY "Users can view acknowledgments" ON public.message_acknowledgments FOR SELECT USING (true);
CREATE POLICY "Users can create their own acknowledgments" ON public.message_acknowledgments FOR INSERT WITH CHECK (employee_id = auth.uid());

-- Create RLS policies for gift cards and customer credit (permissive for now)
CREATE POLICY "Everyone can view gift cards" ON public.gift_cards FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage gift cards" ON public.gift_cards FOR ALL WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Everyone can view customer credit" ON public.customer_credit FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage customer credit" ON public.customer_credit FOR ALL WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'User'),
    'employee'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
