import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2026-10";
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif"
};

type ShopifyResponse<T> = { data?: T; errors?: { message: string }[] };

async function shopifyGraphql<T>(query: string, variables: Record<string, unknown> = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token) throw new Error("Shopify bağlantısı henüz yapılandırılmadı. Yönetim paneli erişim bilgileri gerekli.");
  const response = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });
  const result = await response.json() as ShopifyResponse<T>;
  if (!response.ok || result.errors?.length) throw new Error(result.errors?.map(e => e.message).join("; ") || "Shopify API isteği başarısız.");
  if (!result.data) throw new Error("Shopify beklenen veriyi döndürmedi.");
  return result.data;
}

async function stageImage(file: File, productCode: string, index: number) {
  const extension = MIME_EXT[file.type];
  if (!extension || file.size > MAX_FILE_SIZE) throw new Error(`${file.name}: desteklenmeyen dosya veya 15 MB üzeri.`);
  const filename = `${productCode}-${String(index + 1).padStart(2, "0")}-${Date.now()}.${extension}`;
  const staged = await shopifyGraphql<{
    stagedUploadsCreate: {
      stagedTargets: { url: string; resourceUrl: string; parameters: { name: string; value: string }[] }[];
      userErrors: { message: string }[];
    }
  }>(`mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { message }
    }
  }`, { input: [{ resource: "PRODUCT_IMAGE", filename, mimeType: file.type, httpMethod: "POST" }] });
  const result = staged.stagedUploadsCreate;
  if (result.userErrors.length || !result.stagedTargets[0]) throw new Error(result.userErrors.map(e => e.message).join("; ") || "Shopify görsel yükleme adresi oluşturulamadı.");
  const target = result.stagedTargets[0];
  const form = new FormData();
  target.parameters.forEach(p => form.append(p.name, p.value));
  form.append("file", file, filename);
  const upload = await fetch(target.url, { method: "POST", body: form });
  if (!upload.ok) throw new Error(`${file.name}: Shopify görsel yüklemesi başarısız.`);
  return target.resourceUrl;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const title = String(form.get("title") || "").trim();
    const productCode = String(form.get("productCode") || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 40);
    const descriptionHtml = String(form.get("descriptionHtml") || "");
    const productType = String(form.get("productType") || "");
    const tags = String(form.get("tags") || "").split(",").map(t => t.trim()).filter(Boolean);
    const price = String(form.get("price") || "").replace(",", ".");
    const files = form.getAll("photos").filter((value): value is File => value instanceof File);
    if (!title || !productCode) return NextResponse.json({ error: "Ürün adı ve ürün kodu gerekli." }, { status: 400 });
    if (price && (!/^\d+(\.\d{1,2})?$/.test(price))) return NextResponse.json({ error: "Web fiyatı geçerli bir tutar olmalı." }, { status: 400 });
    const mediaSources: string[] = [];
    for (let i = 0; i < files.length; i++) mediaSources.push(await stageImage(files[i], productCode, i));
    const media = mediaSources.map(originalSource => ({ mediaContentType: "IMAGE", originalSource }));
    const created = await shopifyGraphql<{
      productCreate: {
        product: { id: string; title: string; handle: string; onlineStoreUrl: string | null; status: string; variants: { nodes: { id: string }[] } };
        userErrors: { field: string[] | null; message: string }[];
      }
    }>(`mutation productCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product { id title handle onlineStoreUrl status variants(first: 1) { nodes { id } } }
        userErrors { field message }
      }
    }`, {
      product: { title, descriptionHtml, productType, vendor: "DivaViva", status: "DRAFT", tags: [productCode, ...tags] },
      media
    });
    const result = created.productCreate;
    if (result.userErrors.length || !result.product) {
      return NextResponse.json({ error: result.userErrors.map(e => e.message).join("; ") || "Shopify ürün oluşturamadı." }, { status: 422 });
    }
    if (price && result.product.variants.nodes[0]) {
      const priced = await shopifyGraphql<{
        productVariantsBulkUpdate: { userErrors: { message: string }[] }
      }>(`mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) { userErrors { message } }
      }`, { productId: result.product.id, variants: [{ id: result.product.variants.nodes[0].id, price }] });
      if (priced.productVariantsBulkUpdate.userErrors.length) {
        return NextResponse.json({ warning: "Ürün taslak olarak oluşturuldu ancak fiyat kaydedilemedi: " + priced.productVariantsBulkUpdate.userErrors.map(e => e.message).join("; "), product: result.product }, { status: 207 });
      }
    }
    return NextResponse.json({ product: result.product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Shopify ürün oluşturulamadı.";
    return NextResponse.json({ error: message }, { status: message.includes("henüz yapılandırılmadı") ? 503 : 500 });
  }
}
