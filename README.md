# DivaViva Studio

DivaViva için mobil öncelikli ürün hazırlama ve çok kanallı satış yönetim paneli.

## Hedef mimari
- Ana ürün kataloğu ve ürün sayfaları: **divaviva.store (Shopify)**
- CRM: ürün fotoğraflarını ve bilgilerini hazırlama, düzenleme ve mağazaya taslak ürün olarak gönderme merkezi.
- Pazaryerleri: sonraki aşamada Shopify'daki ana ürün kaydından Trendyol ve Hepsiburada'ya aktarım.

## Yerel geliştirme
```bash
npm install
npm run dev
```

## Shopify bağlantısı
Mağaza bağlantısı sunucu tarafı ortam değişkenleriyle yapılandırılır. Kurulum için [Shopify bağlantı rehberine](docs/shopify-setup.md) bakın. `SHOPIFY_ADMIN_ACCESS_TOKEN` gizlidir; asla GitHub'a commit etmeyin, tarayıcıya göndermeyin veya sohbette paylaşmayın.

## Mevcut durum
İlk CRM arayüz prototipi GitHub'a eklendi. Ürün taslakları şu anda tarayıcı belleğinde tutulur; Shopify'a ürün oluşturma ve fotoğraf gönderme bağlantısı henüz etkin değildir. Shopify Admin API bağlantısı kurulup güvenli şekilde test edildikten sonra CRM'den ürün sayfası oluşturma akışı bağlanacaktır.
