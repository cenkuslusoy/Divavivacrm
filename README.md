# DivaViva Studio

DivaViva için Shopify Admin içine gömülü ürün hazırlama ve çok kanallı satış operasyon uygulaması.

## Ürün mimarisi

- **Ana katalog:** `divaviva.store` Shopify mağazası.
- **Ürün medyası:** Shopify ürün medyası / Shopify CDN.
- **DivaViva Studio:** Toplu fotoğraf yükleme, fotoğrafları ürün ve renk varyantlarına ayırma, AI içerik önerileri, fiyat/stok hazırlama ve Shopify taslak ürün oluşturma.
- **Pazaryerleri:** Sonraki fazda Shopify ürün/variant kayıtlarından Trendyol ve Hepsiburada senkronizasyonu.

Veri modeli ve akış için [ürün veri modeli](docs/PRODUCT_DATA_MODEL.md), Shopify embedded app geçişi için [mimari plan](docs/SHOPIFY_APP_MIGRATION.md) ve [kurulum rehberi](docs/shopify-setup.md) dosyalarına bakın.

## Teknoloji kararı

Mevcut Next.js ekranı ilk UI prototipidir. Gerçek Shopify uygulaması, Shopify'ın resmi **React Router app template** altyapısına taşınacaktır. Bu şablon Shopify Admin embedded arayüzü, App Bridge, oturum yönetimi ve doğrulanmış Admin GraphQL API erişimi sağlar.

## Güvenlik notu

Eski `app/api/shopify/products/route.ts` prototip endpoint'i kalıcı Admin API token'ı varsayar ve Shopify Admin oturumunu doğrulamaz. **Bu endpoint canlı mağazada kullanılmamalıdır.** Embedded uygulamaya geçişte `authenticate.admin(request)` ile doğrulanan route/action olarak yeniden yazılacaktır. Gerçek token veya secret GitHub'a commit edilmez.

## Geliştirme

Shopify CLI kurulu geliştirme bilgisayarında resmi şablon başlatılır:

```bash
shopify app init --template=https://github.com/Shopify/shopify-app-template-react-router
shopify app dev
```

Mevcut prototip ve migration dokümanları `shopify-app-migration` dalındadır. Ana `main` dalı korunmaktadır.

## Durum

- [x] Shopify embedded app mimarisi seçildi.
- [x] Ana katalog ve medya için Shopify tek kaynak olarak belirlendi.
- [x] Geçiş dalı ve mimari/veri modeli dokümantasyonu hazırlandı.
- [ ] Resmi React Router şablonu depoya alındı.
- [ ] DivaViva Studio UI embedded Admin içine taşındı.
- [ ] Güvenli ürün + medya oluşturma akışı test edildi.
- [ ] Test mağazası ve ardından `divaviva.store` kurulumu tamamlandı.
