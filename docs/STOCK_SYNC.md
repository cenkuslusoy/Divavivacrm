# Otomatik stok ve pazaryeri senkronizasyonu

## Amaç

Shopify web sitesi, Trendyol ve Hepsiburada'da satılan aynı ürün/varyantın stokları tek merkezden yönetilsin. Yeni Shopify ürünleri SKU/barkod üzerinden kanallardaki kayıtlarla otomatik eşleştirilsin; stok ve eşleşme durumu panelde görülsün.

## Önerilen mimari: Shopify merkez + olay tabanlı + zamanlanmış kontrol

Shopify ana stok kaynağı (source of truth) olur. Ancak yalnızca saatlik cron yeterli değildir: bir ürün farklı kanallarda aynı anda satılabilir. Bu yüzden iki katman birlikte çalışır:

1. **Olay tabanlı hızlı senkronizasyon:** Shopify siparişi/stok değişikliği webhook'ları ve pazaryerlerinin sipariş/stok bildirimleri geldikçe kuyruk işi başlatılır.
2. **Zamanlanmış mutabakat (reconciliation):** Her kanal için seçilen periyotta tüm aktif eşleşmeler tekrar okunur, farklar düzeltilir.

Pazaryeri API'leri webhook sağlamıyorsa veya kısıtlıysa siparişler ve stoklar planlı sorguyla kontrol edilir. Gerçek zamanlıya yakın davranış hedeflenir; API gecikmesi veya limitleri nedeniyle mutlak anlık senkronizasyon garantisi verilmez.

## Otomatik ürün eşleştirme

Öncelik sırası:
1. Varyant SKU (benzersiz ve her kanalda aynı)
2. GTIN / barkod (varsa)
3. Önceden onaylanmış manuel eşleştirme

Ürün adı, fotoğraf benzerliği veya yaklaşık metin tek başına otomatik stok eşleştirmesi için yeterli değildir. Birden fazla olası eşleşme varsa sistem otomatik bağlamaz; kullanıcı onayı ister.

Yeni Shopify ürünü/varyantı oluştuğunda:
- SKU ve barkod kontrol edilir.
- Daha önce kanal kaydı varsa otomatik eşleştirilir.
- Yoksa kanal kategori/özellik zorunlulukları kontrol edilir ve "yayına hazırlık" kaydı açılır.
- Pazaryerinde yeni ilan açılması, mağaza ayarındaki "onaylı ürünleri otomatik yayınla" seçeneğine bağlıdır. Varsayılan güvenli davranış: ilk kurulumda otomatik yayın kapalı, kullanıcı onayı açık.
- Ürün ilanı açıldıktan sonra pazaryeri ürün ve varyant ID'leri saklanır; stok senkronizasyonu otomatik başlar.

## Ortak stok havuzu ve güvenlik stoğu

**Karar: Ortak fiziksel stok havuzu kullanılacak.** Web, Trendyol ve Hepsiburada aynı fiziksel stoktan satış yapar; kanallara birbirinden bağımsız stok kopyaları tahsis edilmez. Her varyant için Shopify'daki kullanılabilir stok merkezi miktar kabul edilir. Pazaryeri siparişi geldiğinde bu sipariş Shopify merkez stoğuna bir kez işlenir; ardından yeni toplam kullanılabilir miktar tüm kanallara mutlak hedef değer olarak gönderilir.

Her kanal için opsiyonel güvenlik stoğu tanımlanabilir. İlk kurulumda güvenlik stoğu 0 olarak başlar; kullanıcı kanal bazında tampon miktarı belirleyebilir. Güvenlik stoğu fiziksel stoktan ayrı bir satış tahsisidir ve ortak havuzdan düşülerek kanala gönderilecek miktarı belirler. Örnek:
- Fiziksel/Shopify kullanılabilir stok: 20
- Trendyol güvenlik stoğu: 1
- Hepsiburada güvenlik stoğu: 1
- Kanala gönderilecek satışa açık miktar: 18

Bu örnek yalnızca açıklamadır; gerçek stok miktarları kullanıcı ayarından gelir. Güvenlik stoğu, API gecikmesi veya eşzamanlı satışlarda fazla satış riskini azaltır; tamamen ortadan kaldırmaz.

Kanal bazlı ayrı stok havuzları istenirse ileride desteklenebilir; ilk sürümde ortak havuz daha basit ve tutarlıdır.

## Sipariş geldiğinde stok akışı

1. Kanal sipariş olayı veya planlı sipariş sorgusu alınır.
2. Sipariş/kalem, kanal ürün-varyant eşleştirmesiyle Shopify Variant/InventoryItem kaydına bağlanır.
3. Sipariş olayı benzersiz kanal sipariş ID'si ve kalem ID'siyle idempotent işlenir; aynı sipariş tekrar gelirse ikinci kez stok düşülmez.
4. Shopify stok seviyesi merkezi kaynaktan güncellenir.
5. Yeni kullanılabilir miktar diğer satış kanallarına gönderilir.
6. İptal/iade durumları ayrı kuralla işlenir; iade fiziksel olarak satılabilir duruma dönmeden otomatik stok eklenmez. İade/iptal politikası kanal ve sipariş durumuna göre doğrulanır.

Shopify siparişleri için Shopify'ın kendi inventory/fulfillment akışı esas alınır. Pazaryeri siparişlerinin Shopify'a aktarımında çift stok düşümüne yol açmayacak bir işleme modeli seçilir ve test edilir.

## Senkronizasyon zamanlaması

Uygulama ayarlarından kanal başına periyot seçilir:
- 15 dakika
- 30 dakika
- 1 saat
- 3 saat
- 6 saat
- Günde 1 kez

Önerilen ilk ayar: webhook destekleyen olaylarda anlık işleme + saatlik tam mutabakat. API kotaları ve mağaza hacmi doğrulandıktan sonra 3 saatlik veya farklı periyot seçilebilir. Kullanıcı isterse saatlik/3 saatlik kontrolü kanal bazında ayrı seçebilir.

Her zamanlanmış çalışma:
- Aktif eşleşmeleri sayar ve sayfalı işler.
- Son başarılı çalışma, başlangıç/bitiş, güncellenen SKU sayısı, hata ve atlanan kayıt sayısını raporlar.
- Rate limit yanıtlarında bekleyip yeniden dener.
- Geçici hatalarda artan aralıklarla tekrar dener.
- Tekrar denemelerde stok miktarını iki kez değiştirmek yerine hedef mutlak miktarı yazar.
- Başarısız SKU'ları ayrı hata kuyruğuna alır; tüm senkronizasyonu durdurmaz.

## Döngü ve çakışma önleme

- Her değişiklikte source/channel, event ID, SKU, inventory item, miktar ve zaman damgası kaydedilir.
- Uygulamanın yaptığı güncellemenin tekrar webhook üretmesi halinde aynı event/işlem tekrar uygulanmaz.
- "Stok +1/-1" gibi göreli değişiklik yerine, doğrulanmış kullanılabilir stok miktarı hedef değer olarak kanallara yazılır.
- Aynı SKU için eşzamanlı işler kilitlenir veya sıralı işlenir.
- Kanal stokları ile Shopify stokları uyuşmazsa Shopify ana kaynak kabul edilir; fakat şüpheli büyük farkta otomatik düzeltme yerine uyarı ve inceleme seçeneği sunulur.

## Yönetim paneli

"Stok ve kanal senkronizasyonu" ekranında:
- SKU / barkod / ürün adı / varyant
- Shopify, Trendyol, Hepsiburada stok miktarları
- Eşleşme durumu ve kanal ilan ID'leri
- Son senkronizasyon zamanı
- Bir sonraki planlı mutabakat zamanı
- Kanal başına çalışma periyodu
- Güvenlik stoğu
- Hata/yeniden dene ve manuel senkronize et
- Toplu eşleştirme ve eşleşme onayı

Genel bakışta son senkronizasyon sağlığı ve bekleyen hata sayısı gösterilir.

## Güvenlik ve sınırlar

- Her kanalın resmi API ve mağaza yetkilendirmesi kullanılmalıdır; tarayıcı otomasyonu veya izinsiz yöntem kullanılmaz.
- Trendyol ve Hepsiburada API yetkileri, sipariş/stok uçları, webhook desteği ve limitleri entegrasyon yapılırken güncel dokümandan doğrulanır.
- İlk aşamada yalnızca test ürünleriyle düşük miktarlı doğrulama yapılır.
- Stok miktarı hiçbir zaman ürün adı benzerliğine göre başka SKU'ya yazılmaz.
- Kanal API'si kesilirse son bilinen miktar ve son başarılı senkronizasyon görünür; sessizce başarılı gibi gösterilmez.

## Uygulama fazları

1. Shopify inventory seviyelerini ve varyant SKU/barcode alanlarını okuma/yazma.
2. Shopify ürün/stok webhook'ları ve kalıcı iş kuyruğu.
3. Kanal bağlantı ekranı, SKU/barcode eşleştirme ve manuel onay.
4. Trendyol sipariş + stok API adaptörü.
5. Hepsiburada sipariş + stok API adaptörü.
6. Saatlik/3 saatlik zamanlayıcı, mutabakat raporu, hata kuyruğu.
7. Kontrollü otomatik ürün ilanı açma ve tam stok senkronizasyonu.
