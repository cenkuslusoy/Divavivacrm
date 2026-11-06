# DivaViva Studio ekran ve teslimat planı

## Embedded uygulama menüsü

Shopify Admin içinde ana menü:

1. Genel bakış
2. Fotoğraf yükle
3. Ürün taslakları
4. Ürün kataloğu
5. Stok ve fiyatlar
6. Kanal bağlantıları
7. Stok senkronizasyonu\n8. Ayarlar

İlk sürümde 1–4 tamamlanır. Kanal bağlantıları ekranı Trendyol/Hepsiburada entegrasyonları gelene kadar bağlantı durumunu gösterir.

## Fotoğraftan ürüne iş akışı

### A. Toplu yükleme
- Çoklu dosya seçimi ve sürükle-bırak.
- Yükleme önizlemesi, dosya boyutu/tür kontrolü.
- Fotoğraflar ürünlere kullanıcı tarafından gruplanır.
- AI gruplama önerisi sunabilir; kullanıcı onaylamadan kayıt oluşturulmaz.
- Bir ürüne birden fazla fotoğraf, aynı ürünün farklı renklerine ait fotoğraflar ise ilgili varyantlara bağlanır.

### B. Ürün bilgisi
- Ürün adı, ürün kodu/SKU, kategori, açıklama, malzeme, renk ve diğer seçenekler.
- AI alanları öneri olarak doldurur; doğrulanamayan malzeme/ölçü bilgisi kesinmiş gibi yazılmaz.
- SEO başlığı ve meta açıklaması.
- Varyant başına SKU, fiyat ve stok.

### C. Kanal fiyatları
- Shopify web fiyatı ana fiyat.
- Trendyol ve Hepsiburada fiyatları kanal bazında ayrı saklanır.
- Kullanıcı tek tek veya toplu fiyat girişi yapabilir.
- Kanal bağlantısı kurulmadan hiçbir pazaryerine gönderim yapılmaz.

### D. Shopify'a kaydetme
- Ürün ve medya kayıtları Shopify'a yüklenir.
- Ürün varsayılan olarak DRAFT kalır.
- Sonuçta Shopify Admin ürün sayfasına giden bağlantı gösterilir.
- Kısmi hata varsa hangi görsel/ürün/varyantın başarısız olduğu ayrı gösterilir; yeniden deneme kopya ürün üretmez.

## İlk sürüm kabul kriterleri

- [ ] Uygulama Shopify Admin içinden açılıyor.
- [ ] Kullanıcı oturumu her yönetim route'unda doğrulanıyor.
- [ ] En az 10 fotoğraf bir oturumda yüklenebiliyor.
- [ ] Kullanıcı fotoğrafları bir veya birden fazla ürüne ayırabiliyor.
- [ ] Ürün adı, açıklama, SKU, kategori ve fiyat düzenlenebiliyor.
- [ ] Renk varyantları ve varyant SKU'ları oluşturulabiliyor.
- [ ] Görseller Shopify medya alanına kaydediliyor.
- [ ] Ürün Shopify'da taslak olarak oluşturuluyor.
- [ ] Shopify Admin'de aç bağlantısı çalışıyor.
- [ ] Tekrarlanan istek aynı işlem için kopya ürün oluşturmuyor.
- [ ] Başarılı ve başarısız kayıtlar kullanıcıya açıkça gösteriliyor.

## Otomatik stok ve kanal senkronizasyonu

- Yeni ürün/varyant SKU veya barkodla otomatik eşleştirme kontrolünden geçer.
- Güvenilir tekil eşleşme otomatik bağlanır; belirsiz eşleşme kullanıcı onayı bekler.
- Ortak stok havuzu Shopify inventory üzerinden yönetilir.
- Shopify ve pazaryeri siparişleri tekilleştirilerek işlenir; çift stok düşümü engellenir.
- Webhook/olay desteği olan kanallarda hızlı senkronizasyon, ayrıca saatlik/3 saatlik gibi seçilebilir periyotta mutabakat çalışır.
- Kanal başına güvenlik stoğu, son başarılı çalışma, hata sayısı ve manuel yeniden deneme görünür.
- Yeni ilanı otomatik açma ilk kurulumda kapalı olur; kullanıcı onayıyla açılır.

## Sonraki fazlar

1. AI görsel gruplama, ürün niteliği ve SEO önerileri.
2. Toplu stok güncelleme ve Shopify webhook dinleme.
3. Trendyol ürün/varyant eşleştirme ve kanal fiyatı.
4. Hepsiburada ürün/varyant eşleştirme ve kanal fiyatı.
5. Sipariş/stok senkronizasyonu, hata kuyruğu ve operasyon raporu.
