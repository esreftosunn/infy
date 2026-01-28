document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CMS Data Initialization ---

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

    // --- 2. Render Functions ---

    function escapeHtml(text) {
        if (!text) return text;
        return text.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderHero() {
        const wrapper = document.getElementById('hero-slider-wrapper');
        if (!wrapper) return;

        const slides = JSON.parse(localStorage.getItem('site_hero_slides'));
        wrapper.innerHTML = slides.map((slide, index) => {
            const isExternal = slide.btnLink.startsWith('http');
            const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

            return `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <img src="${slide.imageUrl}" alt="${escapeHtml(slide.title)}" class="slide-bg">
                <div class="slide-content container">
                    <span class="slide-subtitle" data-aos="fade-up">${escapeHtml(slide.subtitle)}</span>
                    <h1 class="slide-title" data-aos="fade-up" data-aos-delay="100">${escapeHtml(slide.title)}</h1>
                    <p class="slide-desc" data-aos="fade-up" data-aos-delay="200">${escapeHtml(slide.desc)}</p>
                    <a href="${slide.btnLink}" class="btn btn-primary slide-btn" data-aos="fade-up" data-aos-delay="300" ${targetAttr}>${escapeHtml(slide.btnText)}</a>
                </div>
            </div>
        `}).join('');

        // Re-init slider logic
        initSlider();
    }

    function renderReferences() {
        const marquee = document.getElementById('references-marquee');
        if (!marquee) return;

        const refs = JSON.parse(localStorage.getItem('site_references'));
        // Duplicate for infinite scroll
        const allRefs = [...refs, ...refs];

        marquee.innerHTML = allRefs.map(ref => `
            <span class="brand-logo">${escapeHtml(ref)}</span>
        `).join('');
    }

    function renderBlog() {
        const grid = document.getElementById('blog-grid-dynamic');
        if (!grid) return;

        const posts = JSON.parse(localStorage.getItem('site_blog_posts'));
        grid.innerHTML = posts.map((post, index) => `
            <article class="blog-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="blog-img">
                    <img src="${post.image}" alt="${escapeHtml(post.title)}">
                    <span class="blog-category">${escapeHtml(post.category)}</span>
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${escapeHtml(post.title)}</h3>
                    <p class="blog-excerpt">${escapeHtml(post.excerpt)}</p>
                    <a href="${post.link}" class="read-more">Devamını Oku <span>&rarr;</span></a>
                </div>
            </article>
        `).join('');
    }

    // --- 3. Run Rendering ---
    renderHero();
    renderReferences();
    renderBlog();

    // --- 4. Logic & Interactivity ---

    // AOS Init
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Slider Logic
    function initSlider() {
        const slides = document.querySelectorAll('.slide');
        const nextBtn = document.querySelector('.next-slide');
        const prevBtn = document.querySelector('.prev-slide');
        const indicatorsContainer = document.querySelector('.slider-indicators');
        let currentSlide = 0;
        let slideInterval;

        if (slides.length === 0) return;

        // Clear existing indicators
        if (indicatorsContainer) indicatorsContainer.innerHTML = '';

        // Create Indicators
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            if (indicatorsContainer) indicatorsContainer.appendChild(dot);
        });

        const indicators = document.querySelectorAll('.indicator');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');

            currentSlide = (index + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        if (nextBtn) nextBtn.onclick = () => {
            nextSlide();
            resetInterval();
        };

        if (prevBtn) prevBtn.onclick = () => {
            prevSlide();
            resetInterval();
        };

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        resetInterval();
    }

    // Counters & Header Logic
    const statsSection = document.getElementById('stats');
    const header = document.querySelector('.header');
    let counted = false;
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // --- Smart Header Logic ---
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling Down
            header.classList.add('header-hidden');
        } else {
            // Scrolling Up
            header.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop;

        // --- Stats Counter Logic ---
        if (!statsSection) return;
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !counted) {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-count');
                let count = 0;
                const speed = target / 100;

                const updateCounter = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count) + (counter.getAttribute('data-count') === '50' ? 'M+' : '+');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + (counter.getAttribute('data-count') === '50' ? 'M+' : '+');
                    }
                };
                updateCounter();
            });
            counted = true;
        }
    });

    // --- 5. Form Submission Logic ---
    const brandForm = document.getElementById('brandForm');
    const influencerForm = document.getElementById('influencerForm');

    if (brandForm) {
        brandForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const contactName = document.getElementById('brandContactName').value;
            const brandName = document.getElementById('brandName').value;
            const position = document.getElementById('brandPosition').value;
            const web = document.getElementById('brandWeb').value;
            const phone = document.getElementById('brandPhone').value;
            const email = document.getElementById('brandEmail').value;
            const goals = document.getElementById('brandGoals').value;

            const submission = {
                date: new Date().toISOString(),
                contactName,
                brandName,
                position,
                web,
                phone,
                email,
                goals,
                read: false
            };

            const existingData = JSON.parse(localStorage.getItem('brandSubmissions') || '[]');
            existingData.push(submission);
            localStorage.setItem('brandSubmissions', JSON.stringify(existingData));

            alert('Başvurunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.');
            brandForm.reset();
        });
    }

    if (influencerForm) {
        influencerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('infName').value;
            const social = document.getElementById('infSocial').value;
            const followers = document.getElementById('infFollowers').value;
            const category = document.getElementById('infCategory').value;
            const phone = document.getElementById('infPhone').value;
            const email = document.getElementById('infEmail').value;

            const submission = {
                date: new Date().toISOString(),
                name,
                social,
                followers,
                category,
                phone,
                email,
                read: false
            };

            const existingData = JSON.parse(localStorage.getItem('influencerSubmissions') || '[]');
            existingData.push(submission);
            localStorage.setItem('influencerSubmissions', JSON.stringify(existingData));

            alert('Başvurunuz başarıyla alındı! Değerlendirme sonrası dönüş yapacağız.');
            influencerForm.reset();
        });
    }

    // --- 6. Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Add active class to target pane
            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
});


