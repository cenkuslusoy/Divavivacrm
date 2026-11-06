# AI sağlayıcıları, görev yönlendirme ve maliyet optimizasyonu

## Amaç

DivaViva tek bir AI sağlayıcısına veya modele bağımlı olmayacaktır. Gemini, OpenAI ve Canva gibi servisler ortak bir sağlayıcı katmanı arkasından kullanılır. Yeni sağlayıcı eklemek veya varsayılan modeli değiştirmek ürün, sipariş, Instagram ya da depo modüllerinin kodunu değiştirmeyi gerektirmemelidir.

Bu doküman hedef mimariyi tanımlar; API bağlantılarının kurulduğu veya fiyatların canlı olarak ölçüldüğü anlamına gelmez.

## 1. Sağlayıcı katmanı

Uygulama modülleri doğrudan Gemini/OpenAI SDK çağırmaz. Ortak görev arayüzü kullanır:

- text.generate: ürün adı, açıklama, SEO, caption, hashtag, çeviri.
- vision.analyze: ürün fotoğrafı tanıma, renk/varyant önerisi, kalite kontrol.
- image.generate: reklam/lifestyle/konsept görseli.
- image.edit: arka plan/ışık/kompozisyon düzenleme, ürün fotoğrafı üzerinde kontrollü değişiklik.
- image.remove_background: arka plan kaldırma.
- design.autofill: Canva marka şablonunu ürün verisiyle doldurma.
- embedding.match: benzer ürün veya içerik eşleştirme (gerektiğinde).

Her sağlayıcı adapter'ı ortak giriş/çıkış şemasını uygular. Örnek sağlayıcılar:
- Google Gemini API.
- OpenAI API.
- Canva Connect / Autofill API.
- İleride eklenebilecek diğer sağlayıcılar.

Bir görev için birincil model, yedek model ve kalite/maliyet profili ayarlanabilir. Sağlayıcı arızası veya kota sorunu olduğunda fallback kullanılabilir; ancak maliyet üst sınırı ve görev uyumluluğu kontrol edilir.

## 2. Görev bazlı model yönlendirme

İlk varsayılan yönlendirme:

| Görev | Varsayılan strateji | Yedek/kalite yükseltme |
|---|---|---|
| Ürün adı/açıklama/SEO | Ekonomik metin modeli | Daha güçlü metin modeli |
| Fotoğraftan ürün tanıma | Ekonomik vision modeli | Güçlü vision modeli |
| Renk/varyant gruplama | Ekonomik vision + kurallar | Güçlü model ve insan onayı |
| Caption/hashtag | Ekonomik metin modeli | Marka tonu için güçlü model |
| Arka plan kaldırma | Özel image transformation servisi | Alternatif servis |
| Ürün fotoğrafı düzenleme | Ürün kimliğini koruyan edit modeli | İnsan incelemesi + alternatif model |
| Lifestyle/reklam görseli | Gemini/OpenAI image A/B testi | En iyi kalite/maliyet sonucu |
| Instagram tasarım şablonu | Canva Autofill | Uygulama içi şablon üretimi |

Yönlendirme sabit marka varsayımıyla değil, görev uyumluluğu, ölçülen kalite, gecikme, hata oranı ve gerçek maliyet ile belirlenir. Model kimlikleri ve fiyatları yapılandırılabilir olmalıdır.

## 3. Ürün görsellerinde kalite güvenliği

Ürün fotoğrafı ve reklam görseli aynı işlem değildir.

- Katalog görselinde gerçek ürünün şekli, rengi, deseni, dikişi, aksesuarı ve oranları korunmalıdır.
- AI'nın ürünü yeniden tasarlaması, yanlış renk/aksesuar eklemesi veya gerçekte olmayan özellik üretmesi engellenmelidir.
- Arka plan kaldırma, ışık düzeltme ve kırpma gibi düşük riskli işlemler önce tercih edilir.
- Lifestyle görsellerinde AI tarafından oluşturulmuş sahne kullanılabilir; gerçek ürün referans görseli olarak korunur.
- AI ile üretilmiş görsel katalog ana görseli yapılmadan önce insan onayına sunulur.
- Orijinal görsel hiçbir zaman üzerine yazılmaz; türetilmiş görsel ayrı medya varlığı olarak saklanır.

## 4. Canva entegrasyonu

Canva, her ürün fotoğrafını sıfırdan üretmek için değil, marka tasarımlarını otomatik doldurmak için kullanılır.

Örnek şablonlar:
- Yeni ürün duyurusu.
- Instagram feed carousel kapağı.
- Kampanya/indirim duyurusu.
- Story tasarımı (yayın API'si ve format desteği ayrıca doğrulanır).
- Ürün özellikleri / koleksiyon tanıtımı.

DivaViva ürün adı, fiyat, ürün fotoğrafı, kampanya metni ve marka alanlarını Canva Autofill API'ye gönderir. Asenkron iş sonucu izlenir ve tasarım dışa aktarımına alınır. Canva planı, kullanıcı yetkileri, API kredileri ve ücretleri uygulama öncesi kontrol edilir.

Canva tasarım üretimi ile Instagram yayınlama ayrı iş adımlarıdır: tasarımın oluşması, otomatik yayın izni anlamına gelmez.

## 5. AI maliyet merkezi

Her AI çağrısı için şu bilgiler kaydedilir:
- Mağaza/işletme ID'si.
- Modül ve görev türü.
- Sağlayıcı ve model ID.
- İstek zamanı ve süre.
- Input/output token veya görsel sayısı/ölçüsü.
- Sağlayıcıdan dönen kullanım bilgisi.
- Hesaplanan USD maliyeti ve kullanılan kurla yerel para karşılığı.
- İşlem sonucu, hata ve tekrar deneme sayısı.
- Üretilen varlık veya ilgili ürün/post ID'si.

Maliyet raporları:
- Günlük/haftalık/aylık toplam.
- Sağlayıcı ve model bazında.
- Modül ve görev türü bazında.
- Ürün başına AI maliyeti.
- Başarılı sonuç başına maliyet.
- Görsel başına maliyet ve tekrar üretim sayısı.
- Tahmini ay sonu harcaması.

Kullanıcı sağlayıcı faturasıyla DivaViva tahminini karşılaştırabilir. Sağlayıcı faturası esas kabul edilir; uygulama maliyet tahmininin birebir fatura tutarı olduğu iddia edilmez.

## 6. Bütçe ve koruma kuralları

- Aylık toplam bütçe.
- Sağlayıcı başına bütçe.
- Modül/görev başına limit.
- Tek ürün veya tek görsel için maksimum üretim sayısı.
- Uyarı eşikleri (ör. %50, %80, %100).
- Bütçe dolduğunda ücretli AI çağrısını durdur, onay iste veya ekonomik yedek modele geç seçenekleri.
- Tekrarlanan istekler için cache ve idempotency.
- Toplu işlerde sağlayıcı batch API varsa maliyet/latency uygunluğuna göre kullan.
- Geliştirme/test ve üretim API projeleri ayrı tutulur.
- Ücretsiz katman veya deneme kotası kalıcı üretim bütçesi gibi varsayılmaz.

Bütçe sınırı sağlayıcı tarafındaki faturalandırma/harcama sınırlarının yerine geçmez; ikisi birlikte kullanılmalıdır.

## 7. Maliyet optimizasyon stratejileri

1. Önce kurallar ve klasik görüntü işleme: AI gerekmeyen işi AI'ya yaptırma.
2. Bir görseli tekrar tekrar analiz etme; ürün görseli hash'i ve model sürümüyle sonuçları cache et.
3. Basit metin işleri için ekonomik model kullan.
4. Belirsiz veya yüksek riskli görevleri güçlü modele yükselt.
5. Görsel üretimde düşük/orta kalite önizleme, onaydan sonra yüksek kalite final kullan.
6. Canva marka şablonuyla metin/fiyat/görsel yerleşimini üret; her kampanya için sıfırdan görsel üretme.
7. Ürün fotoğrafında önce kırpma/arka plan kaldırma/renk düzeltme gibi deterministik adımları değerlendir.
8. A/B testinde aynı prompt ve referansla kalite, ürün sadakati, süre ve gerçek maliyeti ölç.
9. Başarısız istekleri sınırsız otomatik tekrar etme.
10. Aylık maliyeti ürün başına ve satış başına raporla.

## 8. Kalite kıyaslama ve model seçimi

Yönetici panelinde bir test seti oluşturulur. Aynı ürün görselleri ve görevler seçili sağlayıcılarda çalıştırılır. Sonuçlar şu ölçütlerle karşılaştırılır:
- Ürün sadakati.
- Metin doğruluğu.
- Marka dili.
- Görsel kalitesi.
- Kullanıcı onay oranı.
- Ortalama süre.
- Başarılı çıktı başına maliyet.

Kullanıcı görev bazında varsayılan modeli seçebilir veya önerilen otomatik yönlendirmeyi açabilir. Model değişikliği geçmişi tutulur.

## 9. Güvenlik ve gizlilik

- API anahtarları yalnızca sunucu tarafında şifreli secret olarak tutulur.
- Anahtarlar tarayıcıya gönderilmez ve GitHub'a commit edilmez.
- Sağlayıcıya yalnızca görev için gerekli veri gönderilir.
- Müşteri adresi, telefon, sipariş özel verisi ve ödeme verisi görsel/metin üretim promptlarına gereksiz yere eklenmez.
- Sağlayıcıların veri saklama/eğitim şartları ve bölgesel koşulları entegrasyon öncesi incelenir.
- Sağlayıcı bazında veri paylaşımını kapatma ve kullanım izni ayarları bulunur.

## 10. Yönetim ekranı

Menü: **AI Merkezi**

Sekmeler:
- Sağlayıcı bağlantıları ve API anahtarı durumu.
- Model kataloğu ve görev yönlendirme.
- Maliyet paneli.
- Aylık bütçe ve uyarılar.
- Kalite kıyaslama testleri.
- Ürün görseli üretim/düzenleme geçmişi.
- Canva marka şablonları.
- İşlem logları ve hata kuyruğu.

## 11. Kabul kriterleri

- [ ] Gemini ve OpenAI adapter'ları ortak görev arayüzünden çağrılabilir.
- [ ] Canva bağlantısı ve Autofill şablon iş akışı ayrı bir adapter olarak tanımlanır.
- [ ] Her görev için sağlayıcı/model ayarlanabilir.
- [ ] Görev bazında fallback tanımlanabilir.
- [ ] Her AI çağrısının kullanım ve maliyet kaydı tutulur.
- [ ] Aylık bütçe, sağlayıcı limiti ve uyarı eşikleri vardır.
- [ ] Bütçe aşımında tanımlı politika uygulanır.
- [ ] Ürün orijinal görseli korunur ve AI türevleri ayrı saklanır.
- [ ] Model kalite/maliyet kıyaslama ekranı vardır.
- [ ] API anahtarları güvenli sunucu tarafında tutulur.

## Resmi dokümantasyon

- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini API spend controls: https://blog.google/innovation-and-ai/technology/developers-tools/more-control-over-gemini-api-costs/
- OpenAI image generation: https://developers.openai.com/api/docs/guides/image-generation
- OpenAI API pricing: https://developers.openai.com/api/docs/pricing
- Canva Autofill: https://www.canva.dev/docs/apps/rest-apis/reference/autofills/
- Canva API credit rates: https://www.canva.dev/docs/apps/rest-apis/credit-rates/
