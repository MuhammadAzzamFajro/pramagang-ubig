import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET: ambil semua data logbook
export async function GET() {
  const { data, error } = await supabase.from("logbook").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: tambah data logbook baru
export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, kegiatan } = body;

  const { data, error } = await supabase
    .from("logbook")
    .insert([{ user_id, kegiatan }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
