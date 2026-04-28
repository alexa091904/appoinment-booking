"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home as LayoutDashboard, User as Users, LogOut, Hospital } from 'griddy-icons';
import { createClient } from '@/utils/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const isLoginPage = pathname?.includes('/login');

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SaaS Style Sidebar */}
      <aside className="w-64 bg-slate-50 flex flex-col border-r border-slate-200 shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Hospital className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-bold text-slate-800 text-lg">Admin Portal</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/admin' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/admin/patients" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/admin/patients' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 font-medium'}`}
          >
            <Users className="w-5 h-5" />
            Patients
          </Link>
          
          {/* Sign Out pinned to absolute bottom */}
          <button 
            onClick={handleLogout}
            className="mt-auto mb-2 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-rose-500 border border-transparent hover:border-rose-200 hover:bg-rose-50 transition-all w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
