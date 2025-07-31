# TOK YAPI PROJE - Supabase Projeler Entegrasyonu (Read-Only)

Bu proje, statik HTML projeler sistemini Supabase veritabanından okuma odaklı dinamik hale getirir. Sadece veri çekme (read) operasyonlarına odaklanmıştır.

## 🚀 Lokal Development

### Yöntem 1: NPM ile (Önerilen)

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Alternatif
npm start
```

Server `http://localhost:3000` adresinde çalışacak.

### Yöntem 2: Python ile

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Server `http://localhost:8000` adresinde çalışacak.

### Yöntem 3: VS Code Live Server

1. VS Code'da "Live Server" extension'ını kurun
2. `index.html` dosyasına sağ tıklayın
3. "Open with Live Server" seçin

### Yöntem 4: Node.js ile manuel

```bash
# Global live-server kurulum
npm install -g live-server

# Proje klasöründe çalıştır2
live-server --port=3000
```

## ⚠️ Önemli Notlar

- **CORS Sorunu:** `file://` protokolü ile Supabase API'ye erişemezsiniz
- **HTTP/HTTPS Gerekli:** Mutlaka bir web server kullanın
- **Port:** İstediğiniz portu değiştirebilirsiniz

## 🗄️ Mevcut Veritabanı Yapısı

Sisteminiz şu tablolara sahip:
- `projects` - Ana proje bilgileri (id, title, description, user_id)  
- `project_media` - Proje medya dosyaları (image, video, document)

## 📁 Proje Dosyaları

- `assets/js/projects.js` - Ana proje okuma JavaScript dosyası (Read-Only)
- `project/project.html` - Dinamik proje detay sayfası
- `supabase-schema.sql` - Örnek veri ekleme SQL'i (referans için)

## 🛠️ Kurulum Adımları

### 1. JavaScript Entegrasyonu
Tüm HTML dosyalarınıza şu script'i ekleyin:

```html
<script src="assets/js/projects.js"></script>
```

### 2. Mevcut Veritabanından Okuma
Sistem otomatik olarak mevcut projelerinizi çeker, hiçbir değişiklik gerekmez.

## 🖥️ Kullanım

### Ana Proje Listesi
- `project/index.htm` - Projeler otomatik yüklenir
- URL: `project/project.html?id=1` formatında dinamik sayfa

### Proje Detay Sayfası
- URL parametresi ile dinamik içerik: `project.html?id=1`
- Otomatik proje medya galerisi
- SEO dostu meta tag'ler
- Görsel modal sistemi (büyük görüntüleme)

### Footer Projeler
- Tüm sayfalarda son 5 proje otomatik gösterilir

## 🔧 API Kullanımı (Sadece Okuma)

### Temel Okuma Operasyonları
```javascript
// Tüm projeler
const projects = await projectManager.loadProjects();

// Tek proje detayı
const project = await projectManager.loadProjectDetail(1);

// Proje medyaları
const media = await projectManager.loadProjectMedia(1);

// Sınırlı sayıda proje (performans için)
const limitedProjects = await projectManager.loadLimitedProjects(5);
```

### Arama ve Filtreleme
```javascript
// Projelde arama
const searchResults = projectManager.searchProjects('Su Üniversitesi');

// Proje istatistikleri
const stats = projectManager.getProjectStats();
console.log(`Toplam: ${stats.total}, Medya ile: ${stats.withMedia}`);
```

### AJAX Örneği (Verdiğiniz Format)
```javascript
// jQuery kullanarak projeler çekme
$.ajax({
    url: 'https://yrzhafgmqbkmxtudbjgq.supabase.co/rest/v1/projects?select=*',
    headers: {
        'apikey': 'your-api-key',
        'Authorization': 'Bearer your-api-key'
    },
    success: function(projects) {
        console.log('Projeler:', projects);
        // Sistem otomatik olarak HTML'e dönüştürür
    }
});
```

## ✨ Özellikler

### Dinamik İçerik (Read-Only)
- ✅ Supabase'den otomatik proje çekme
- ✅ Medya dosyaları desteği (görsel, video, döküman)
- ✅ Primary medya sistemi
- ✅ Responsive galeri görünümü
- ✅ Görsel modal (büyük görüntüleme)

### Performance Optimizasyonları
- ✅ Fallback sistem (hata durumunda)
- ✅ Sınırlı proje yükleme seçeneği
- ✅ Lazy loading hazır
- ✅ Error handling

### SEO & UX
- ✅ Dinamik meta tag'ler
- ✅ Responsive tasarım
- ✅ Keyboard navigation (ESC ile modal kapama)
- ✅ Proje sayacları ve istatistikler

## 🔐 Güvenlik

- Row Level Security (RLS) aktif
- Sadece okuma izinleri kullanılır
- Auth sisteminiz üzerinden güvenli erişim

## 📊 Desteklenen Medya Türleri

```javascript
// Görsel dosyaları
media_type: 'image' -> Otomatik galeri + modal

// Video dosyaları  
media_type: 'video' -> HTML5 video player

// Dökümanlar
media_type: 'document' -> İndirme linki
```

## 🛠️ Geliştirme

### URL Yapısı
- Proje listesi: `project/index.htm`
- Proje detayı: `project/project.html?id=PROJECT_ID`

### Özelleştirme
1. `assets/js/projects.js` dosyasında `ProjectManager` class'ını genişletin
2. CSS stilleri `project/project.html` içindeki style tag'inde
3. Yeni okuma fonksiyonları ekleyebilirsiniz

### Örnek Özelleştirme
```javascript
// Kategoriye göre projeler
async loadProjectsByCategory(category) {
    const response = await $.ajax({
        url: `${this.supabaseUrl}/rest/v1/projects?category=eq.${category}`,
        // ... headers
    });
    return response;
}
```

## 📞 Debug ve İzleme

### Console Log'ları
```javascript
// Detaylı log'lar için
console.log('Projeler yüklendi:', projectManager.projects);
console.log('Mevcut proje:', projectManager.currentProject);
```

### Hata Yönetimi
- Network tab'ında Supabase isteklerini inceleyin
- Console'da hata mesajlarını kontrol edin
- Fallback sistem otomatik devreye girer

## 🎯 Kullanım Senaryoları

### 1. Basit Proje Listesi
```javascript
// Sadece başlıkları göster
projectManager.loadLimitedProjects(5);
```

### 2. Detaylı Proje Galeri
```javascript
// Tüm medya ile birlikte
projectManager.loadProjectDetail(projectId);
```

### 3. Footer Güncellemesi
```javascript
// Otomatik footer güncellemesi
projectManager.updateFooters();
```

## 🔄 Migration Notları

Mevcut sisteminizden entegrasyon:
1. ✅ Veritabanı değişikliği yok
2. ✅ Sadece JavaScript dosyası ekleme
3. ✅ Mevcut HTML yapısı korunur
4. ✅ Admin panel ayrı sisteminizde kalır

---

**🔒 Not:** Bu sistem tamamen read-only'dir. Tüm yazma işlemleri (create, update, delete) sizin admin panelinizde yapılır. JavaScript sadece veri okuma ve görüntüleme ile sınırlıdır. 