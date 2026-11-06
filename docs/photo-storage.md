# DivaViva kalıcı fotoğraf depolama

Fotoğraflar web uygulamasına bağlı Supabase Storage üzerinde tutulur; GitHub deposuna veya geçici web sunucusu diskine yazılmaz.

## Klasör ve dosya standardı

- Orijinaller: `product-originals/{ÜRÜN_KODU}/{RENK}/...` (private)
- Yayına hazır görseller: `product-images/{ÜRÜN_KODU}/{RENK}/...` (public)
- Örnek ad: `DV-000468-GOLD-01-CLOSEUP.webp`

Orijinal fotoğraflar public URL almaz. Sunucu bir saatlik imzalı URL döndürür. İşlenmiş ve yayınlanması onaylanmış fotoğraflar public bucket'tan kalıcı URL alır.

## Supabase kurulumu

1. Supabase projesi oluşturun.
2. SQL Editor'da `supabase/storage-setup.sql` dosyasını çalıştırın.
3. Proje URL'sini ve anon key'i uygulamanın ortam değişkenlerine ekleyin.
4. Service role key'i yalnızca hosting sağlayıcısının server-side environment/secrets bölümüne ekleyin. Bu anahtarı tarayıcıya, GitHub'a veya sohbete koymayın.
5. `.env.example` içindeki değişkenleri hosting ortamında tanımlayın.

## API

`POST /api/media/upload` multipart form alanları:
- `file`: JPG, PNG, WEBP veya AVIF; en fazla 15 MB
- `productCode`: ürün kodu
- `color`: renk kodu (opsiyonel)
- `kind`: `original` veya `processed`

Bu endpoint şu an temel depolama altyapısıdır. Üretim kullanımından önce kullanıcı oturumu/rol kontrolü ve ürün kaydıyla ilişkilendirme de etkinleştirilmelidir. Service role anahtarı sunucu tarafında kalır.
