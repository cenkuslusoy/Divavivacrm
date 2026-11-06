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
- Responsive web arayüzü
- Lucide ikonları

## Yerel geliştirme
```bash
npm install
npm run dev
```

## Ortam değişkenleri
`.env.example` dosyasını `.env.local` olarak kopyalayın. Gerçek anahtarları GitHub'a commit etmeyin.

## Mevcut durum
İlk arayüz prototipi GitHub'a eklendi. Fotoğraf seçme/önizleme ve örnek taslak düzenleme tarayıcı içinde çalışır. Veriler henüz kalıcı veritabanına yazılmaz.

**Henüz bağlı olmayanlar:** gerçek AI görsel analizi ve ürün gruplama, AI görsel üretimi, Supabase, DivaViva web sitesi, Trendyol ve Hepsiburada API'leri, gerçek yayınlama ve stok senkronizasyonu.

İlk prototipte fotoğraflar yalnızca demo amacıyla ikili gruplara ayrılır; bu gerçek ürün/varyant tespiti değildir. Gerçek gruplama AI servisi bağlandığında yapılacaktır.
