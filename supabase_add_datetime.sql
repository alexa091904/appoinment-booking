-- Run this in the Supabase SQL Editor to add preferred date/time to appointments

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS preferred_date TEXT,
  ADD COLUMN IF NOT EXISTS preferred_time TEXT;
