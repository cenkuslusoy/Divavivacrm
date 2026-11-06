# Depo toplama, kutu adresleme ve ışıklı toplama (Pick-to-Light)

## Amaç

DivaViva'da günlük kargolama ekranı, o gün gönderilecek tüm siparişleri tek operasyon listesinde toplar. Paketleme personeli hangi ürünlerden kaç adet alacağını, ürünlerin depodaki hangi raf/kutu konumunda bulunduğunu ve hangi siparişe ait olduğunu tek ekranda görür.

İlk sürüm fiziksel depo lokasyonlarını ve toplama listesini yönetir. Sonraki aşamada kutulara adres/konum kodu verilir; donanım altyapısı hazırlandığında ilgili kutunun üzerinde LED yakılarak personel doğru ürüne yönlendirilir.

## 1. Günlük kargolama ekranı

Ana ekran: **Bugünkü Kargolar / Depo Toplama**

Üst özet:
- Gönderime hazır sipariş sayısı
- Toplanacak toplam ürün adedi
- Paketlenmeyi bekleyen sipariş
- Etiketi basılmaya hazır sipariş
- Hata/eksik stok/konum bilgisi olan sipariş

Ekran iki çalışma görünümü sunar:

### Sipariş bazlı görünüm
Her siparişte:
- Sipariş numarası ve satış kanalı
- Ürün görseli, ürün adı, varyant
- SKU ve barkod
- İstenen adet
- Depo lokasyonu (raf/kutu kodu)
- Toplandı / eksik / bulunamadı durumu
- Kargo etiketi ve ürün etiketi baskı durumu

### Toplu toplama görünümü
Birden fazla siparişin kalemleri aynı SKU/varyant için birleştirilir. Örnek: 8 siparişin toplamında A ürünü 4, B ürünü 3, C ürünü 2 adet alınacaksa personel tek seferde bu miktarları toplar. Sonra ürünler siparişlere ayrıştırılarak paketleme istasyonuna taşınır.

Toplama listesi depo konumuna göre sıralanır; personel gereksiz raf/koridor dolaşımı yapmaz. Aynı SKU'nun farklı varyantları ayrı satırdır.

## 2. Depo lokasyon sistemi

Hiyerarşi:
- Depo
- Alan / oda
- Raf
- Bölme
- Kutu / bin

Örnek adres: A-03-R02-B04-K017
- A: depo alanı
- 03: raf grubu
- R02: raf
- B04: bölme
- K017: kutu

Her ürün varyantı bir veya birden fazla lokasyona bağlanabilir. Her lokasyonda:
- Benzersiz konum kodu
- QR veya barkod etiketi
- İçindeki SKU/varyantlar
- Mevcut miktar
- Minimum/uyarı miktarı
- Aktif/pasif durumu

Ürün ilk kez depoya konduğunda Damla veya depo personeli lokasyonu seçer/okutur. Sonraki siparişlerde sistem lokasyonu otomatik gösterir. Ürün farklı kutuya taşınırsa lokasyon değişikliği barkod okutularak kaydedilir.

## 3. Toplama ve paketleme iş akışı

1. Shopify/Trendyol/Hepsiburada siparişleri alınır ve gönderime uygun olanlar günlük kargolama listesine düşer.
2. Sipariş kalemleri stok ve lokasyon bilgisiyle eşleştirilir.
3. Sistem toplama turunu lokasyon sırasına göre oluşturur.
4. Personel kutu/ürün barkodunu okutarak doğru SKU ve miktarı doğrular.
5. Eksik veya yanlış ürün uyarısı verilir; yanlış SKU ile devam edilmesi engellenebilir.
6. Toplanan ürünler sipariş bazında ayrıştırılır veya paketleme istasyonuna taşınır.
7. Paketleme aşamasında sipariş içeriği son kez doğrulanır.
8. Kargo ve ürün etiketleri baskı kuyruğuna gönderilir.
9. Paket hazır ve kargoya teslim edildi durumları işaretlenir.

Siparişlerin kargo son kabul saatleri dikkate alınarak öncelik sırası gösterilir. İptal edilen veya ödemesi/teslimat uygunluğu doğrulanmayan siparişler toplama listesine otomatik girmez.

## 4. Işıklı kutu sistemi (gelecek faz)

Hedef: Personel toplama listesinde bir ürüne geçtiğinde ilgili kutunun LED'i yanar. Personel ürünü aldıktan sonra kutu üzerindeki düğmeye basabilir veya barkodu okutarak toplama işlemini onaylar; LED söner ve sıradaki lokasyon yanar.

Önerilen donanım yaklaşımı:
- Her kutu veya kutu grubu için adreslenebilir LED modülü.
- Kutulara benzersiz elektronik adres/ID.
- ESP32 veya benzeri mikrodenetleyici tabanlı bölgesel kontrol birimi.
- Wi-Fi/Ethernet üzerinden güvenli yerel ağ bağlantısı.
- DivaViva ile cihaz geçidi arasında kimlik doğrulamalı mesajlaşma.
- LED durumları: çağrıldı, toplandı/onaylandı, hata/yanlış lokasyon.
- Manuel kapatma ve tüm ışıkları sıfırlama kontrolü.
- Bağlantı koparsa ekrandaki dijital toplama listesi çalışmaya devam eder; ışık sistemi zorunlu bağımlılık olmaz.

İlk donanım prototipi tek raf ve 5–10 kutuda test edilir. Kablo/enerji, LED parlaklığı, raf mesafesi, Wi-Fi kapsaması ve yanlış kutu riskleri ölçülmeden tüm depoya yayılmaz. LED'ler ürünün/kutunun barkodunu veya güvenlik etiketini kapatmayacak konumda olmalıdır.

## 5. Veri modeli

- warehouse_locations: depo, alan, raf, bölme, kutu hiyerarşisi, adres kodu, QR/barcode, aktiflik.
- inventory_location_balances: SKU/varyant, lokasyon, miktar, rezerve miktar.
- pick_waves: tarih, durum, öncelik, atanan personel, başlangıç/bitiş.
- pick_tasks: sipariş, sipariş kalemi, SKU/varyant, miktar, kaynak lokasyon, toplanan miktar, durum.
- pick_scans: okutulan barkod, kullanıcı/cihaz, zaman, doğrulama sonucu.
- packing_sessions: sipariş, paketleme durumu, kontrol listesi, etiket baskı işleri.
- pick_to_light_devices: cihaz kimliği, lokasyon eşlemesi, bağlantı durumu, son görülme.
- pick_to_light_events: ışık çağırma, onay, hata, zaman damgası.

Stok doğruluğu için fiziksel miktar, rezerve miktar ve satılabilir miktar ayrı tutulur. Shopify ana satış stoğu olmaya devam eder; lokasyon bakiyeleri depodaki fiziksel yerleşimi ve toplama operasyonunu açıklar. Lokasyon hareketleri stok mutabakatıyla tutarlı olmalıdır.

## 6. Ekranlar

- Günlük kargolama panosu
- Sipariş bazlı toplama
- Toplu toplama turu
- Depo haritası / raf-kutu yönetimi
- Ürün lokasyon atama ve taşıma
- Barkod okutma ekranı
- Paketleme ve son kontrol
- Etiket baskı kuyruğu
- Işıklı toplama cihazları (gelecek faz)

## 7. Kabul kriterleri

### İlk yazılım sürümü
- [ ] Günlük gönderime uygun siparişler tek ekranda listelenir.
- [ ] Her sipariş satırında ürün, varyant, SKU ve miktar görünür.
- [ ] Ürünlerin depo kutu/raf adresi görünür.
- [ ] Aynı SKU/varyant için sipariş miktarları toplu toplama görünümünde birleştirilir.
- [ ] Toplama listesi lokasyon sırasına göre düzenlenir.
- [ ] Barkod okutularak doğru ürün ve miktar doğrulanır.
- [ ] Toplandı, eksik, bulunamadı ve paketlendi durumları kaydedilir.
- [ ] Kargo ve ürün etiketi baskı akışıyla bağlanır.
- [ ] İptal/uygunsuz siparişler toplama listesine alınmaz.

### Donanım fazı
- [ ] Her kutu benzersiz lokasyon koduna sahiptir.
- [ ] Kutu LED'i DivaViva'dan komutla yanar ve söner.
- [ ] Toplama onayı ışığı kapatır ve sıradaki lokasyonu çağırır.
- [ ] Bağlantı kesilince yazılım toplama listesi çalışmayı sürdürür.
- [ ] Cihaz çevrimdışı ve hatalı lokasyon durumları görünür.

## Fazlandırma

1. Günlük kargolama ekranı ve sipariş kalemlerinin tek listede gösterilmesi.
2. Depo raf/kutu kodları ve ürün lokasyon ataması.
3. Toplu toplama turu, barkodla doğrulama ve paketleme.
4. Otomatik kargo/ürün etiketi baskısıyla birleştirme.
5. Tek raf üzerinde pick-to-light LED prototipi.
6. Pilot sonuçlarına göre depo geneline yayma.

Bu belge hedef tasarımı tanımlar; depo yönetimi veya LED donanım entegrasyonu henüz uygulanmış/test edilmiş değildir.
