import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif"
};

function safeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 40);
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const productCode = safeCode(String(form.get("productCode") || ""));
    const color = safeCode(String(form.get("color") || "UNSORTED")) || "UNSORTED";
    const kind = String(form.get("kind") || "original");
    if (!(file instanceof File)) return NextResponse.json({ error: "Fotoğraf dosyası gerekli." }, { status: 400 });
    if (!productCode) return NextResponse.json({ error: "Ürün kodu gerekli." }, { status: 400 });
    const extension = ALLOWED_TYPES[file.type];
    if (!extension) return NextResponse.json({ error: "JPG, PNG, WEBP veya AVIF yükleyin." }, { status: 415 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Dosya en fazla 15 MB olabilir." }, { status: 413 });
    if (kind !== "original" && kind !== "processed") return NextResponse.json({ error: "Geçersiz görsel türü." }, { status: 400 });

    const bucket = kind === "original" ? "product-originals" : "product-images";
    const folder = `${productCode}/${color}`;
    const fileName = `${productCode}-${color}-${Date.now()}-${kind}.${extension}`;
    const path = `${folder}/${fileName}`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000"
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (kind === "processed") {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return NextResponse.json({ bucket, path, url: data.publicUrl });
    }
    const { data: signed, error: signedError } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
    if (signedError) return NextResponse.json({ error: signedError.message }, { status: 500 });
    return NextResponse.json({ bucket, path, signedUrl: signed.signedUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fotoğraf yüklenemedi.";
    const status = message.includes("ortam değişkenleri") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
