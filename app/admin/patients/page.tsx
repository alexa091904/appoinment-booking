"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Table, notification } from 'antd';
import { CheckCircle as CheckCircle2, X as XCircle, FileMedical as FileText, Phone, Email as Mail, X } from 'griddy-icons';
import dayjs from 'dayjs';
import { createClient } from '@/utils/supabase/client';

type Appointment = {
  id: number;
  created_at: string;
  patient_name: string;
  email: string;
  contact_number: string;
  type: string;
  purpose: string;
  preferred_date?: string;
  preferred_time?: string;
  status: string;
};

export default function PatientsManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const supabase = createClient();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setAppointments(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPatient(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateStatus = async (id: number, newStatus: string, email?: string, patientName?: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);

    if (error) {
      notification.error({ message: `Failed to update status.` });
      setUpdatingId(null);
      return;
    }

    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    
    // Only send email when confirming
    if (newStatus === 'Confirmed' && email && patientName) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: '✅ Appointment Confirmed — Dr. Alexa Clinic',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #059669;">Appointment Confirmed!</h2>
              <p>Hi ${patientName}, your appointment request has been confirmed by our medical secretary.</p>
            </div>`
          }),
        });
        notification.success({ message: `Appointment Approved & Email Sent!` });
      } catch (err) {
        notification.success({ message: `Appointment Approved! (Email failed to send)` });
      }
    } else {
      notification.success({ message: `Appointment marked as ${newStatus}` });
    }
    
    // Close modal if open on the same record and changing tab contexts
    if (selectedPatient?.id === id) {
        if (newStatus === 'Completed' || newStatus === 'Declined' || newStatus === 'Cancelled') {
            setSelectedPatient(null);
        } else {
            setSelectedPatient(prev => prev ? { ...prev, status: newStatus } : null);
        }
    }

    setUpdatingId(null);
  };

  const filteredAppointments = appointments.filter(a => {
    const search = searchText.toLowerCase();
    return a.patient_name.toLowerCase().includes(search) || 
           a.contact_number.includes(search) || 
           a.email.toLowerCase().includes(search);
  });

  const pendingList = filteredAppointments.filter(a => a.status === 'Pending' || !a.status);
  const confirmedList = filteredAppointments.filter(a => a.status === 'Confirmed');
  const completedList = filteredAppointments.filter(a => ['Completed', 'Declined', 'Cancelled'].includes(a.status));

  // Custom Pill Badge Renderer
  const renderStatusPill = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block";
    if (status === 'Confirmed') return <span className={`${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`}>{status}</span>;
    if (status === 'Completed') return <span className={`${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`}>{status}</span>;
    if (status === 'Declined' || status === 'Cancelled') return <span className={`${baseClasses} bg-rose-100 text-rose-700 border border-rose-200`}>{status}</span>;
    return <span className={`${baseClasses} bg-amber-100 text-amber-700 border border-amber-200`}>{status || 'Pending'}</span>;
  };

  const baseColumns = [
    { title: 'Patient Name', dataIndex: 'patient_name', key: 'name', className: 'font-medium text-slate-800' },
    { title: 'Contact / Email', key: 'contact', render: (_: any, r: Appointment) => (
      <div className="flex flex-col gap-1 text-sm text-slate-500">
        <span>{r.contact_number}</span>
        <span className="text-xs">{r.email}</span>
      </div>
    )},
    { title: 'Requested Date', key: 'date', render: (_: any, r: Appointment) => (
      <div className="text-slate-600">
        {r.preferred_date ? dayjs(r.preferred_date).format('MMM D, YYYY') : 'None'} <br/>
        <span className="text-xs text-slate-400">{r.preferred_time}</span>
      </div>
    )},
    { title: 'Type', dataIndex: 'type', key: 'type', className: 'text-slate-600' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => renderStatusPill(v) }
  ];

  const pendingColumns = [
    ...baseColumns,
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_: any, record: Appointment) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => updateStatus(record.id, 'Confirmed', record.email, record.patient_name)}
            disabled={updatingId === record.id}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve
          </button>
          <button
            onClick={() => updateStatus(record.id, 'Declined')}
            disabled={updatingId === record.id}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 active:scale-95 text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            <XCircle className="w-4 h-4" /> Decline
          </button>
        </div>
      )
    }
  ];

  const confirmedColumns = [
    ...baseColumns,
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_: any, record: Appointment) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => updateStatus(record.id, 'Completed')}
            disabled={updatingId === record.id}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Complete
          </button>
        </div>
      )
    }
  ];

  const completedColumns = [...baseColumns]; // Read-only, no actions column

  const getActiveColumns = () => {
    if (activeTab === 'pending') return pendingColumns;
    if (activeTab === 'confirmed') return confirmedColumns;
    return completedColumns;
  };

  const getActiveData = () => {
    if (activeTab === 'pending') return pendingList;
    if (activeTab === 'confirmed') return confirmedList;
    return completedList;
  };

  return (
    <div className="p-8 w-full max-w-[1400px] mx-auto flex flex-col h-full">
      
      {/* Header & Tab Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Patient Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Review, approve, and track all medical appointments.</p>
        </div>
        
        <div className="flex items-center gap-2 border border-slate-200 bg-white p-1 rounded-xl shadow-sm self-start">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            Pending ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'confirmed' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            Confirmed ({confirmedList.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            History
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Search Bar Row */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-end">
          <div className="relative w-full max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search by name, email, or contact..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
            />
          </div>
        </div>

        {/* Ant Design Table */}
        <div className="px-4 pb-2 pt-4 flex-1">
          <Table
            columns={getActiveColumns()}
            dataSource={getActiveData()}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 9, position: ['bottomCenter'] }}
            rowClassName={() => "cursor-pointer transition-colors hover:bg-slate-50/80"}
            onRow={(record) => ({ onClick: () => setSelectedPatient(record as Appointment) })}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      {/* SaaS Styled Patient Details Modal */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedPatient(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Patient Details</span>
                <h3 className="text-2xl font-bold text-slate-800">{selectedPatient.patient_name}</h3>
                <div className="mt-3">{renderStatusPill(selectedPatient.status)}</div>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"><Mail className="w-3.5 h-3.5" /> Email</div>
                  <p className="text-slate-700 font-medium whitespace-pre-wrap word-break">{selectedPatient.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"><Phone className="w-3.5 h-3.5" /> Contact</div>
                  <p className="text-slate-700 font-medium">{selectedPatient.contact_number}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"><FileText className="w-3.5 h-3.5" /> Type</div>
                  <p className="text-slate-700 font-medium">{selectedPatient.type}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Filed On</div>
                  <p className="text-slate-700 font-medium">{dayjs(selectedPatient.created_at).format('MMM D, YYYY')}</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <FileText className="w-4 h-4" /> Purpose / Concerns
                </div>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {selectedPatient.purpose || 'No additional details provided.'}
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            {(activeTab === 'pending' || activeTab === 'confirmed') && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                {activeTab === 'pending' && (
                  <button
                    onClick={() => updateStatus(selectedPatient.id, 'Confirmed', selectedPatient.email, selectedPatient.patient_name)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    Approve Appointment
                  </button>
                )}
                {activeTab === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(selectedPatient.id, 'Completed')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    Complete Appointment
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Override global Ant Design elements locally where needed */}
      <style>{`
        .ant-table-wrapper .ant-table {
          color: #334155;
          font-family: inherit;
        }
        .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #64748b !important;
          font-weight: 700 !important;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e2e8f0 !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
        }
        .ant-pagination .ant-pagination-item-active {
          border-color: #6366f1;
          background-color: #e0e7ff;
        }
        .ant-pagination .ant-pagination-item-active a {
          color: #4f46e5;
        }
      `}</style>
    </div>
  );
}
