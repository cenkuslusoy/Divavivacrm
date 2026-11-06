# DivaViva Shopify App Migration

## Karar

DivaViva Studio, `divaviva.store` mağazasına gömülü (embedded) bir Shopify Admin uygulaması olarak geliştirilecektir. Shopify ürün kataloğu, varyantlar, stok ve ürün medyası için tek doğruluk kaynağıdır. CRM ürün hazırlama, toplu fotoğraf yükleme, AI ile içerik üretme ve ileride pazaryeri senkronizasyonu katmanıdır.

## Neden resmi Shopify CLI şablonu?

Mevcut proje Next.js tabanlı bir arayüz prototipidir; Shopify OAuth/session yönetimi ve gömülü Admin App Bridge altyapısı yoktur. Yeni uygulama, Shopify'ın resmi React Router şablonundan başlatılmalıdır. Böylece OAuth, oturum saklama, Admin API istemcisi, App Bridge ve webhook iskeleti elle yazılmaz.

Resmi başlangıç:
```bash
shopify app init --template=https://github.com/Shopify/shopify-app-template-react-router
```

Resmi kaynaklar:
- https://shopify.dev/docs/apps/build/scaffold-app
- https://shopify.dev/docs/api/shopify-app-react-router/latest
- https://github.com/Shopify/shopify-app-template-react-router

## Geçiş prensipleri

1. Mevcut Next.js prototipi bu dalda korunur; doğrudan `main` üzerine yıkıcı dönüşüm yapılmaz.
2. Resmi React Router şablonu başlangıç noktası olur.
3. Mevcut DivaViva Studio ekranı, Shopify Admin içindeki authenticated `/app` layout'una taşınır.
4. Admin API çağrıları yalnızca sunucu tarafında, `authenticate.admin(request)` ile doğrulanmış oturum üzerinden yapılır.
5. Önce ürünleri ve medya dosyalarını Shopify'a taslak olarak kaydetme akışı tamamlanır.
6. Sonra ürün varyantları/SKU, stok, metafield ve düzenleme sonrası senkronizasyon eklenir.
7. En son Trendyol ve Hepsiburada adaptörleri Shopify ürün kayıtlarına bağlanır.

## İlk izin kapsamları

Başlangıçta yalnızca ihtiyaç duyulan kapsamlar istenmelidir. Ürün oluşturma ve düzenleme için `read_products` ve `write_products`; medya dosyası yükleme yöntemi gerektiriyorsa ilgili Files kapsamı Shopify'ın güncel API dokümantasyonuna göre eklenecektir. Stok akışına geçildiğinde `read_inventory` ve `write_inventory` değerlendirilir.

## Güvenlik

- Admin API access token'ı elle üretip kaynak koda koymayın.
- `.env`, erişim token'ı veya API secret GitHub'a commit edilmemelidir.
- Shopify CLI/React Router resmi kimlik doğrulama akışı ve oturum depolaması kullanılmalıdır.
- Ürün oluşturma endpoint'leri Shopify admin oturumunu doğrulamalıdır.
- Webhook imzaları doğrulanmalı; tekrar gelen webhook'lar idempotent işlenmelidir.

## İlk çalıştırma

Shopify CLI kurulu bir geliştirme bilgisayarında:
```bash
shopify app dev
```

CLI, geliştirici hesabına giriş, uygulama kaydı, mağaza seçimi ve geliştirme tüneli adımlarını yönetir. Uygulama önce test mağazasında doğrulanmalı, sonra özel dağıtım ile DivaViva mağazasına kurulmalıdır.

## Bu dalın mevcut durumu

- [x] Shopify uygulama geçişi için ayrı Git dalı açıldı.
- [x] Mevcut Next.js prototipi ve Shopify ürün oluşturma denemesi korundu.
- [ ] Resmi React Router şablonu projeye alındı.
- [ ] DivaViva arayüzü embedded Admin layout'una taşındı.
- [ ] Oturum doğrulamalı ürün/medya oluşturma akışı test edildi.
- [ ] Test mağazasında uçtan uca doğrulama yapıldı.
