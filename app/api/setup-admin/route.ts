import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing Supabase environment variables.' }, { status: 500 });
  }

  // Use the service role key (admin) to create users
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const adminEmail = 'Dralexaadmin@gmail.com';
  const adminPassword = 'hospital123';

  // Check if user already exists first
  const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const alreadyExists = existingUsers.users.some(
    (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
  );

  if (alreadyExists) {
    return NextResponse.json({
      success: true,
      message: `Admin account already exists: ${adminEmail}. You can log in now.`,
    });
  }

  // Create the admin user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // Skip email verification
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `✅ Admin account created successfully!`,
    email: data.user?.email,
    note: 'You can now log in at /admin/login',
  });
}
