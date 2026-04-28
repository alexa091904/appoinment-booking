"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck as Calendar, Hourglass as Clock, CheckCircle as CheckCircle2, ClipboardList as Megaphone, FileMedical as Inbox } from 'griddy-icons';
import dayjs from 'dayjs';
import { createClient } from '@/utils/supabase/client';
import { Form, Input, DatePicker, TimePicker, notification } from 'antd';

type Appointment = {
  id: number;
  status: string;
  preferred_date?: string;
};

export default function DashboardOverview() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = createClient();
  const [form] = Form.useForm();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchAppointments = useCallback(async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, status, preferred_date');
    if (!error && data) {
      setAppointments(data);
    }
  }, [supabase]);

  const loadAnnouncementConfig = useCallback(async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data && !error) {
      form.setFieldsValue({
        location: data.location,
        date: dayjs(data.date, 'YYYY-MM-DD'),
        time: dayjs(data.time, 'HH:mm A'),
      });
    }
  }, [supabase, form]);

  useEffect(() => {
    fetchAppointments();
    loadAnnouncementConfig();
  }, [fetchAppointments, loadAnnouncementConfig]);

  const handleUpdateAnnouncement = async (values: any) => {
    setSavingAnnouncement(true);
    const { error } = await supabase.from('announcements').insert([{
      location: values.location,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm A'),
    }]);
    if (error) { notification.error({ message: 'Failed to update announcement' }); }
    else { notification.success({ message: 'Announcement updated successfully' }); }
    setSavingAnnouncement(false);
  };

  let totalAppointmentsToday = 0;
  let pendingTotal = 0;
  let confirmedToday = 0;

  if (isMounted) {
    const todayStr = dayjs().format('YYYY-MM-DD');
    totalAppointmentsToday = appointments.filter(a => a.preferred_date === todayStr).length;
    pendingTotal = appointments.filter(a => !['Confirmed', 'Completed', 'Cancelled', 'Declined'].includes(a.status)).length;
    confirmedToday = appointments.filter(a => a.status === 'Confirmed' && a.preferred_date === todayStr).length;
  }

  const todayDisplay = isMounted ? dayjs().format('dddd, MMMM D, YYYY') : '';

  return (
    <div className="p-8 w-full">
      {/* Hero Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back, Secretary!</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2 font-medium">
          <Calendar className="w-4 h-4" /> {todayDisplay}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Today</p>
            <h2 className="text-3xl font-bold text-slate-800">{totalAppointmentsToday}</h2>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending Requests</p>
            <h2 className="text-3xl font-bold text-amber-500">{pendingTotal}</h2>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <Inbox className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Confirmed</p>
            <h2 className="text-3xl font-bold text-emerald-600">{confirmedToday}</h2>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Content Area separating Annoucement Manager and Negative Space */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Announcement Manager (Takes ~40% width on large screens) */}
        <div className="lg:w-2/5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Megaphone className="w-24 h-24" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Megaphone className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Announcement Manager</h2>
            </div>
            
            <div className="relative z-10">
              <Form layout="vertical" form={form} onFinish={handleUpdateAnnouncement} requiredMark={false}>
                <Form.Item label={<span className="font-semibold text-slate-700">Clinic Location</span>} name="location" rules={[{ required: true }]}>
                  <Input placeholder="Clinic / Hospital name" size="large" className="rounded-lg h-11" />
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item label={<span className="font-semibold text-slate-700">Available Date</span>} name="date" rules={[{ required: true }]}>
                    <DatePicker className="w-full rounded-lg h-11" size="large" />
                  </Form.Item>
                  <Form.Item label={<span className="font-semibold text-slate-700">Available Time</span>} name="time" rules={[{ required: true }]}>
                    <TimePicker use12Hours format="h:mm a" className="w-full rounded-lg h-11" size="large" />
                  </Form.Item>
                </div>
                <button
                  type="submit"
                  disabled={savingAnnouncement}
                  className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-sm flex justify-center items-center gap-2"
                >
                  {savingAnnouncement ? 'Updating...' : 'Update Announcement'}
                </button>
              </Form>
            </div>
          </div>
        </div>
        
        {/* Quick View / Negative Space */}
        <div className="lg:w-3/5 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-8 min-h-[300px]">
          <div className="text-center text-slate-400">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
              <Inbox className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-medium">Quick View Area</p>
            <p className="text-sm mt-1">Select patients from the Patients tab to manage them.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
