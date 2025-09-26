import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET: Ambil semua data logbook
export async function GET() {
  try {
    const { data, error } = await supabase.from("logbooks").select("*").order("tanggal", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah data logbook baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tanggal, kegiatan, kendala, url_foto } = body;

    if (!tanggal || !kegiatan) {
      return NextResponse.json({ error: "Tanggal dan Kegiatan wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("logbooks")
      .insert([
        {
          siswa_id: 1, // ID = 1 karena ini data dummy, nanti akan diubah sesuai user yang login
          tanggal,
          kegiatan,
          kendala: kendala || null,
          url_foto: url_foto || null,
          status: "Belum Diverifikasi",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
