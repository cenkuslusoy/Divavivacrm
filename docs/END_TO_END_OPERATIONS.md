# DivaViva uçtan uca operasyon otomasyonu

## Ürün ve sipariş operasyonunun hedefi

DivaViva, ürünün satın alınmasından müşteriye teslim edilmesine ve faturanın kesilmesine kadar olan iş akışını tek merkezden yönetir. İnsan; tedarik, fiziksel ürün kontrolü, fotoğraf çekimi ve fiyatlandırma gibi muhakeme/gerçek dünya gerektiren adımlarda kalır. Tekrarlayan veri girişi, kanal yayını, sipariş aktarımı, kargo, takip ve faturalama mümkün olduğunca otomatik yürütülür.

Temel prensip: Bir veri bir kez girilir; onaylanan ürün ve sipariş verisi bağlı kanallara güvenli şekilde dağıtılır. Her otomasyon adımı izlenebilir, tekrar çalıştırılabilir ve hata verdiğinde kullanıcı müdahalesine açık olmalıdır.

## Uçtan uca süreç

### 1. Ürün tedariki — insan
- Damla ürünü satın alır.
- Tedarikçi, alış maliyeti, alış tarihi, adet ve varsa belge/fiş bilgisi kaydedilir.
- Ürün fiziksel olarak teslim alınır ve adet/kalite kontrolü yapılır.
- Sistem ürün için benzersiz iç ürün kaydı veya SKU önerir.

### 2. Fotoğraf çekimi ve ürün içeriği — insan + AI
- Damla ürün fotoğraflarını çeker ve toplu yükler.
- Sistem fotoğrafları olası ürün ve renk varyantlarına göre gruplar; Damla onaylar.
- AI ürün adı, açıklama, kategori, materyal/renk alanları, SEO metni, Instagram caption ve hashtag önerir.
- Doğrulanamayan özellikler gerçekmiş gibi yazılmaz.
- Damla fotoğrafları seçer, sıralar ve ürün içeriğini onaylar.

### 3. Fiyatlandırma — insan kararı + sistem hesabı
- Damla alış maliyeti, hedef kâr, komisyon, kargo/paketleme ve vergi etkilerini değerlendirerek fiyatı belirler.
- Sistem Shopify, Trendyol ve Hepsiburada için ayrı fiyat önerileri ve beklenen net kâr/marj hesabı sunar.
- Damla fiyatları onaylar; onaylanan fiyatlar kanallara gönderilir.
- Fiyat değişiklikleri ve onay geçmişi kaydedilir.

### 4. Ürün yayınlama — otomasyon + onay kuralları
- Onaylı ürün Shopify kataloğuna ve Shopify medya alanına kaydedilir.
- Shopify web mağazasında yayın durumu kullanıcı kuralına göre taslak veya aktif olur.
- Trendyol ve Hepsiburada ilanları ilgili kanal adaptörleriyle oluşturulur/güncellenir.
- İlk kurulumda yeni pazaryeri ilanları yayın öncesi onay bekler; kullanıcı daha sonra otomatik yayın kuralı açabilir.
- SKU/barkod eşleştirmesi yapılır; belirsiz eşleşme insan onayı bekler.

### 5. Sosyal medya — AI taslak + takvim + otomatik yayın
- Ürün yayına hazır olduğunda sosyal medya içerik taslağı hazırlanır.
- Ürün fotoğraflarından tek görsel/carousel, caption ve hashtag önerileri oluşturulur.
- İçerik Instagram takvimindeki uygun slota yerleştirilir.
- İlk aşamada Damla onaylar; otomatik yayın modu ayrıca etkinleştirilebilir.
- Yayın sonucu ve bağlantısı ürün kaydına bağlanır.

### 6. Sipariş alma — otomasyon
- Shopify, Trendyol ve Hepsiburada siparişleri entegrasyonlarla alınır.
- Sipariş ve sipariş kalemleri tek bir merkezî sipariş kaydına dönüştürülür.
- Harici kanal sipariş ID'si ile tekilleştirme yapılır; aynı sipariş ikinci kez işlenmez.
- Ortak stok havuzundan stok yalnızca bir kez düşürülür; diğer kanallara yeni mutlak stok miktarı gönderilir.
- Ödeme, teslimat adresi, müşteri bilgisi ve sipariş durumu kanal kurallarına göre doğrulanır.
- İptal, kısmi iptal ve iade ayrı durumlar olarak ele alınır; iade ürünü fiziksel kontrol edilmeden satılabilir stoğa eklenmez.

### 7. Kargo hazırlığı ve etiket — otomasyon + insan kontrolü
- Ödenmiş ve gönderime uygun siparişler kargo kuyruğuna alınır.
- Kargo firması, servis ve paket bilgileri kurala göre seçilir.
- Entegrasyon destekliyorsa kargo gönderisi oluşturulur ve etiket/barkod çıktısı hazırlanır.
- Paketleme ve fiziksel ürün eşleştirmesi Damla veya depo görevlisi tarafından yapılır.
- Kargo etiketi basılır; paket hazırlandı olarak işaretlenir.
- Kargo API'si/entegrasyonu başarısızsa manuel işlem kuyruğu açılır.

### 8. Kargo takip ve mağaza güncelleme — otomasyon
- Kargo firması takip numarası ve takip URL'si sipariş kaydına yazılır.
- Shopify siparişine fulfillment/tracking bilgisi gönderilir; müşteri bildirimi Shopify/kanal yeteneklerine göre tetiklenir.
- Trendyol ve Hepsiburada siparişleri ilgili API üzerinden kargolandı olarak güncellenir.
- Takip durumları webhook veya periyodik sorguyla izlenir.
- Teslimat, gecikme, başarısız teslimat ve iade hareketleri operasyon ekranında görünür.

### 9. Fatura — Paraşüt entegrasyonu + istisna kontrolü
- Gönderime/kanal iş kuralına uygun aşamaya gelen sipariş için Paraşüt'e müşteri ve satış bilgisi aktarılır.
- Uygun e-Arşiv/e-Fatura türü, mükellef bilgisi ve belge senaryosu Paraşüt ve mali müşavir kurallarına göre belirlenir.
- Fatura numarası, UUID, PDF bağlantısı ve durum DivaViva siparişine kaydedilir.
- Mükerrer fatura önlemek için sipariş başına idempotency/harici belge referansı kullanılır.
- Vergi/müşteri bilgisi eksikliği, iptal/iade veya API hatası durumunda otomatik kesim durur ve insan kontrolüne düşer.
- Fatura kesme zamanı ve iptal/iade prosedürü mali müşavirle doğrulanmadan otomatikleştirilmez.

## İnsan ve otomasyon sınırı

| İş | Varsayılan sorumlu |
|---|---|
| Ürün satın alma ve tedarikçi seçimi | İnsan |
| Fiziksel ürün/adet/kalite kontrolü | İnsan |
| Fotoğraf çekimi | İnsan |
| Fotoğraf gruplama ve içerik önerisi | AI önerir, insan onaylar |
| Fiyat ve kâr hedefi | İnsan karar verir, sistem hesaplar |
| Shopify/pazaryeri ürün girişi | Otomasyon |
| Sosyal medya metni ve takvim | AI + otomasyon, başlangıçta onay |
| Sipariş toplama ve tekilleştirme | Otomasyon |
| Ortak stok güncelleme | Otomasyon |
| Paketleme ve fiziksel kontrol | İnsan |
| Kargo etiketi ve takip numarası | Otomasyon |
| Kanal/site kargo durumunu güncelleme | Otomasyon |
| Paraşüt'e fatura verisi aktarma | Otomasyon |
| Fatura kesimi | Entegrasyon ve mali kural onayından sonra otomasyon; istisnalar insan |

## DivaViva ana operasyon ekranı

Tek bir iş kuyruğu, Damla'ya yalnızca müdahale gereken işleri göstermelidir:

- Ürün fotoğrafı/özellik/fiyat onayı bekleyenler.
- Yayına alınmayı bekleyen ürünler.
- Sosyal medya onayı bekleyen içerikler.
- Ödeme veya adres doğrulaması gereken siparişler.
- Paketlenecek siparişler ve basılacak kargo etiketleri.
- Kargo API hataları veya takip numarası eksikleri.
- Fatura bilgisi eksik veya Paraşüt aktarımı başarısız siparişler.
- İade, iptal, teslimat sorunu ve stok uyuşmazlığı.

Normal ve başarılı otomatik işlemler bildirim kalabalığı oluşturmamalı; yalnızca günlük özet ve istisnalar gösterilmelidir.

## Temel sistem mimarisi

- Shopify: ürün kataloğu, varyant/SKU, web mağazası ve ana stok kaynağı.
- DivaViva operasyon veritabanı: tedarik maliyeti, süreç durumları, onaylar, kanal eşleştirmeleri, sipariş birleştirme, görev kuyruğu ve denetim geçmişi.
- Kanal adaptörleri: Trendyol ve Hepsiburada ürün, sipariş, stok ve kargo işlemleri.
- Sosyal medya adaptörü: Meta Instagram Graph API.
- Kargo adaptörleri: seçilen taşıyıcıların gönderi/etiket/takip API'leri.
- Muhasebe adaptörü: Paraşüt API.
- Worker/queue: zamanlanmış görevler, webhook işleme, tekrar deneme ve mutabakat.
- Her dış sistem çağrısı için idempotency, log, hata kuyruğu ve manuel yeniden deneme.

Entegrasyonların gerçek API kapsamı, kimlik doğrulaması, sözleşme/hesap yetkileri ve ücretleri geliştirme aşamasında resmî belgelerle doğrulanır. Hiçbir entegrasyon canlı hesapta denenip doğrulanmadan çalışıyor kabul edilmez.

## Uygulama fazları

1. Shopify ürün ve varyant akışını güvenli embedded app'e taşıma.
2. Operasyon veritabanı ve ürün hazırlama/onay kuyruğu.
3. Trendyol/Hepsiburada katalog ve sipariş entegrasyonları.
4. Ortak stok motoru ve sipariş tekilleştirme.
5. Kargo firması seçimi, etiket ve takip otomasyonu.
6. Paraşüt müşteri/fatura entegrasyonu ve mali müşavir onayı.
7. Instagram içerik takvimi ve otomatik yayın.
8. Uçtan uca hata yönetimi, raporlama ve otomasyon kuralları.

Bu belge hedef iş akışını tanımlar; entegrasyonların kodlandığı veya canlı sistemde test edildiği anlamına gelmez.
