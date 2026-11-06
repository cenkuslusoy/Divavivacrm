# Otomatik kargo ve ürün etiketi yazdırma

## Amaç

Sipariş geldiğinde kargo etiketi ve ürün tanımlama etiketi DivaViva tarafından otomatik hazırlanıp yazıcıya gönderilebilir. Pazaryerinin ürettiği kargo barkodu değiştirilmez; ürün bilgisi ayrı etikette basılır. Böylece taşıyıcı barkodu/QR kodu kapanmaz ve taranabilirliği riske atılmaz.

## Sipariş geldiğinde akış

1. Shopify, Trendyol veya Hepsiburada siparişi alınır ve harici sipariş ID'siyle tekilleştirilir.
2. Sipariş kalemleri, ürün adı, varyant/renk/beden, SKU, adet ve sipariş numarası doğrulanır.
3. Siparişin kargo etiketi ilgili kanal/taşıyıcı sisteminden alınır. Pazaryeri gönderilerinde pazaryerinin oluşturduğu etiket ve takip numarası esas alınır.
4. DivaViva iki baskı işini hazırlar:
   - Kargo etiketi: pazaryerinin/taşıyıcının orijinal PDF veya baskı verisi, değiştirilmeden.
   - Ürün etiketi: ürün adı, varyant (renk/beden), SKU/barkod ve sipariş kalem adedi. İhtiyaca göre DivaViva sipariş numarası.
5. Kullanıcının ayarına göre otomatik yazdırma veya yazdırma kuyruğunda tek tuşla yazdırma yapılır.
6. Yazdırma işi, yazıcı ve sipariş referansıyla kaydedilir; aynı sipariş için tekrar baskı yapılırken kopya/yeniden baskı uyarısı verilir.
7. Paketleme personeli ürün etiketiyle ürünü doğrular, ürünü paketler ve kargo etiketini paketin dışına yapıştırır.

## Ürün etiketi içeriği

Varsayılan alanlar:
- Ürün adı
- Renk/beden/diğer varyant
- SKU
- Adet (sipariş kalemi miktarı)
- İsteğe bağlı barkod veya QR kod
- İsteğe bağlı DivaViva sipariş numarası

Müşteri adı/adresi ve ürün fiyatı ürün etiketine varsayılan olarak basılmaz. Ürün etiketi ile kargo etiketi ayrı olmalıdır.

## Yazıcı ve donanım gereksinimi

- Kargo etiketi için 4 inç sınıfı, 100×150 mm direkt termal yazıcı.
- Ürün tanımlama etiketi için daha küçük etiket ölçüleri (ör. 50×30, 60×40 veya 100×50 mm) kullanılabilir. Aynı yazıcı, 4 inç yazıcı tarafından desteklenen rulo/genişlik ve medya sensörü koşulları sağlanıyorsa küçük etiketleri de basabilir; satın almadan önce üretici spesifikasyonu ve gerçek etiket ölçüsü doğrulanır.
- Yazıcı USB veya ağ bağlantısıyla uygulamanın güvenli baskı ajanına bağlanır. Tarayıcı tek başına sessiz/otomatik yerel baskı yapamaz; bilgisayarda çalışan yerel print agent/desktop bridge veya uyumlu ağ yazıcısı entegrasyonu gerekir.
- Yazdırma kuyruğu, yazıcı çevrimdışı durumu, kağıt bitti ve yeniden baskı yönetimi bulunur.

## Güvenlik ve operasyon kuralları

- Pazaryeri kargo barkodu veya zorunlu taşıyıcı alanları hiçbir zaman ürün bilgisiyle kapatılmaz/değiştirilmez.
- Sipariş durumunun gönderiye uygun olduğu ve kargo etiketinin hazır bulunduğu doğrulanmadan kargo etiketi basılmaz.
- Ürün etiketi, sipariş kalemleri ile SKU/varyant eşleşmesi doğrulandıktan sonra basılır.
- Çok kalemli siparişlerde ürün başına etiket veya sipariş içeriğini özetleyen paket içi liste seçeneği sunulur.
- İptal edilmiş siparişler için otomatik baskı yapılmaz.
- Her baskı işi, zaman damgası, sipariş, etiket türü, yazıcı ve sonuç bilgisiyle denetlenebilir olmalıdır.

## Kabul kriterleri

- [ ] Yeni sipariş otomatik baskı kuyruğuna alınır.
- [ ] Orijinal kargo etiketi ayrı ve değiştirilmeden basılır.
- [ ] Ürün etiketi ürün adı, varyant, SKU ve adet bilgilerini içerir.
- [ ] Tek kalemli ve çok kalemli siparişler doğru etiketlenir.
- [ ] Aynı siparişin mükerrer baskısı uyarı verir ve yetkili yeniden baskı yapabilir.
- [ ] Yazıcı çevrimdışı/hata durumları kuyrukta görünür.
- [ ] Otomatik baskı kapatılıp manuel onaylı baskı seçilebilir.
- [ ] Baskı ajanı/cihaz bağlantısı güvenli ve izlenebilir olur.

Bu belge hedef tasarımı tanımlar; yazıcı entegrasyonu henüz uygulanmış veya test edilmiş değildir.
