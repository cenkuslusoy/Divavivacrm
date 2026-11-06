-- Supabase Dashboard > SQL Editor içinde bir kez çalıştırın.
-- Orijinal fotoğraflar private kalır; public ürün görselleri ayrı bucket'tadır.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-originals', 'product-originals', false, 15728640, array['image/jpeg','image/png','image/webp','image/avif']),
  ('product-images', 'product-images', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Yükleme yalnızca sunucu tarafındaki service-role anahtarıyla yapılır.
-- Bu nedenle tarayıcı kullanıcılarına bucket yazma izni verilmez.
