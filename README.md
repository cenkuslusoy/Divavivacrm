# DivaViva Studio

DivaViva için mobil öncelikli ürün hazırlama ve çok kanallı satış yönetim paneli.

## V1 ürün akışı
1. Fotoğrafları toplu yükle.
2. Web sitesi, Trendyol ve Hepsiburada fiyatlarını ve başlangıç stoğunu gir.
3. Ürün taslaklarını oluştur.
4. Ürün adı, kategori, malzeme, renk varyantları, açıklama ve SEO alanlarını düzenle.
5. İlerleyen entegrasyon aşamasında taslakları onaylayıp kanallara gönder.

## Teknoloji
- Next.js App Router
- React + TypeScript
- Supabase Storage (kalıcı ürün fotoğrafı depolama altyapısı)
- Lucide ikonları

## Yerel geliştirme
```bash
npm install
npm run dev
```

## Fotoğraf depolama kurulumu
Supabase Storage altyapısı ve API endpoint'i eklendi. Kurulum adımları için [fotoğraf depolama rehberine](docs/photo-storage.md) bakın. Bucket'ları oluşturmak için Supabase SQL Editor'da `supabase/storage-setup.sql` dosyasını çalıştırın.

- Orijinal fotoğraflar: private `product-originals` bucket.
- Onaylanmış/işlenmiş ürün görselleri: public `product-images` bucket.
- Dosya yolu ürün kodu ve renk varyantına göre düzenlenir.
- Service role key yalnızca sunucu ortam değişkeninde tutulur.

## Ortam değişkenleri
`.env.example` dosyasını `.env.local` olarak kopyalayın. Gerçek anahtarları GitHub'a commit etmeyin.

## Mevcut durum
İlk arayüz prototipi ve kalıcı fotoğraf depolama sunucu altyapısı GitHub'a eklendi. Depolama, Supabase projesi ve hosting ortam değişkenleri yapılandırılınca kullanılabilir. Mevcut ürün ekranındaki fotoğraf seçimi henüz bu API'ye bağlanmış değildir; mevcut taslaklar tarayıcı belleğinde tutulur.

**Henüz bağlı olmayanlar:** gerçek AI görsel analizi ve ürün gruplama, AI görsel üretimi, ürün/veri kayıtlarının kalıcı veritabanına yazılması, DivaViva web sitesi, Trendyol ve Hepsiburada API'leri, gerçek yayınlama ve stok senkronizasyonu.

İlk prototipte fotoğraflar yalnızca demo amacıyla ikili gruplara ayrılır; bu gerçek ürün/varyant tespiti değildir.
