-- Supabase Projeler Tablosu Şeması
-- Bu kodu Supabase SQL editöründe çalıştırın

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    client VARCHAR(255),
    sector VARCHAR(255),
    area VARCHAR(255),
    display_order INTEGER DEFAULT 1,
    page_title VARCHAR(255),
    meta_description TEXT,
    content JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) ayarları
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Enable read access for all users" ON projects
    FOR SELECT USING (status = 'active');

-- Bu kod kullanıcının mevcut veritabanı yapısına uygun örnek veriler içerir
-- Önce bir test kullanıcısı olmalı (normalde Supabase Auth ile oluşturulur)

-- Test projelerini eklemek için örnek SQL
-- NOT: user_id değerini gerçek kullanıcı ID'niz ile değiştirin

-- Örnek projeler (user_id'yi gerçek değer ile değiştirin)
INSERT INTO public.projects (title, description, user_id) VALUES
('Su Üniversitesi', 'Modern eğitim kompleksi projesi. Teknoloji ve eğitim alanında öncü bir proje. Öğrencilerin en iyi koşullarda eğitim alabilmesi için tasarlanmış çağdaş mimari.', '12345678-1234-1234-1234-123456789012'),
('Schneider Schaumburg', 'Endüstriyel ofis konsolidasyonu projesi. Modern çalışma alanları ve teknolojik altyapı ile donatılmış kurumsal merkez.', '12345678-1234-1234-1234-123456789012'),
('Yönetim ve Toplantı Alanları', 'Kurumsal yönetim merkezi ve modern toplantı salonları. Teknoloji entegrasyonu ile donatılmış işlevsel alanlar.', '12345678-1234-1234-1234-123456789012'),
('Ecolab Lobi', 'Şirket lobisi yenileme projesi. Modern tasarım anlayışı ile konuk ağırlama alanları.', '12345678-1234-1234-1234-123456789012'),
('Yüksek Güvenlikli Alanlar & Veri Merkezleri', 'Kritik altyapı projeleri. Güvenlik ve teknoloji odaklı çoklu proje yönetimi.', '12345678-1234-1234-1234-123456789012');

-- Örnek medya dosyaları (proje ID'leri otomatik olarak atanacak)
-- Bu verileri projeler oluşturulduktan sonra ekleyin

-- Proje 1 medyaları (Su Üniversitesi)
INSERT INTO public.project_media (project_id, media_type, media_url, caption, is_primary, user_id) VALUES
(1, 'image', '/admin/wp-content/uploads/2018/05/millermiller-MM1_9166-nalco-ecolab-naperville-050916.jpg', 'Su Üniversitesi ana binası', true, '12345678-1234-1234-1234-123456789012'),
(1, 'image', '/admin/wp-content/uploads/2018/05/IMG_0144.jpg', 'İç mekan görünümü', false, '12345678-1234-1234-1234-123456789012'),
(1, 'image', '/admin/wp-content/uploads/2018/05/IMG_0165.jpg', 'Teknik alanlar', false, '12345678-1234-1234-1234-123456789012');

-- Proje 2 medyaları (Schneider Schaumburg)
INSERT INTO public.project_media (project_id, media_type, media_url, caption, is_primary, user_id) VALUES
(2, 'image', '/admin/wp-content/uploads/2018/05/IMG_0180.jpg', 'Schneider ofis alanları', true, '12345678-1234-1234-1234-123456789012'),
(2, 'image', '/admin/wp-content/uploads/2018/05/IMG_0195.jpg', 'Çalışma alanları', false, '12345678-1234-1234-1234-123456789012');

-- Proje 3 medyaları (Yönetim ve Toplantı Alanları)
INSERT INTO public.project_media (project_id, media_type, media_url, caption, is_primary, user_id) VALUES
(3, 'image', '/admin/wp-content/uploads/2018/05/IMG_0214.jpg', 'Toplantı salonları', true, '12345678-1234-1234-1234-123456789012'),
(3, 'image', '/admin/wp-content/uploads/2018/05/IMG_0215.jpg', 'Yönetim ofisleri', false, '12345678-1234-1234-1234-123456789012');

-- Proje 4 medyaları (Ecolab Lobi)
INSERT INTO public.project_media (project_id, media_type, media_url, caption, is_primary, user_id) VALUES
(4, 'image', '/admin/wp-content/uploads/2018/05/IMG_0229.jpg', 'Ecolab lobi alanı', true, '12345678-1234-1234-1234-123456789012');

-- Not: Gerçek kullanımda user_id değerleri Supabase Auth sistem tarafından otomatik olarak atanır
-- Bu örnekler test amaçlıdır, gerçek kullanıcı ID'lerinizi kullanın

-- Projekteki medya dosyalarının URL'lerini güncellemek için:
-- UPDATE public.project_media SET media_url = 'yeni_url' WHERE id = media_id;

-- İndeksler
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_slug ON projects(slug); 