"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowRight, Camera, Check, ChevronDown, CircleHelp, ImagePlus,
  LayoutDashboard, Package, Plus, Search, Settings2, ShoppingBag,
  Sparkles, Store, Upload, X, Boxes, Clock3, AlertCircle
} from "lucide-react";

type Photo = { id: string; name: string; url: string };
type Draft = { id: string; name: string; category: string; photos: Photo[]; variants: string[]; status: "Hazır" | "Kontrol gerekli"; webPrice: string; trendyolPrice: string; hbPrice: string; stock: string; description: string; material: string; keywords: string };

const seedDrafts: Draft[] = [
  { id: "DV-0001", name: "İnci Detaylı Gold Küpe", category: "Küpe", photos: [], variants: ["Gold", "Silver", "Rose"], status: "Hazır", webPrice: "", trendyolPrice: "", hbPrice: "", stock: "10", description: "Zarif inci detayıyla günlük ve özel kombinlere eşlik eden zamansız tasarım.", material: "Pirinç üzeri gold kaplama · sentetik inci (doğrulanmalı)", keywords: "inci küpe, gold küpe, kadın küpe, zarif takı" },
  { id: "DV-0002", name: "Minimal Zincir Kolye", category: "Kolye", photos: [], variants: ["Gold"], status: "Kontrol gerekli", webPrice: "", trendyolPrice: "", hbPrice: "", stock: "8", description: "Minimal zincir formuyla tek başına veya katmanlı kullanıma uygun kolye.", material: "Malzeme bilgisi doğrulanmalı", keywords: "minimal kolye, zincir kolye, kadın kolye" },
  { id: "DV-0003", name: "Dokulu Halka Küpe", category: "Küpe", photos: [], variants: ["Gold", "Silver"], status: "Hazır", webPrice: "", trendyolPrice: "", hbPrice: "", stock: "12", description: "Dokulu yüzeyiyle görünümüne karakter katan halka küpe.", material: "Malzeme bilgisi doğrulanmalı", keywords: "halka küpe, gold halka küpe, modern takı" }
];

export default function Home() {
  const [active, setActive] = useState("Ürün ekle");
  const [files, setFiles] = useState<Photo[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>(seedDrafts);
  const [selected, setSelected] = useState<string[]>(seedDrafts.map(d => d.id));
  const [prices, setPrices] = useState({ web: "", trendyol: "", hb: "" });
  const [stock, setStock] = useState("10");
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleDrafts = useMemo(() => drafts.filter(d => d.name.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")) || d.id.toLowerCase().includes(query.toLowerCase())), [drafts, query]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter(f => f.type.startsWith("image/")).map(file => ({ id: crypto.randomUUID(), name: file.name, url: URL.createObjectURL(file) }));
    setFiles(prev => [...prev, ...incoming]);
  }
  function createDrafts() {
    if (!files.length) return;
    const groups: Photo[][] = [];
    files.forEach((photo, index) => {
      const groupIndex = Math.floor(index / 2);
      if (!groups[groupIndex]) groups[groupIndex] = [];
      groups[groupIndex].push(photo);
    });
    const created = groups.map((photos, i): Draft => ({
      id: `DV-${String(drafts.length + i + 1).padStart(4, "0")}`,
      name: `Yeni ürün ${drafts.length + i + 1}`,
      category: "Kategori seç",
      photos,
      variants: ["Varsayılan"],
      status: "Kontrol gerekli",
      webPrice: prices.web,
      trendyolPrice: prices.trendyol,
      hbPrice: prices.hb,
      stock,
      description: "AI ürün açıklaması oluşturulacak. Ürün özellikleri fotoğraflardan doğrulanmalı.",
      material: "Malzeme bilgisi doğrulanmalı",
      keywords: "ürün, aksesuar, DivaViva"
    }));
    setDrafts(prev => [...prev, ...created]);
    setSelected(created.map(d => d.id));
    setFiles([]);
    setStep(2);
  }
  function updateDraft<K extends keyof Draft>(id: string, key: K, value: Draft[K]) {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, [key]: value } : d));
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">D</div><div><div className="brand-name">DivaViva</div><div className="brand-sub">STUDIO</div></div></div>
        <div className="workspace"><span className="workspace-dot"/> Mağaza yönetimi <ChevronDown size={15}/></div>
        <div className="nav-label">ÇALIŞMA ALANI</div>
        {[
          { name: "Genel bakış", icon: LayoutDashboard },
          { name: "Ürün ekle", icon: Plus },
          { name: "Ürünler", icon: Package },
          { name: "Stok takibi", icon: Boxes },
          { name: "Yayınlama geçmişi", icon: Clock3 }
        ].map(item => <button key={item.name} className={active === item.name ? "nav-item active" : "nav-item"} onClick={() => setActive(item.name)}><item.icon size={18}/>{item.name}{item.name === "Ürün ekle" && <span className="nav-count">+</span>}</button>)}
        <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18}/> Ayarlar</button><div className="profile"><div className="avatar">D</div><div><strong>Damla</strong><small>Mağaza yöneticisi</small></div><ChevronDown size={15}/></div></div>
      </aside>

      <section className="main">
        <header className="topbar"><div className="breadcrumb">DivaViva <span>/</span> {active}</div><div className="top-actions"><button className="icon-button"><CircleHelp size={18}/></button><div className="avatar small">D</div></div></header>
        <div className="content">
          <div className="page-heading"><div><div className="eyebrow">ÜRÜN OPERASYONLARI</div><h1>{active === "Ürün ekle" ? "Yeni ürünler oluştur" : active}</h1><p>Ürün fotoğraflarından düzenlenebilir taslaklara, tek bir yerden.</p></div><div className="heading-chip"><span/> V1 · Ürün hazırlama</div></div>

          <div className="stats">
            <div className="stat-card"><div className="stat-icon"><Package size={18}/></div><div><strong>{drafts.length}</strong><span>Ürün taslağı</span></div></div>
            <div className="stat-card"><div className="stat-icon"><ImagePlus size={18}/></div><div><strong>{files.length}</strong><span>Yüklenen fotoğraf</span></div></div>
            <div className="stat-card"><div className="stat-icon"><Store size={18}/></div><div><strong>3</strong><span>Satış kanalı</span></div></div>
          </div>

          <div className="stepper"><div className={step === 1 ? "step current" : "step done"}><span>{step > 1 ? <Check size={15}/> : "01"}</span><div><strong>Fotoğraf ve fiyat</strong><small>Ürünleri toplu yükle</small></div></div><div className="step-line"/><div className={step === 2 ? "step current" : "step"}><span>02</span><div><strong>Taslakları düzenle</strong><small>İçerik ve varyantları kontrol et</small></div></div></div>

          <div className="work-grid">
            <div className="primary-column">
              <section className="panel">
                <div className="panel-head"><div><h2>Ürün fotoğrafları</h2><p>Birden fazla ürüne ait fotoğrafları birlikte seçebilirsin.</p></div><span className="soft-tag">Toplu yükleme</span></div>
                <div className="upload-zone" onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
                  <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={e => addFiles(e.target.files)}/>
                  <div className="upload-icon"><Upload size={22}/></div><strong>Fotoğrafları buraya bırak veya seç</strong><span>JPG, PNG veya WEBP · Birden fazla fotoğraf yükleyebilirsin</span><button className="secondary-button" type="button"><Camera size={16}/> Fotoğraf seç</button>
                </div>
                {files.length > 0 && <div className="photo-strip"><div className="photo-strip-head"><strong>{files.length} fotoğraf seçildi</strong><button onClick={() => setFiles([])} className="text-button">Tümünü kaldır</button></div><div className="photo-grid">{files.map(photo => <div className="photo-thumb" key={photo.id}><img src={photo.url} alt={photo.name}/><button onClick={() => setFiles(prev => prev.filter(p => p.id !== photo.id))}><X size={13}/></button></div>)}</div></div>}
              </section>
              <section className="panel">
                <div className="panel-head"><div><h2>Satış fiyatları</h2><p>Platformların fiyatlarını ayrı ayrı belirle.</p></div></div>
                <div className="price-grid">{[{ key: "web", label: "Web sitesi", icon: Store }, { key: "trendyol", label: "Trendyol", icon: ShoppingBag }, { key: "hb", label: "Hepsiburada", icon: Package }].map(p => <label className="field" key={p.key}><span>{p.label}</span><div className="input-wrap"><span>₺</span><input value={prices[p.key as keyof typeof prices]} onChange={e => setPrices(prev => ({ ...prev, [p.key]: e.target.value }))} placeholder="0,00" inputMode="decimal"/></div></label>)}</div>
                <label className="field stock-field"><span>Başlangıç stok miktarı</span><div className="input-wrap"><input value={stock} onChange={e => setStock(e.target.value)} inputMode="numeric"/><span>adet</span></div></label>
              </section>
              <div className="bottom-actions"><span><AlertCircle size={15}/> Fotoğraflar taslak oluşturmak için yeterli.</span><button className="primary-button" onClick={createDrafts} disabled={!files.length}>Taslakları oluştur <ArrowRight size={17}/></button></div>
            </div>

            <aside className="side-column">
              <section className="tip-card"><div className="tip-icon"><Sparkles size={19}/></div><h3>AI ürün asistanı</h3><p>Fotoğraflar ürünlere ayrılacak, ürün bilgileri ve SEO alanları taslak olarak hazırlanacak.</p><div className="tip-list"><span><Check size={14}/> Ürün gruplandırma</span><span><Check size={14}/> Renk varyantı tespiti</span><span><Check size={14}/> Açıklama ve SEO taslağı</span></div><small>AI bağlantısı sonraki geliştirme aşamasında eklenecek.</small></section>
              <section className="panel channel-panel"><h3>Yayın kanalları</h3><div className="channel"><div className="channel-logo web">W</div><div><strong>Web sitesi</strong><small>DivaViva mağazası</small></div><span className="channel-state">Hazırlanacak</span></div><div className="channel"><div className="channel-logo ty">T</div><div><strong>Trendyol</strong><small>Pazaryeri</small></div><span className="channel-state">Hazırlanacak</span></div><div className="channel"><div className="channel-logo hb">H</div><div><strong>Hepsiburada</strong><small>Pazaryeri</small></div><span className="channel-state">Hazırlanacak</span></div></section>
            </aside>
          </div>

          <section className="draft-section">
            <div className="draft-heading"><div><div className="eyebrow">ÇALIŞMA ALANI</div><h2>Ürün taslakları <span>{drafts.length}</span></h2><p>Oluşturulan ürünleri düzenle ve yayına hazırlık durumlarını kontrol et.</p></div><div className="draft-tools"><div className="search-box"><Search size={16}/><input placeholder="Ürün ara..." value={query} onChange={e => setQuery(e.target.value)}/></div><button className="secondary-button compact" onClick={() => setSelected(drafts.map(d => d.id))}>Tümünü seç</button></div></div>
            <div className="draft-table">
              <div className="table-head"><span>ÜRÜN</span><span>KATEGORİ / VARYANT</span><span>DURUM</span><span>İŞLEM</span></div>
              {visibleDrafts.map(d => <div className="table-row" key={d.id}><div className="product-cell"><input type="checkbox" checked={selected.includes(d.id)} onChange={e => setSelected(prev => e.target.checked ? [...prev, d.id] : prev.filter(id => id !== d.id))}/><div className="product-placeholder"><ShoppingBag size={17}/></div><div><strong>{d.name}</strong><small>{d.id} · {d.photos.length} fotoğraf</small></div></div><div className="category-cell"><strong>{d.category}</strong><small>{d.variants.join(" · ")}</small></div><div><span className={d.status === "Hazır" ? "status ready" : "status review"}>{d.status}</span></div><div><button className="text-button" onClick={() => setEditing(editing === d.id ? null : d.id)}>{editing === d.id ? "Kapat" : "Düzenle"}</button></div></div>)}
              {visibleDrafts.length === 0 && <div className="empty-state">Aramana uygun ürün bulunamadı.</div>}
            </div>
            {editing && drafts.filter(d => d.id === editing).map(d => <div className="editor" key={d.id}><div className="editor-head"><div><strong>{d.name}</strong><small>{d.id} · Ürün taslağı</small></div><button className="icon-button" onClick={() => setEditing(null)}><X size={17}/></button></div><div className="editor-grid"><label className="field"><span>Ürün adı</span><input value={d.name} onChange={e => updateDraft(d.id, "name", e.target.value)}/></label><label className="field"><span>Kategori</span><input value={d.category} onChange={e => updateDraft(d.id, "category", e.target.value)}/></label><label className="field"><span>Malzeme</span><input value={d.material} onChange={e => updateDraft(d.id, "material", e.target.value)}/></label><label className="field"><span>Renk varyantları</span><input value={d.variants.join(", ")} onChange={e => updateDraft(d.id, "variants", e.target.value.split(",").map(v => v.trim()))}/></label><label className="field full"><span>Ürün açıklaması</span><textarea value={d.description} onChange={e => updateDraft(d.id, "description", e.target.value)}/></label><label className="field full"><span>SEO anahtar kelimeleri</span><input value={d.keywords} onChange={e => updateDraft(d.id, "keywords", e.target.value)}/></label><label className="field"><span>Web fiyatı (₺)</span><input value={d.webPrice} onChange={e => updateDraft(d.id, "webPrice", e.target.value)}/></label><label className="field"><span>Trendyol fiyatı (₺)</span><input value={d.trendyolPrice} onChange={e => updateDraft(d.id, "trendyolPrice", e.target.value)}/></label><label className="field"><span>Hepsiburada fiyatı (₺)</span><input value={d.hbPrice} onChange={e => updateDraft(d.id, "hbPrice", e.target.value)}/></label><label className="field"><span>Stok</span><input value={d.stock} onChange={e => updateDraft(d.id, "stock", e.target.value)}/></label></div><div className="editor-foot"><span><AlertCircle size={14}/> Malzeme bilgilerini yayınlamadan önce doğrula.</span><button className="primary-button" onClick={() => setEditing(null)}><Check size={16}/> Değişiklikleri kaydet</button></div></div>)}
            <div className="bulk-footer"><span>{selected.length} ürün seçildi</span><button className="secondary-button compact" disabled={!selected.length}>Toplu düzenleme <ArrowRight size={15}/></button></div>
          </section>
          <footer className="footer">DivaViva Studio <span>·</span> V1 ürün hazırlama paneli</footer>
        </div>
      </section>
    </main>
  );
}
