// Supabase Proje Yönetimi - Sadece Okuma (Read-Only)
class ProjectManager {
    constructor() {
        this.supabaseUrl = 'https://yrzhafgmqbkmxtudbjgq.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyemhhZmdtcWJrbXh0dWRiamdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1ODIyMTgsImV4cCI6MjA2OTE1ODIxOH0.RsETlfoKgE2HMK8qU_8JEKNMn_MIKZrdZxD5DdH6wkk';
        this.projects = [];
        this.currentProject = null;
    }

    // Supabase'den projeler ve primary medyalarını çek
    async loadProjects() {
        try {
            // Önce sadece projeler çek (daha basit ve güvenli)
            const response = await $.ajax({
                url: `${this.supabaseUrl}/rest/v1/projects?select=*&order=created_at.desc`,
                method: 'GET',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            this.projects = response;
            console.log('Projeler yüklendi:', this.projects);
            
            // Her proje için medyalarını çek (is_primary yerine ilk medyayı al)
            if (this.projects && this.projects.length > 0) {
                for (let project of this.projects) {
                    try {
                        // is_primary filter'ını kaldır, sadece ilk medyayı al
                        const media = await $.ajax({
                            url: `${this.supabaseUrl}/rest/v1/project_media?project_id=eq.${project.id}&limit=1`,
                            method: 'GET',
                            headers: {
                                'apikey': this.supabaseKey,
                                'Authorization': `Bearer ${this.supabaseKey}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        project.project_media = media;
                        console.log(`✅ Proje ${project.id} medyası yüklendi:`, media.length, 'adet');
                    } catch (mediaError) {
                        console.warn(`❌ Proje ${project.id} için medya yüklenemedi:`, mediaError);
                        project.project_media = [];
                    }
                }
            }
            
            return this.projects;
        } catch (error) {
            console.error('Projeler yüklenirken hata:', error);
            
            // Daha basit fallback - sadece projeler
            try {
                const fallbackResponse = await $.ajax({
                    url: `${this.supabaseUrl}/rest/v1/projects?select=*&order=created_at.desc&limit=10`,
                    method: 'GET',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                this.projects = fallbackResponse;
                console.log('Fallback ile projeler yüklendi:', this.projects);
                return this.projects;
            } catch (fallbackError) {
                console.error('Fallback proje yükleme de başarısız:', fallbackError);
                // Test verisi döndür
                this.projects = this.getTestData();
                console.log('Test verisi kullanılıyor:', this.projects);
                return this.projects;
            }
        }
    }

    // Proje ID'sine göre tüm medyaları çek
    async loadProjectMedia(projectId) {
        try {
            console.log(`🔍 Proje ${projectId} için medyalar yükleniyor...`);
            
            const response = await $.ajax({
                url: `${this.supabaseUrl}/rest/v1/project_media?project_id=eq.${projectId}&order=uploaded_at.asc`,
                method: 'GET',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`✅ Proje ${projectId} için ${response.length} medya yüklendi`);
            return response;
        } catch (error) {
            console.error('Proje medyaları yüklenirken hata:', error);
            
            // Alternative order by kullan
            try {
                const response = await $.ajax({
                    url: `${this.supabaseUrl}/rest/v1/project_media?project_id=eq.${projectId}`,
                    method: 'GET',
                    headers: {
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`📷 Alternative query ile ${response.length} medya yüklendi`);
                return response;
            } catch (altError) {
                console.error('Alternative medya query de başarısız:', altError);
                return [];
            }
        }
    }

    // Belirli proje sayısı ile sınırlı projeler çek (performans için)
    async loadLimitedProjects(limit = 10) {
        try {
            const response = await $.ajax({
                url: `${this.supabaseUrl}/rest/v1/projects?select=*&order=created_at.desc&limit=${limit}`,
                method: 'GET',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response;
        } catch (error) {
            console.error('Sınırlı projeler yüklenirken hata:', error);
            return this.getTestData().slice(0, limit);
        }
    }

    // Test verisi (Supabase'e erişim olmadığında)
    getTestData() {
        return [
            {
                id: '550e8400-e29b-41d4-a716-446655440001',
                title: 'Su Üniversitesi',
                description: 'Modern eğitim kompleksi projesi. Teknoloji ve eğitim alanında öncü bir proje.',
                created_at: '2024-01-15T10:00:00Z',
                user_id: '12345678-1234-1234-1234-123456789012',
                project_media: [{
                    media_type: 'image',
                    media_url: '/admin/wp-content/uploads/2018/05/millermiller-MM1_9166-nalco-ecolab-naperville-050916.jpg',
                    caption: 'Su Üniversitesi ana binası',
                    is_primary: true
                }]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440002',
                title: 'Schneider Schaumburg',
                description: 'Endüstriyel ofis konsolidasyonu projesi. Modern çalışma alanları.',
                created_at: '2024-01-10T10:00:00Z',
                user_id: '12345678-1234-1234-1234-123456789012',
                project_media: [{
                    media_type: 'image',
                    media_url: '/admin/wp-content/uploads/2018/05/IMG_0180.jpg',
                    caption: 'Schneider ofis alanları',
                    is_primary: true
                }]
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440003',
                title: 'Yönetim ve Toplantı Alanları',
                description: 'Kurumsal yönetim merkezi ve modern toplantı salonları.',
                created_at: '2024-01-05T10:00:00Z',
                user_id: '12345678-1234-1234-1234-123456789012',
                project_media: [{
                    media_type: 'image',
                    media_url: '/admin/wp-content/uploads/2018/05/IMG_0214.jpg',
                    caption: 'Toplantı salonları',
                    is_primary: true
                }]
            }
        ];
    }

    // Proje listesi HTML'i oluştur (index.htm formatına uygun)
    generateProjectListHTML(projects) {
        if (!projects || projects.length === 0) {
            return '<li style="padding: 20px; text-align: center; color: #666;">Proje bulunamadı</li>';
        }

        return projects.map((project, index) => {
            // Primary medya URL'sini güvenli şekilde al
            const primaryMedia = project.project_media && project.project_media.length > 0 
                ? project.project_media[0] 
                : null;
            
            let imageUrl = '';
            if (primaryMedia && primaryMedia.media_url) {
                // URL'nin başında / varsa localhost'a göre düzelt
                imageUrl = primaryMedia.media_url.startsWith('/') 
                    ? primaryMedia.media_url 
                    : '/' + primaryMedia.media_url;
            } else {
                // Varsayılan resim
                imageUrl = '/admin/wp-content/uploads/2018/05/millermiller-MM1_9166-nalco-ecolab-naperville-050916.jpg';
            }
            
            console.log(`🖼️ Proje ${project.id} için image URL: ${imageUrl}`);
            
            return `
                <li class="projects__nav__item" data-id="${project.id}">
                    <a class="projects__nav__link" href="?id=${project.id}" data-ajax="false">
                        <div class="projects__nav__index">
                            <div class="projects__nav__index__txt">
                                ${String(index + 1).padStart(2, '0')}
                            </div>
                            <div class="projects__nav__index__line"></div>
                        </div>
                        <div class="projects__nav__infos">
                            <div class="projects__nav__infos__title">
                                ${project.title || 'Başlıksız Proje'}
                            </div>
                            ${project.description ? `
                            <div class="projects__nav__infos__description">
                                ${project.description}
                            </div>
                            ` : ''}
                            <ul class="projects__nav__infos__tags">
                                <li class="projects__nav__infos__tag">
                                    <div class="projects__nav__infos__tag__name">Oluşturulma</div>
                                    <div class="projects__nav__infos__tag__value">
                                        ${project.created_at ? new Date(project.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                                    </div>
                                </li>
                                ${project.user_id ? `
                                <li class="projects__nav__infos__tag">
                                    <div class="projects__nav__infos__tag__name">Proje ID</div>
                                    <div class="projects__nav__infos__tag__value">
                                        ${project.id.substring(0, 8)}...
                                    </div>
                                </li>
                                ` : ''}
                                ${primaryMedia ? `
                                <li class="projects__nav__infos__tag">
                                    <div class="projects__nav__infos__tag__name">Medya</div>
                                    <div class="projects__nav__infos__tag__value">
                                        ${project.project_media.length} ${project.project_media.length === 1 ? 'dosya' : 'dosya'}
                                    </div>
                                </li>
                                ` : ''}
                                <li class="projects__nav__infos__tag">
                                    <div class="projects__nav__infos__tag__name">Durum</div>
                                    <div class="projects__nav__infos__tag__value">
                                        Aktif
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </a>
                </li>
            `;
        }).join('');
    }

    // Footer proje linklerini oluştur (son 5 proje)
    generateFooterProjectLinks() {
        if (!this.projects || this.projects.length === 0) {
            return '';
        }

        return this.projects.slice(0, 5).map(project => 
            `<li class="footer__page__section">
                <a class="footer__page__section__title" href="project/project.html?id=${project.id}">
                    ${project.title}
                </a>
            </li>`
        ).join('');
    }

    // ID'ye göre proje getir
    getProjectById(id) {
        return this.projects.find(project => project.id == id);
    }

    // Proje listesi sayfasını dinamik yükle
    async loadProjectsPage() {
        await this.loadProjects();
        
        // Proje listesini güncelle
        const projectsList = $('#projects__nav__list');
        if (projectsList.length) {
            projectsList.html(this.generateProjectListHTML(this.projects));
        }

        // İlk projeyi varsayılan olarak seç
        if (this.projects.length > 0 && !this.currentProject) {
            this.currentProject = this.projects[0];
            $('[data-first-project-id]').attr('data-first-project-id', this.currentProject.id);
            $('[data-title]').attr('data-title', this.currentProject.title);
        }
    }

    // Footer'ları güncelle
    updateFooters() {
        const footerProjectSections = $('.footer__page__sections').filter(function() {
            return $(this).parent().attr('id') === 'footer__page--projects';
        });
        
        if (footerProjectSections.length) {
            footerProjectSections.html(this.generateFooterProjectLinks());
        }
    }

    // Tek proje detay sayfası için içerik yükle
    async loadProjectDetail(projectId) {
        await this.loadProjects();
        
        this.currentProject = this.getProjectById(projectId);
        
        if (!this.currentProject) {
            console.error('Proje bulunamadı:', projectId);
            return null;
        }

        // Sayfa title'ını güncelle
        document.title = this.currentProject.title + ' - Maman Corp';
        
        // Meta description'ı güncelle
        if (this.currentProject.description) {
            $('meta[name="description"]').attr('content', this.currentProject.description.substring(0, 155));
        }

        // Proje medyalarını yükle
        const media = await this.loadProjectMedia(projectId);
        this.currentProject.media = media;

        return this.currentProject;
    }

    // API bağlantısını test et
    async testSupabaseConnection() {
        try {
            console.log('🔍 Supabase bağlantısı test ediliyor...');
            console.log('📍 URL:', this.supabaseUrl);
            console.log('🔑 API Key (ilk 20 karakter):', this.supabaseKey.substring(0, 20) + '...');
            
            // Daha basit test query
            const response = await $.ajax({
                url: `${this.supabaseUrl}/rest/v1/projects?select=id&limit=1`,
                method: 'GET',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Supabase bağlantısı başarılı!', response);
            return true;
        } catch (error) {
            console.error('❌ Supabase bağlantı hatası:', error);
            console.error('📊 Hata detayları:', {
                status: error.status,
                statusText: error.statusText,
                responseText: error.responseText
            });
            return false;
        }
    }

    // Proje detay içeriği HTML'ini oluştur
    generateProjectDetailHTML(project) {
        if (!project) return '<div style="padding: 50px; text-align: center;"><h2>Proje bulunamadı</h2></div>';

        const media = project.media || [];
        const images = media.filter(m => m.media_type === 'image');
        const videos = media.filter(m => m.media_type === 'video');
        const documents = media.filter(m => m.media_type === 'document');
        
        return `
            <div class="project-detail">
                <div class="project-header">
                    <h1>${project.title}</h1>
                    ${project.description ? `<p class="project-description">${project.description}</p>` : ''}
                    <div class="project-meta">
                        <span class="project-date">Ekleme Tarihi: ${new Date(project.created_at || Date.now()).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>
                
                ${images.length > 0 ? `
                <div class="project-gallery">
                    <h3>Proje Görselleri (${images.length})</h3>
                    <div class="gallery-grid">
                        ${images.map(img => `
                            <div class="gallery-item" onclick="openImageModal('${img.media_url}', '${img.caption || project.title}')">
                                <img src="${img.media_url}" alt="${img.caption || project.title}" 
                                     style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                                     onerror="this.style.display='none';">
                                ${img.caption ? `<p class="image-caption">${img.caption}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${videos.length > 0 ? `
                <div class="project-videos">
                    <h3>Proje Videoları (${videos.length})</h3>
                    <div class="videos-grid">
                        ${videos.map(video => `
                            <div class="video-item">
                                <video controls style="width: 100%; border-radius: 8px;">
                                    <source src="${video.media_url}" type="video/mp4">
                                    Tarayıcınız video oynatmayı desteklemiyor.
                                </video>
                                ${video.caption ? `<p class="video-caption">${video.caption}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${documents.length > 0 ? `
                <div class="project-documents">
                    <h3>Proje Dökümanları (${documents.length})</h3>
                    <div class="documents-list">
                        ${documents.map(doc => `
                            <div class="document-item">
                                <a href="${doc.media_url}" target="_blank" style="text-decoration: none;">
                                    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                                        <span style="font-size: 2em;">📄</span>
                                        <div>
                                            <strong>${doc.caption || 'Döküman'}</strong>
                                            <br><small>Görüntülemek için tıklayın</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${media.length === 0 ? `
                <div style="padding: 40px; text-align: center; background: #f9f9f9; border-radius: 8px; margin-top: 20px;">
                    <p style="color: #666; font-size: 1.1em;">Bu proje için henüz medya dosyası eklenmemiş.</p>
                </div>
                ` : ''}
            </div>
            
            <!-- Görsel modal -->
            <div id="imageModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; cursor: pointer;" onclick="closeImageModal()">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 90%; max-height: 90%;">
                    <img id="modalImage" style="max-width: 100%; max-height: 100%; border-radius: 8px;">
                    <p id="modalCaption" style="color: white; text-align: center; margin-top: 10px;"></p>
                </div>
                <span style="position: absolute; top: 20px; right: 30px; color: white; font-size: 40px; cursor: pointer;">&times;</span>
            </div>
        `;
    }

    // Proje arama (başlık ve açıklamada)
    searchProjects(query) {
        if (!query || !this.projects) return this.projects;
        
        const lowercaseQuery = query.toLowerCase();
        return this.projects.filter(project => 
            project.title.toLowerCase().includes(lowercaseQuery) ||
            (project.description && project.description.toLowerCase().includes(lowercaseQuery))
        );
    }

    // Proje istatistikleri
    getProjectStats() {
        if (!this.projects) return null;
        
        const totalProjects = this.projects.length;
        const projectsWithMedia = this.projects.filter(p => p.project_media && p.project_media.length > 0).length;
        
        return {
            total: totalProjects,
            withMedia: projectsWithMedia,
            withoutMedia: totalProjects - projectsWithMedia
        };
    }
}

// Global proje manager instance
window.projectManager = new ProjectManager();

// Görsel modal fonksiyonları
window.openImageModal = function(src, caption) {
    document.getElementById('modalImage').src = src;
    document.getElementById('modalCaption').textContent = caption;
    document.getElementById('imageModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
};

window.closeImageModal = function() {
    document.getElementById('imageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
};

// Sayfa yüklendiğinde çalıştır
$(document).ready(function() {
    console.log('🚀 ProjectManager yükleniyor...');
    
    const currentPage = window.location.pathname;
    console.log('📄 Mevcut sayfa:', currentPage);
    
    // API bağlantısını test et
    projectManager.testSupabaseConnection().then(connected => {
        if (!connected) {
            console.warn('⚠️ Supabase bağlantısı başarısız, test verisi kullanılacak');
        }
    });
    
    // Proje ana sayfası
    if (currentPage.includes('project/index.htm') || currentPage.includes('project/project.html')) {
        console.log('📂 Proje sayfası tespit edildi');
        
        // URL parametresinden ID al
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        console.log('🔍 Proje ID:', projectId);
        
        if (projectId) {
            console.log('📱 Tek proje detay sayfası yükleniyor...');
            // Tek proje detay sayfası
            projectManager.loadProjectDetail(projectId).then(project => {
                if (project) {
                    console.log('✅ Proje detayı yüklendi:', project.title);
                    // Proje listesini yükle ve bu projeyi seçili yap
                    projectManager.loadProjectsPage();
                    // Proje detayını göster
                    $('#project-content').html(projectManager.generateProjectDetailHTML(project));
                } else {
                    console.error('❌ Proje bulunamadı');
                    $('#project-content').html('<div style="padding: 50px; text-align: center;"><h2>Proje bulunamadı</h2><p>Aradığınız proje mevcut değil.</p></div>');
                }
            });
        } else {
            console.log('📋 Proje listesi sayfası yükleniyor...');
            // Proje listesi sayfası
            projectManager.loadProjectsPage();
        }
    }
    
    // Tüm sayfalarda footer'ları güncelle
    console.log('🔄 Footer projeler güncelleniyor...');
    projectManager.loadProjects().then((projects) => {
        console.log('📊 Yüklenen proje sayısı:', projects ? projects.length : 0);
        projectManager.updateFooters();
    });
    
    // ESC tuşu ile modal'ı kapat
    $(document).keydown(function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
    
    console.log('✅ ProjectManager kurulumu tamamlandı');
}); 