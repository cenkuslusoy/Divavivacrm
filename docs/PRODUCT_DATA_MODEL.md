# DivaViva ürün veri modeli ve iş akışı

## Temel karar

Shopify, ürün kataloğunun ana kaynağıdır. Uygulamanın kendi veritabanı Shopify'ın yerine ikinci bir ürün kataloğu oluşturmayacak; yalnızca ürün hazırlama oturumları, görsel gruplama önerileri, AI çıktıları, pazaryeri eşleştirmeleri ve işlem durumları gibi operasyonel verileri tutacaktır.

## Shopify üzerinde tutulacak veriler

| Alan | Shopify kaydı |
|---|---|
| Ürün adı ve açıklama | Product title / descriptionHtml |
| Ürün kodu | Product/variant SKU (tek varyantta ilk varyanta; çok varyantta her varyanta ayrı SKU) |
| Ürün fotoğrafları | Product media; Shopify tarafından barındırılan medya |
| Renk ve diğer seçenekler | Product options + variants |
| Web satış fiyatı | Variant price |
| Stok | InventoryItem / InventoryLevel |
| Marka | Vendor = DivaViva |
| Kategori | Shopify product category / productType (gerektiği gibi) |
| SEO | SEO title / description |
| Pazaryeri kaynak kodları | Metafields veya uygulama DB eşleştirme kayıtları |

Ürün fotoğrafları yerel dosya sisteminde kalıcı katalog olarak tutulmaz. Yükleme sırasında geçici işlenir, Shopify medya kaydı oluşturulur; uygulama Shopify medya ID/URL değerlerini kullanır.

## Uygulama veritabanında tutulacak operasyonel veriler

- Shop kimliği (Shopify domain + shop GID)
- Yükleme oturumu ve fotoğraf grupları
- AI tarafından önerilen başlık/açıklama/SEO/malzeme/renk bilgileri ve onay durumu
- Ürün oluşturma işi ve hata/yeniden deneme durumu
- Shopify Product GID / Variant GID bağlantıları
- Trendyol ve Hepsiburada ürün/variant ID eşleştirmeleri
- Pazaryeri bazında son senkronizasyon zamanı, durum ve hata kayıtları

Uygulama DB'sindeki kayıtlar Shopify ürününün yerine geçmez; Shopify GID ile ilişkilendirilir.

## Fotoğraf yükleme ve ürün oluşturma akışı

1. Kullanıcı birden fazla fotoğraf yükler.
2. Sistem görselleri önizler; kullanıcı her fotoğrafı ürüne bağlar. Otomatik gruplama yalnızca öneridir, kullanıcı onayı olmadan ürün oluşturmaz.
3. Aynı ürünün renkleri ayrı varyant olarak tanımlanır; farklı ürünler ayrı Product kaydı olur.
4. AI başlık, açıklama, kategori, SEO ve özellik önerileri hazırlar. Malzeme gibi doğrulanamayan özellikler otomatik kesin bilgiye çevrilmez.
5. Kullanıcı fiyat, SKU, stok ve varyantları kontrol eder.
6. Sunucu Shopify Admin oturumunu doğrular, fotoğrafları Shopify'a yükler ve Product + Variant kayıtlarını DRAFT olarak oluşturur.
7. Sonuç ekranı Shopify Admin ürün sayfasına bağlantı verir; kullanıcı Shopify içinde kontrol edip yayınlar.

## Stok ve kanal fiyatları

Shopify web fiyatı ve stok için ana kaynak olur. Trendyol/Hepsiburada fiyatları kanal bazında farklı olabileceği için Shopify varyant fiyatını ezmek yerine uygulama DB'sinde kanal fiyatı tutulur; marketplace API'lerine bu fiyat gönderilir. Stokta ortak havuz yaklaşımı seçilirse Shopify inventory seviyeleri baz alınır ve her pazaryerine güvenli rezerv/yeniden deneme kurallarıyla yansıtılır.

## Otomatik stok senkronizasyonu

Stok akışının ayrıntılı tasarımı [STOCK_SYNC.md](STOCK_SYNC.md) dosyasındadır. Özet karar: Shopify merkezli ortak stok havuzu, SKU/barkod ile güvenilir varyant eşleştirme, olay tabanlı hızlı güncelleme ve kullanıcı seçimine göre saatlik/3 saatlik periyodik mutabakat. Pazaryeri siparişleri de aynı stok havuzuna işlenir; sipariş olayları idempotent olmalıdır.

## Güvenilirlik kuralları

- Ürün kodu/SKU benzersiz olmalı.
- Ürün oluşturma işlemi idempotency anahtarıyla korunmalı; tekrar deneme kopya ürün oluşturmamalı.
- Büyük görsel yüklemeleri arka plan işi ve ilerleme durumu ile yönetilmeli.
- Shopify rate limit ve GraphQL userErrors ele alınmalı.
- Shopify ürün/variant güncellemeleri webhook ile izlenmeli.
- Pazaryeri eşleştirmeleri Product GID + Variant GID üzerinden yapılmalı.
