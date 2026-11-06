# Instagram içerik planlama ve otomatik yayınlama modülü

## Amaç

DivaViva Studio içinde Shopify ürün kataloğuna bağlı bir Instagram yayın takvimi bulunur. Yeni ürün Shopify'a eklendiğinde uygulama ürünün görsellerini ve onaylanmış ürün bilgilerini kullanarak paylaşım taslağı oluşturabilir; taslak uygun yayın slotuna yerleştirilir ve kullanıcı ayarına göre onaydan sonra veya otomatik olarak yayınlanır.

Bu modül Instagram'a şifreyle giriş yapan tarayıcı otomasyonu kullanmaz. Yalnızca Meta'nın resmi Instagram Platform / Graph API içerik yayınlama akışı kullanılır.

## Platform ve hesap koşulları

- Yayınlama için Instagram Professional hesabı gerekir: Business veya Creator. Kişisel hesap desteklenmez.
- Meta Developer App oluşturulur ve Instagram yayınlama izni yapılandırılır.
- Kullanıcı hesabı OAuth üzerinden bağlanır; Instagram şifresi DivaViva'da istenmez veya saklanmaz.
- Kendi işletme hesabımızla başlangıçta test edilir. Başka işletmelere açılacaksa gerekli Meta App Review / Advanced Access ve ilgili izin onayları tamamlanır.
- Facebook Login yaklaşımı seçilirse Instagram Professional hesabının bir Facebook Page ile bağlı olması gerekir. Uygulama kurulumunda Meta'nın güncel login akışına göre karar verilir.
- Token'lar şifreli saklanır; süre/izin kontrolü yapılır, iptal edilen veya süresi dolan bağlantı yayınlamayı durdurur.

## Ürün eklenince otomatik akış

1. Shopify'da yeni ürün/varyant oluşturulur veya ürün taslağı yayınlamaya uygun hale gelir.
2. Shopify webhook olayı uygulamaya ulaşır; periyodik katalog kontrolü kaçan olayları tamamlar.
3. Kural motoru ürünün Instagram içeriği gerektirip gerektirmediğini kontrol eder (ürün durumu, stok, kategori, daha önce paylaşılmış olması, kampanya vb.).
4. AI ürün başlığı, açıklaması ve görsellerinden caption, hashtag önerileri ve görsel sıralaması üretir. Bilinmeyen ürün özellikleri uydurulmaz.
5. İçerik taslağı takvimde sıradaki uygun slota atanır. Aynı ürünün aynı içerik tipinde tekrar tekrar kuyruğa alınması idempotency anahtarıyla engellenir.
6. Varsayılan ilk kurulum: kullanıcı onayı beklenir. Kullanıcı otomatik yayınlamayı ayrıca açarsa onaylanmış kurallara uyan içerikler doğrudan sıraya girer.
7. Yayın zamanı geldiğinde worker içeriği Meta API üzerinden yayınlar ve sonucu kaydeder.
8. Başarılı/başarısız durum, Instagram medya ID'si, yayın zamanı ve hata ayrıntısı takvimde görünür.

## Takvim ve otomasyon ayarları

- Haftanın günleri ve saat bazlı yayın slotları.
- Saat dilimi: mağaza için varsayılan Europe/Istanbul; kullanıcı değiştirebilir.
- Günlük/haftalık maksimum paylaşım adedi.
- Ürün başına paylaşım sıklığı ve tekrar paylaşım bekleme süresi.
- Ürün kategorisi, stok durumu, koleksiyon, sezon/kampanya ve yeni ürün etiketine göre kurallar.
- Yeni ürünler için: otomatik taslak oluştur, sıradaki boş slota koy, onay iste / otomatik yayınla seçenekleri.
- Takvimden sürükle-bırak ile tarih/saat değiştirme; taslağı düzenleme, erteleme, iptal etme.
- Tatil/kapalı günler ve belirli tarih aralıklarında paylaşımı duraklatma.
- Kullanıcı takvimde yayın sırasını ve aynı gün paylaşım yoğunluğunu görebilir.

## İçerik türleri ve kapsam

### İlk sürüm
- Tek görselli feed gönderisi.
- Çoklu görselli carousel gönderisi.
- Caption, hashtag ve erişilebilirlik için alt text taslağı.
- Yayın öncesi önizleme ve onay.
- Başarılı yayın sonrası Instagram gönderi bağlantısı / medya ID'si kaydı.

### Sonraki faz
- Reels video gönderileri ve video işleme durumu.
- Story yayınlama, Meta'nın güncel hesap/izin ve içerik kısıtları doğrulandıktan sonra.
- İçerik performansı/insights verilerinin takvim kartına eklenmesi.
- Kampanya bazlı içerik serileri ve tekrar kullanım.

İlk sürümde Instagram Shopping ürün etiketleri, müzik, filtreler, etkileşim otomasyonu veya DM gönderimi vaat edilmez; bunlar ayrı API yetenekleri ve izinleri gerektirir.

## Teknik yayınlama akışı

- Meta'nın içerik yayınlama API'si zamanlama motoru değildir. Zamanlama DivaViva'nın kendi job queue/worker altyapısında tutulur.
- Yayın anında uygulama önce media container oluşturur (/{ig-user-id}/media), işlenme durumunu kontrol eder ve hazır olduğunda /{ig-user-id}/media_publish çağrısını yapar.
- Meta'nın medya dosyasını alabilmesi için görsel/video URL'si yayın anında internetten erişilebilir olmalıdır. Shopify CDN medyası uygunsa kullanılır; değilse kontrollü medya sunum katmanı gerekir. Yerel dosya yolu veya oturum gerektiren URL kullanılamaz.
- Yayın öncesi dosya türü, boyut, oran, video codec/süre ve API limitleri Meta'nın güncel belgelerine göre doğrulanır.
- Container hazırlama/yayınlama durumları izlenir; video işlenmesi sürerken erken yayın çağrısı yapılmaz.
- Her içerik için tekil job/idempotency anahtarı tutulur. Timeout sonrası körlemesine yeniden yayın yapılmaz; önce Meta'daki container/yayın durumu sorgulanır.
- Hata durumlarında artan bekleme aralığıyla yeniden deneme, maksimum deneme sayısı ve kullanıcıya görünür hata kuyruğu bulunur.
- Yayın limitleri ve izinler Meta API'den kontrol edilir; sistem sabit limit varsayımına güvenmez.
- Uygulama sunucu tarafında güvenilir zamanlayıcı/worker gerektirir. Sadece açık tarayıcı sekmesine veya kullanıcının telefonuna bağlı çalışmaz.

## Operasyonel veri modeli (uygulama veritabanı)

- instagram_connections: shop ID, Instagram account ID, bağlantı durumu, token şifreli referansı, izinler, token son kullanma/yenileme durumu.
- publishing_rules: günler, saatler, timezone, içerik türü, kategori/koleksiyon koşulları, onay modu, günlük limit.
- social_posts: Shopify product/variant GID, medya referansları, caption, hashtagler, alt text, içerik türü, durum, planlanan zaman, yayınlanan zaman, Instagram media ID/permalink.
- publishing_jobs: post ID, deneme sayısı, next run, lock, idempotency key, hata kodu/mesajı.
- publishing_events: oluşturuldu, onaylandı, ertelendi, yayın denendi, yayınlandı, başarısız, iptal edildi olay geçmişi.

Shopify ürün ve medya kataloğunun ana kaynağı olmaya devam eder. Instagram takvimi ve yayın geçmişi DivaViva operasyonel veritabanında tutulur.

## Ekranlar

- Ana menü: Instagram Takvimi.
- Hesap bağlantısı: Instagram hesabı, bağlantı durumu ve izinler.
- Takvim: hafta/ay görünümü, taslak/planlandı/yayınlandı/hata durumları.
- İçerik editörü: ürün seçimi, görsel sıralama, caption, hashtag, alt text, önizleme.
- Otomasyon kuralları: yeni ürün tetikleyicisi, kategori/stok filtresi, yayın slotları, onay modu.
- Yayın geçmişi ve hata kuyruğu: yeniden dene, düzenle, iptal et.

## Kabul kriterleri

- [ ] Instagram Professional hesabı OAuth ile güvenli bağlanır.
- [ ] Hesap bağlantısı/izin/token durumu ekranda görünür.
- [ ] Kullanıcı haftalık yayın saatlerini ve timezone'u belirler.
- [ ] Yeni Shopify ürünü için bir içerik taslağı otomatik oluşturulur.
- [ ] Ürün aynı kuralla ikinci kez kuyruğa eklenmez.
- [ ] Kullanıcı görseli, caption'ı ve yayın zamanını düzenleyebilir.
- [ ] Onay modu açıkken onaysız içerik yayınlanmaz.
- [ ] Zamanı gelen içerik worker tarafından resmi Meta API üzerinden yayınlanır.
- [ ] Yayın sonucu ve hata durumu takvimde görünür.
- [ ] Uygulama kapalıyken de planlı yayınlar çalışır.
- [ ] Token iptali, API limitleri ve geçici hatalar güvenli biçimde yönetilir.

## Fazlandırma

1. Meta Developer App, OAuth bağlantısı ve hesap doğrulama.
2. Tek görsel/carousel için manuel taslak + hemen yayınla.
3. Takvim, worker/queue ve planlı yayın.
4. Shopify ürün webhook'u ile otomatik taslak üretme.
5. AI caption/hashtag önerileri ve otomasyon kuralları.
6. Reels, Story ve insights geliştirmeleri.

## Resmi referanslar

- Meta Instagram Content Publishing: https://developers.facebook.com/docs/instagram-platform/content-publishing
- Meta Instagram Platform: https://developers.facebook.com/docs/instagram-platform/
