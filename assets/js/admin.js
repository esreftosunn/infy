// Infy Admin Panel Logic

document.addEventListener('DOMContentLoaded', () => {

    // Auth Check
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Simple authentication
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "Leodikya2026+-++";

    // Request Notification Permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Check if already logged in (session storage)
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        initDefaultData(); // Ensure data exists
        showDashboard();
        startPolling();
    }

    function initDefaultData() {
        // Default Data for Hero
        const defaultHeroSlides = [
            {
                imageUrl: "assets/img/slider-main.jpg?v=2",
                subtitle: "Berfu Yenenler ile Asra Pırlanta",
                title: "Doğru Dokunuş, Kalıcı Etki",
                desc: "Asra Pırlanta için Berfu Yenenler ile gerçekleştirdiğimiz iş birliği.",
                btnText: "Projeyi İncele",
                btnLink: "https://www.instagram.com/p/DRen9X0CEFd/"
            }
        ];

        // Default Data for References
        const defaultReferences = [
            "Asra Pırlanta", "Sigortayeri", "Viyana Kahvesi", "Getir", "Trendyol", "Yemeksepeti", "LC Waikiki", "Defacto", "Koton", "Mavi"
        ];

        // Default Data for Blog
        const defaultBlogPosts = [
            {
                image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop",
                category: "Platformlar",
                title: "TikTok mu, Instagram mı? Platform Dinamiklerini Anlamak",
                excerpt: "Her iki platformun kullanıcı demografisi ve içerik tüketim alışkanlıkları arasındaki kritik farklar.",
                link: "#"
            },
            {
                image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1000&auto=format&fit=crop",
                category: "Strateji",
                title: "Micro-Influencerların Yükselişi",
                excerpt: "Neden daha küçük takipçi kitleleri bazen markanız için devasa hesaplardan daha etkili olabilir?",
                link: "#"
            },
            {
                image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
                category: "İçerik",
                title: "Viral Olacak Reels Videoları Nasıl Çekilir?",
                excerpt: "İlk 3 saniye kuralı, trend müzikler ve algoritmayı tetikleyen kurgu teknikleri.",
                link: "#"
            },
            {
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
                category: "Bütçe",
                title: "Influencer Marketing ROI Analizi",
                excerpt: "Yatırımınızın karşılığını nasıl ölçersiniz? Temel metrikler ve başarı kriterleri.",
                link: "#"
            },
            {
                image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
                category: "Gelecek",
                title: "2024'te Bizi Bekleyen Sosyal Medya Trendleri",
                excerpt: "Yapay zeka influencerlar, canlı alışveriş yayınları ve daha fazlası.",
                link: "#"
            }
        ];

        // Load Initial Data if not exists (Versioned to force update)
        if (!localStorage.getItem('data_version_8')) {
            localStorage.setItem('site_hero_slides', JSON.stringify(defaultHeroSlides));
            localStorage.setItem('data_version_8', 'true');
        }

        if (!localStorage.getItem('site_references')) {
            localStorage.setItem('site_references', JSON.stringify(defaultReferences));
        }
        if (!localStorage.getItem('site_blog_posts')) {
            localStorage.setItem('site_blog_posts', JSON.stringify(defaultBlogPosts));
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('adminUsername').value;
        const pass = document.getElementById('adminPassword').value;

        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            initDefaultData(); // Ensure data exists
            showDashboard();
            startPolling();
            Notification.requestPermission();
        } else {
            alert('Hatalı kullanıcı adı veya şifre!');
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'index.html';
    });

    // Polling Logic
    let lastBrandCount = JSON.parse(localStorage.getItem('brandSubmissions') || '[]').length;
    let lastInfCount = JSON.parse(localStorage.getItem('influencerSubmissions') || '[]').length;

    function startPolling() {
        setInterval(() => {
            const currentBrand = JSON.parse(localStorage.getItem('brandSubmissions') || '[]');
            const currentInf = JSON.parse(localStorage.getItem('influencerSubmissions') || '[]');

            if (currentBrand.length > lastBrandCount) {
                notify("Yeni Marka Başvurusu!", `"${currentBrand[currentBrand.length - 1].brandName}" başvuru yaptı.`);
                lastBrandCount = currentBrand.length;
                loadData();
            }

            if (currentInf.length > lastInfCount) {
                notify("Yeni Influencer Başvurusu!", `"${currentInf[currentInf.length - 1].name}" başvuru yaptı.`);
                lastInfCount = currentInf.length;
                loadData();
            }
        }, 3000); // Check every 3 seconds
    }

    function notify(title, body) {
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        }
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        loadData();
    }

    // Tab Switching
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Data Loading
    function loadData() {
        renderBrandTable();
        renderInfluencerTable();
        renderSliderTable();
        renderReferenceTable();
        renderBlogTable();
    }

    // XSS Protection Helper
    function escapeHtml(text) {
        if (!text) return text;
        return text.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- RENDERERS ---

    function renderBrandTable() {
        const tbody = document.getElementById('brandTableBody');
        const data = JSON.parse(localStorage.getItem('brandSubmissions') || '[]');

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Henüz başvuru yok.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${new Date(item.date).toLocaleDateString("tr-TR")}</td>
                <td>${escapeHtml(item.contactName)}</td>
                <td>${escapeHtml(item.brandName)}</td>
                <td>${escapeHtml(item.position)}</td>
                <td>
                    ${escapeHtml(item.phone)}<br>
                    <small>${escapeHtml(item.email)}</small><br>
                    <small><a href="${escapeHtml(item.web)}" target="_blank" style="color:var(--color-primary)">Web</a></small>
                </td>
                <td>${escapeHtml(item.goals)}</td>
                <td><button class="delete-btn" data-action="delete" data-type="brandSubmissions" data-index="${index}">Sil</button></td>
            </tr>
        `).join('');
    }

    function renderInfluencerTable() {
        const tbody = document.getElementById('infTableBody');
        const data = JSON.parse(localStorage.getItem('influencerSubmissions') || '[]');

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Henüz başvuru yok.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${new Date(item.date).toLocaleDateString("tr-TR")}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>
                    <a href="${escapeHtml(item.social)}" target="_blank" style="color:var(--color-primary)">Link</a>
                </td>
                <td>${escapeHtml(item.followers)}</td>
                <td>${escapeHtml(item.category || '-')}</td>
                <td>
                    ${escapeHtml(item.phone)}<br>
                    <small>${escapeHtml(item.email)}</small>
                </td>
                <td><button class="delete-btn" data-action="delete" data-type="influencerSubmissions" data-index="${index}">Sil</button></td>
            </tr>
        `).join('');
    }

    function renderSliderTable() {
        const tbody = document.getElementById('sliderTableBody');
        const data = JSON.parse(localStorage.getItem('site_hero_slides') || '[]');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td><img src="${item.imageUrl}" style="height:50px; border-radius:5px;"></td>
                <td>${escapeHtml(item.title)} <br><small>${escapeHtml(item.subtitle)}</small></td>
                <td><button class="delete-btn" data-action="delete" data-type="site_hero_slides" data-index="${index}">Sil</button></td>
            </tr>
        `).join('');
    }

    function renderReferenceTable() {
        const tbody = document.getElementById('refTableBody');
        const data = JSON.parse(localStorage.getItem('site_references') || '[]');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td>${escapeHtml(item)}</td>
                <td><button class="delete-btn" data-action="delete" data-type="site_references" data-index="${index}">Sil</button></td>
            </tr>
        `).join('');
    }

    function renderBlogTable() {
        const tbody = document.getElementById('blogTableBody');
        const data = JSON.parse(localStorage.getItem('site_blog_posts') || '[]');
        tbody.innerHTML = data.map((item, index) => `
            <tr>
                <td><img src="${item.image}" style="height:50px; border-radius:5px;"></td>
                <td>${escapeHtml(item.title)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td><button class="delete-btn" data-action="delete" data-type="site_blog_posts" data-index="${index}">Sil</button></td>
            </tr>
        `).join('');
    }


    // --- MANAGERS ---

    // Slider Add
    const addSlideForm = document.getElementById('addSlideForm');
    if (addSlideForm) {
        addSlideForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = {
                title: document.getElementById('slideTitle').value,
                subtitle: document.getElementById('slideSubtitle').value,
                desc: document.getElementById('slideDesc').value,
                imageUrl: document.getElementById('slideImage').value,
                btnText: document.getElementById('slideBtnText').value,
                btnLink: document.getElementById('slideBtnLink').value,
            };
            const data = JSON.parse(localStorage.getItem('site_hero_slides') || '[]');
            data.push(newItem);
            localStorage.setItem('site_hero_slides', JSON.stringify(data));
            addSlideForm.reset();
            loadData();
            alert('Slide eklendi!');
        });
    }

    // Reference Add
    const addRefForm = document.getElementById('addRefForm');
    if (addRefForm) {
        addRefForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = document.getElementById('refName').value;
            const data = JSON.parse(localStorage.getItem('site_references') || '[]');
            data.push(newItem);
            localStorage.setItem('site_references', JSON.stringify(data));
            addRefForm.reset();
            loadData();
            alert('Referans eklendi!');
        });
    }

    // Blog Add
    const addBlogForm = document.getElementById('addBlogForm');
    if (addBlogForm) {
        addBlogForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = {
                title: document.getElementById('blogTitle').value,
                category: document.getElementById('blogCategory').value,
                image: document.getElementById('blogImage').value,
                excerpt: document.getElementById('blogExcerpt').value,
                link: "#"
            };
            const data = JSON.parse(localStorage.getItem('site_blog_posts') || '[]');
            data.push(newItem);
            localStorage.setItem('site_blog_posts', JSON.stringify(data));
            addBlogForm.reset();
            loadData();
            alert('Blog yazısı eklendi!');
        });
    }

    // Global Delete Delegation
    document.addEventListener('click', function (e) {
        // Find closest button with delete-btn class
        const btn = e.target.closest('.delete-btn');
        if (btn && btn.getAttribute('data-action') === 'delete') {
            const storageKey = btn.getAttribute('data-type');
            const index = parseInt(btn.getAttribute('data-index'));

            if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
                const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
                data.splice(index, 1);
                localStorage.setItem(storageKey, JSON.stringify(data));
                loadData();
            }
        }
    });

});
