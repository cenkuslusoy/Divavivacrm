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

## Instagram içerik takvimi

- Ana menüye Instagram Takvimi eklenir.
- Instagram Business/Creator hesabı Meta OAuth ile bağlanır; şifre istenmez.
- Yeni Shopify ürünü için AI destekli görsel/caption/hashtag taslağı oluşturulur.
- Taslak haftalık yayın takvimindeki sıradaki uygun slota yerleştirilir.
- İlk kurulumda onay zorunludur; kullanıcı ayrıca açarsa kurallara uyan içerikler otomatik yayınlanabilir.
- Kullanıcı hafta/gün/saat, saat dilimi, günlük paylaşım limiti, kategori/stok filtreleri ve tekrar paylaşım aralığını belirler.
- İlk sürüm tek görsel ve carousel feed gönderilerini kapsar; Reels/Story sonraki fazdır.
- Planlı yayın, uygulamanın sunucu tarafındaki queue/worker sistemiyle yapılır; tarayıcı veya telefon açık kalmak zorunda değildir.
- Yayınlama resmi Meta API üzerinden yapılır; API zamanlama yapmadığı için yayın saatini DivaViva yönetir.
- Takvimde taslak, onay bekliyor, planlandı, yayınlanıyor, yayınlandı ve hata durumları görünür.
- Ayrıntılı teknik kapsam ve kabul kriterleri docs/INSTAGRAM_PUBLISHING.md dosyasındadır.


## Otomatik kargo ve ürün etiketi baskısı

- Sipariş geldiğinde pazaryerinin/taşıyıcının oluşturduğu orijinal kargo etiketi baskı kuyruğuna alınır.
- Ürün adı, varyant, SKU ve adet bilgilerini içeren ayrı ürün etiketi hazırlanır.
- İki etiket aynı yazıcıdan art arda otomatik basılabilir; kargo barkodu hiçbir zaman ürün bilgisiyle kapatılmaz.
- Baskı kuyruğu, yazıcı durumu, hata ve yeniden baskı geçmişi gösterilir.
- Tarayıcıdan sessiz otomatik baskı için bilgisayarda yerel baskı ajanı veya desteklenen ağ yazıcısı köprüsü gerekir.
- Ayrıntılı kapsam docs/LABEL_PRINTING.md dosyasındadır.


## Günlük kargolama ve depo toplama ekranı

- Gönderime hazır tüm siparişler tek günlük kargolama panosunda toplanır.
- Sipariş bazlı görünüm ürün görseli, varyant, SKU, adet, depo raf/kutu adresi ve toplama durumunu gösterir.
- Toplu toplama görünümü aynı SKU/varyant miktarlarını birleştirir ve depo lokasyonuna göre rota sıralaması yapar.
- Personel barkod okutarak doğru ürün ve miktarı doğrular; eksik/yanlış ürün uyarısı alır.
- Toplanan ürünler sipariş bazında ayrıştırılır, paketlenir ve etiket baskı kuyruğuna geçer.
- Depo adresleme hiyerarşisi depo/alan/raf/bölme/kutu şeklindedir.
- İleri fazda kutu adresine bağlı LED, toplama sırası geldiğinde yanar; ürün alınıp onaylanınca söner.
- LED bağlantısı kesilse bile dijital toplama listesi çalışmayı sürdürür.
- Ayrıntılı kapsam docs/WAREHOUSE_PICKING.md dosyasındadır.
