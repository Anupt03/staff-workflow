-- ========================================================
-- Supabase Schema for Employee Management System (EMS)
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (SuperAdmin, HR, Admins & Employees)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123',
    role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('superadmin', 'hr', 'admin', 'employee')),
    department TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assigned_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    task_description TEXT,
    task_date TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'newTask' CHECK (status IN ('newTask', 'active', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by assigned_to
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read and write for simple application integration
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on profiles" ON public.profiles FOR DELETE USING (true);

CREATE POLICY "Allow public read access on tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on tasks" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on tasks" ON public.tasks FOR DELETE USING (true);

-- ========================================================
-- SEED DATA FOR HIERARCHY
-- ========================================================

-- Insert Hierarchy Profiles
INSERT INTO public.profiles (id, first_name, email, password, role, department)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'SuperAdmin', 'superadmin@me.com', '123', 'superadmin', 'Executive'),
    ('00000000-0000-0000-0000-000000000002', 'HR Manager', 'hr@me.com', '123', 'hr', 'Human Resources'),
    ('00000000-0000-0000-0000-000000000001', 'Admin Lead', 'admin@me.com', '123', 'admin', 'Management')
ON CONFLICT (email) DO NOTHING;

-- Insert Employees
INSERT INTO public.profiles (id, first_name, email, password, role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Arjun', 'e@e.com', '123', 'employee'),
    ('22222222-2222-2222-2222-222222222222', 'Sneha', 'employee2@example.com', '123', 'employee'),
    ('33333333-3333-3333-3333-333333333333', 'Ravi', 'employee3@example.com', '123', 'employee'),
    ('44444444-4444-4444-4444-444444444444', 'Priya', 'employee4@example.com', '123', 'employee'),
    ('55555555-5555-5555-5555-555555555555', 'Karan', 'employee5@example.com', '123', 'employee'),
    ('66666666-6666-6666-6666-666666666666', 'Pranav', 'pranav@example.com', '123', 'employee')
ON CONFLICT (email) DO NOTHING;

-- Insert Initial Tasks for Arjun
INSERT INTO public.tasks (assigned_to, task_title, task_description, task_date, category, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Update website', 'Revamp the homepage design', '2024-10-12', 'Design', 'newTask'),
    ('11111111-1111-1111-1111-111111111111', 'Client meeting', 'Discuss project requirements', '2024-10-10', 'Meeting', 'completed'),
    ('11111111-1111-1111-1111-111111111111', 'Fix bugs', 'Resolve bugs reported in issue tracker', '2024-10-14', 'Development', 'active');

-- Insert Initial Tasks for Sneha
INSERT INTO public.tasks (assigned_to, task_title, task_description, task_date, category, status)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'Database optimization', 'Optimize queries for better performance', '2024-10-11', 'Database', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'Design new feature', 'Create mockups for the new feature', '2024-10-09', 'Design', 'completed');

-- Insert Initial Tasks for Ravi
INSERT INTO public.tasks (assigned_to, task_title, task_description, task_date, category, status)
VALUES 
    ('33333333-3333-3333-3333-333333333333', 'Prepare presentation', 'Prepare slides for upcoming client presentation', '2024-10-13', 'Presentation', 'newTask'),
    ('33333333-3333-3333-3333-333333333333', 'Code review', 'Review the codebase for optimization', '2024-10-12', 'Development', 'active'),
    ('33333333-3333-3333-3333-333333333333', 'Testing', 'Test the latest build for bugs', '2024-10-08', 'QA', 'completed');

-- Insert Initial Tasks for Priya
INSERT INTO public.tasks (assigned_to, task_title, task_description, task_date, category, status)
VALUES 
    ('44444444-4444-4444-4444-444444444444', 'Write documentation', 'Update the project documentation', '2024-10-13', 'Documentation', 'newTask'),
    ('44444444-4444-4444-4444-444444444444', 'Set up CI/CD', 'Implement continuous integration pipeline', '2024-10-11', 'DevOps', 'active');

-- Insert Initial Tasks for Karan
INSERT INTO public.tasks (assigned_to, task_title, task_description, task_date, category, status)
VALUES 
    ('55555555-5555-5555-5555-555555555555', 'UI redesign', 'Redesign the user interface for better UX', '2024-10-14', 'Design', 'newTask'),
    ('55555555-5555-5555-5555-555555555555', 'Deploy new build', 'Deploy the latest build to production', '2024-10-09', 'DevOps', 'completed'),
    ('55555555-5555-5555-5555-555555555555', 'Client feedback', 'Gather feedback from clients after product launch', '2024-10-12', 'Support', 'active');

-- Insert Initial Tasks for Pranav
INSERT INTO public.tasks (assigned_to, task_title, task_description, task_date, category, status)
VALUES 
    ('66666666-6666-6666-6666-666666666666', 'System Integration', 'Integrate backend modules with UI', '2024-10-15', 'Development', 'newTask');
