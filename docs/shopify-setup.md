# Shopify uygulama kurulumu — DivaViva

DivaViva Studio, `divaviva.store` mağazasında Shopify Admin içine gömülü bir uygulama olacaktır. Bu nedenle eski tip, Shopify Admin'den önceden üretilen kalıcı Admin API token'ı yaklaşımını kullanmıyoruz. Yeni uygulamalar için bu uygulama türü artık oluşturulamıyor ve embedded App Bridge desteği sağlamıyor.

## Kullanılacak altyapı

Shopify'ın resmi React Router uygulama şablonu:

```bash
shopify app init --template=https://github.com/Shopify/shopify-app-template-react-router
```

Resmi dokümantasyon:
- React Router uygulama paketi: https://shopify.dev/docs/api/shopify-app-react-router/latest
- Geliştirme ve CLI: https://shopify.dev/docs/apps/build/scaffold-app
- Özel dağıtım: https://shopify.dev/docs/apps/launch/distribution
- İstek doğrulama: https://shopify.dev/docs/apps/build/security/app-server/authenticate-every-request

## Dağıtım tercihi

İlk sürüm yalnızca DivaViva'nın kendi Shopify mağazasında kullanılacağı için **Custom distribution / Single merchant** hedefleniyor. Bu dağıtım türü App Store incelemesi gerektirmez; ancak Shopify'ın uygulama faturalandırma sistemiyle ücret alma özelliği yoktur. Dağıtım seçimi sonradan değiştirilemediği için üretim uygulaması oluşturulurken bu karar bilinçli verilmelidir.

## Kimlik doğrulama ve API

- Shopify CLI uygulama kaydı ve geliştirme yapılandırmasını yönetir.
- Embedded Admin istekleri `authenticate.admin(request)` ile doğrulanır.
- Admin GraphQL API çağrıları, doğrulanmış istekten dönen `admin.graphql(...)` istemcisiyle sunucu tarafında yapılır.
- Oturumlar resmi şablonun session storage çözümüyle saklanır.
- Webhook'lar `authenticate.webhook(request)` ile doğrulanır.
- Uygulama route'ları, Shopify Admin layout/auth sınırının dışında bırakılmamalıdır; webhook route'ları ise ayrı tutulmalıdır.

## Gerekli başlangıç kapsamları

İlk ürün hazırlama aşamasında yalnızca ürün okuma/yazma izinleri istenir. Medya yükleme işlemi için gereken Files kapsamı, seçilen GraphQL medya mutasyonunun güncel dokümantasyonundan doğrulanarak eklenecek. Stok senkronizasyonu başladığında inventory kapsamları ayrıca eklenir. Gereksiz izin istenmez.

## Ortam değişkenleri

Shopify CLI tarafından oluşturulan uygulama yapılandırması ve yerel `.env` dosyası kullanılacaktır. Beklenen anahtarlar şunlardır (değerleri Shopify CLI / Dev Dashboard sağlar):

- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SHOPIFY_APP_URL`
- `SCOPES` (veya `shopify.app.toml` içindeki access scopes)

Bunlar secret olarak tutulmalı; gerçek değerler GitHub'a veya sohbet mesajlarına yazılmamalıdır. Admin API access token'ı elle kopyalanıp `SHOPIFY_ADMIN_ACCESS_TOKEN` adıyla saklanmayacaktır.

## Yerel geliştirme

```bash
shopify app dev
```

CLI giriş, mağaza/uygulama seçimi, geliştirme tüneli ve gerekli ortam ayarlarında yol gösterir. Önce development store üzerinde test edilir; sonra DivaViva mağazasına custom distribution yoluyla kurulur.

## Mevcut eski prototip hakkında

Bu depodaki mevcut Next.js endpoint'i `app/api/shopify/products/route.ts` sabit bir Admin API token'ı varsayar ve Shopify Admin oturumunu doğrulamaz. Bu nedenle **canlıya açılmamalı ve yeni embedded uygulamada kullanılmamalıdır**. Resmi React Router şablonuna geçerken bu endpoint, `authenticate.admin` ile korunan bir action/route olarak yeniden yazılacaktır.
