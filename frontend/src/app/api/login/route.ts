// /app/api/login/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Pastikan path ini benar

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Menggunakan Supabase untuk autentikasi
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

   if (error) {
      console.error('Login error:', error.message);
      
      // Memberikan pesan error yang lebih spesifik
      if (error.message.includes("Email not confirmed")) {
        return NextResponse.json({ message: 'Login gagal. Silakan cek email Anda untuk verifikasi akun.' }, { status: 401 });
      } else {
        return NextResponse.json({ message: 'Email atau password salah.' }, { status: 401 });
      }
    }

    // Jika Supabase berhasil mengautentikasi, kita kembalikan respons sukses.
    // Supabase akan mengelola sesi pengguna secara otomatis.
    return NextResponse.json({ message: 'Login berhasil' }, { status: 200 });

  } catch (error) {
    // Menangani error umum seperti malformed JSON
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// Menangani metode HTTP lain selain POST
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}