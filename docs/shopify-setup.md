# Shopify bağlantısı — divaviva.store

CRM, ana ürün kaynağı olarak Shopify mağazasını kullanır. CRM'den oluşturulan kayıtlar ilk etapta Shopify'da **DRAFT** (taslak) durumunda açılır. Ürün fotoğrafları Shopify'ın kendi medya depolamasına yüklenir.

## Shopify özel uygulaması oluşturma

1. Shopify yöneticisinde **Settings → Apps and sales channels → Develop apps** bölümünü açın. (İlk kullanımda özel uygulama geliştirmeyi etkinleştirmeniz istenebilir.)
2. **Create an app** ile örneğin `DivaViva CRM` adında uygulama oluşturun.
3. **Configuration → Admin API integration** bölümünde yalnızca gerekli kapsamı etkinleştirin: `write_products`. Ürünleri CRM'de listeleme/okuma özelliği eklendiğinde `read_products` de gerekecek.
4. Uygulamayı **Install app** ile mağazaya kurun.
5. Admin API access token'ı alın. Bu token bir parola gibi gizlidir.

## Hosting ortam değişkenleri

Hosting sağlayıcısının Environment Variables / Secrets bölümüne ekleyin:

- `SHOPIFY_STORE_DOMAIN`: mağazanın gerçek `xxxx.myshopify.com` alan adı. Özel alan adı `divaviva.store` değil, Shopify'ın verdiği myshopify alan adı kullanılmalı.
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: uygulamanın Admin API access token'ı.
- `SHOPIFY_API_VERSION`: `2026-10`.

Token'ı GitHub'a commit etmeyin, tarayıcıya koymayın veya sohbet mesajı olarak göndermeyin. Yalnızca hosting ortamının gizli değişken alanına girin.

## CRM akışı

`POST /api/shopify/products` endpoint'i ürün adı/kodu, açıklama, kategori, etiketler, web fiyatı ve fotoğrafları alır; fotoğrafları Shopify staged upload ile gönderir ve ürünü taslak olarak oluşturur.

Mevcut arayüzde fotoğraflar örnek olarak ikili gruplara ayrılır ve ürün adları demo amaçlı oluşturulur. Gerçek ürün gruplama, ürün adı/varyant editörü, stok güncellemesi ve düzenleme sonrası Shopify'a senkronizasyon sonraki geliştirme adımlarıdır. Ürün oluşturma bağlantısı henüz gerçek mağaza kimlik bilgileriyle test edilmemiştir.
