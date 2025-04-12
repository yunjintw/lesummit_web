// 語言設定
let currentLang = 'zh-TW';
const translations = {
    'zh-TW': {
        'nav.home': '首頁',
        'nav.about': '關於我們',
        'nav.products': '產品',
        'nav.news': '新聞',
        'hero.title': '歡迎來到 Le Summit',
        'hero.subtitle': '專業的工業解決方案提供商',
        'products.title': '精選產品',
        'news.title': '最新消息',
        'footer.contact': '聯絡資訊',
        'footer.social': '社群媒體',
        'footer.copyright': '© 2024 Le Summit Industrial Co., Ltd. All rights reserved.'
    },
    'en': {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.products': 'Products',
        'nav.news': 'News',
        'hero.title': 'Welcome to Le Summit',
        'hero.subtitle': 'Professional Industrial Solutions Provider',
        'products.title': 'Featured Products',
        'news.title': 'Latest News',
        'footer.contact': 'Contact Information',
        'footer.social': 'Social Media',
        'footer.copyright': '© 2024 Le Summit Industrial Co., Ltd. All rights reserved.'
    }
};

// 載入語言檔案
async function loadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        translations[lang] = data;
        updatePageLanguage(lang);
    } catch (error) {
        console.error('Error loading translations:', error);
        // 如果載入失敗，使用預設語言
        if (lang !== 'zh-TW') {
            loadTranslations('zh-TW');
        }
    }
}

// 初始化語言
async function initLanguage() {
    await loadTranslations('zh-TW');
    await loadTranslations('en-US');
    updatePageLanguage(currentLang);
}

// 切換語言
function switchLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        updatePageLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
    }
}

// 更新頁面語言
function updatePageLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[lang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = key;
                break;
            }
        }
        
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
            element.placeholder = value;
        } else {
            element.textContent = value;
        }
    });
}

// 產品頁面功能
function initProductPage() {
    const productGrid = document.querySelector('.product-grid');
    const categoryButtons = document.querySelectorAll('.category-filter button');
    
    if (productGrid && categoryButtons.length > 0) {
        // 載入產品資料
        loadProducts();
        
        // 綁定分類按鈕事件
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                filterProducts(category);
            });
        });
    }
}

// 新聞頁面功能
function initNewsPage() {
    const newsGrid = document.querySelector('.news-grid');
    const categoryButtons = document.querySelectorAll('.news-filter button');
    const archiveList = document.querySelector('.archive-list');
    
    if (newsGrid && categoryButtons.length > 0) {
        // 載入新聞資料
        loadNews();
        
        // 綁定分類按鈕事件
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                filterNews(category);
            });
        });
    }
    
    if (archiveList) {
        // 初始化新聞封存功能
        initNewsArchive();
    }
}

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    
    // 根據當前頁面初始化相應功能
    if (window.location.pathname.includes('products.html')) {
        initProductPage();
    } else if (window.location.pathname.includes('news.html')) {
        initNewsPage();
    }
    
    // 綁定語言切換按鈕事件
    const langButtons = document.querySelectorAll('.lang-selector button');
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
});

// 載入產品資料
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        products = data;
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // 顯示錯誤訊息給用戶
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = '<p class="error-message">無法載入產品資料，請稍後再試。</p>';
        }
    }
}

// 渲染產品列表
function renderProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => renderProductCard(product)).join('');
}

// 圖片載入錯誤處理
function handleImageError(img) {
    console.error('圖片載入失敗:', img.src);
    img.onerror = null; // 防止無限循環
    img.src = 'images/placeholder.jpg';
    img.alt = '圖片載入失敗';
}

// 產品卡片渲染函數
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="images/products/${product.image}" 
                 alt="${product.name}" 
                 onerror="handleImageError(this)">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button class="btn-details" data-id="${product.id}">查看詳情</button>
        </div>
    `;
    return card;
}

// 過濾產品
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// 載入新聞資料
async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        news = data;
        displayNews();
    } catch (error) {
        console.error('Error loading news:', error);
        // 顯示錯誤訊息給用戶
        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid) {
            newsGrid.innerHTML = '<p class="error-message">無法載入新聞資料，請稍後再試。</p>';
        }
    }
}

// 渲染新聞列表
function renderNews(news) {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    newsGrid.innerHTML = news.map(item => renderNewsCard(item)).join('');
}

// 新聞卡片渲染函數
function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
        <div class="news-image">
            <img src="images/news/${news.image}" 
                 alt="${news.title}" 
                 onerror="handleImageError(this)">
        </div>
        <div class="news-content">
            <h3>${news.title}</h3>
            <p class="news-date">${news.date}</p>
            <p class="news-excerpt">${news.excerpt}</p>
            <button class="btn-read-more" data-id="${news.id}">閱讀更多</button>
        </div>
    `;
    return card;
}

// 過濾新聞
function filterNews(category) {
    const news = document.querySelectorAll('.news-card');
    news.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 初始化新聞封存功能
function initNewsArchive() {
    const archiveList = document.querySelector('.archive-list');
    if (!archiveList) return;

    // 這裡可以添加封存列表的初始化邏輯
    // 例如：載入歷史新聞、按年月分組等
}

// 語言切換功能
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            changeLanguage(selectedLanguage);
        });
    }

    // 產品頁面功能
    if (document.querySelector('.products-grid')) {
        loadProducts();
        setupProductFilters();
    }

    // 新聞頁面功能
    if (document.querySelector('.news-grid')) {
        loadNews();
        setupNewsFilters();
        setupArchiveFilters();
    }
    
    // 初始化模態框
    initModal();
});

// 語言切換函數
function changeLanguage(language) {
    console.log(`切換語言為: ${language}`);
    // 這裡將實現多語言切換邏輯
    // 實際應用中，這裡會載入對應語言的翻譯檔案
}

// 模態框功能
function createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div class="modal-header"></div>
            <div class="modal-body"></div>
            <div class="modal-footer"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function showModal(content) {
    const modal = document.querySelector('.modal') || createModal();
    const header = modal.querySelector('.modal-header');
    const body = modal.querySelector('.modal-body');
    const footer = modal.querySelector('.modal-footer');
    
    header.innerHTML = content.title || '';
    body.innerHTML = content.body || '';
    footer.innerHTML = content.footer || '';
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 添加動畫效果
    modal.querySelector('.modal-content').classList.add('scale-in');
}

function hideModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.querySelector('.modal-content').classList.remove('scale-in');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// 產品詳情模態框
function showProductDetails(product) {
    const content = {
        title: `<h2>${product.name}</h2>`,
        body: `
            <div class="product-details">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <p class="product-description">${product.description}</p>
                    <div class="product-specs">
                        <h3>產品規格</h3>
                        <ul>
                            ${product.specifications.map(spec => `<li>${spec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `,
        footer: `
            <button class="btn btn-primary" onclick="contactSales('${product.id}')">聯絡銷售</button>
        `
    };
    showModal(content);
}

// 新聞詳情模態框
function showNewsDetails(news) {
    const content = {
        title: `<h2>${news.title}</h2>`,
        body: `
            <div class="news-details">
                <div class="news-meta">
                    <span class="news-date">${news.date}</span>
                    <span class="news-category">${news.category}</span>
                </div>
                <img src="${news.image}" alt="${news.title}" class="news-image">
                <div class="news-content">
                    ${news.content}
                </div>
            </div>
        `,
        footer: `
            <button class="btn btn-secondary" onclick="hideModal()">關閉</button>
        `
    };
    showModal(content);
}

// 動畫效果
function addAnimationClasses() {
    // 為導航欄添加動畫
    const nav = document.querySelector('nav');
    if (nav) nav.classList.add('fade-in');
    
    // 為 hero 區域添加動畫
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('fade-in');
        hero.querySelector('h1')?.classList.add('slide-up');
        hero.querySelector('p')?.classList.add('slide-up');
    }
    
    // 為產品卡片添加動畫
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // 為新聞卡片添加動畫
    document.querySelectorAll('.news-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    // 初始化動畫
    addAnimationClasses();
    
    // 模態框關閉按鈕
    document.querySelector('.close-button')?.addEventListener('click', hideModal);
    
    // 點擊模態框外部關閉
    document.querySelector('.modal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal();
        }
    });
    
    // ESC 鍵關閉模態框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModal();
        }
    });
});

function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按鈕的 active 類
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加當前按鈕的 active 類
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

function setupNewsFilters() {
    const filterButtons = document.querySelectorAll('.news-categories .category-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按鈕的 active 類
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加當前按鈕的 active 類
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterNews(category);
        });
    });
}

function setupArchiveFilters() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    const archiveList = document.querySelector('.archive-list');
    
    if (!yearSelect || !monthSelect || !archiveList) return;

    // 模擬存檔新聞數據
    const archiveNews = [
        { id: 1, title: '2024年3月 - Le Summit 推出新一代自動化控制系統', date: '2024-03-15' },
        { id: 2, title: '2024年3月 - Le Summit 參加 2024 台北國際自動化工業展', date: '2024-03-10' },
        { id: 3, title: '2024年3月 - Le Summit 與日本合作夥伴簽署戰略合作協議', date: '2024-03-05' },
        { id: 4, title: '2024年2月 - 工業 4.0 趨勢下的自動化發展方向', date: '2024-02-28' },
        { id: 5, title: '2024年2月 - Le Summit 榮獲 2024 年度創新企業獎', date: '2024-02-20' },
        { id: 6, title: '2024年2月 - 精密機械產業發展趨勢分析', date: '2024-02-15' },
        { id: 7, title: '2023年12月 - Le Summit 年度回顧與展望', date: '2023-12-30' },
        { id: 8, title: '2023年11月 - Le Summit 參加德國漢諾威工業展', date: '2023-11-15' },
        { id: 9, title: '2023年10月 - Le Summit 推出新一代感測器產品', date: '2023-10-20' }
    ];

    // 渲染存檔新聞
    renderArchiveNews(archiveNews);

    // 添加篩選事件
    yearSelect.addEventListener('change', filterArchiveNews);
    monthSelect.addEventListener('change', filterArchiveNews);

    function filterArchiveNews() {
        const selectedYear = yearSelect.value;
        const selectedMonth = monthSelect.value;
        
        const filteredNews = archiveNews.filter(item => {
            const date = new Date(item.date);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString();
            
            if (selectedYear !== year) return false;
            if (selectedMonth !== 'all' && selectedMonth !== month) return false;
            
            return true;
        });
        
        renderArchiveNews(filteredNews);
    }

    function renderArchiveNews(news) {
        archiveList.innerHTML = '';
        
        if (news.length === 0) {
            archiveList.innerHTML = '<p>沒有找到符合條件的新聞</p>';
            return;
        }
        
        const ul = document.createElement('ul');
        
        news.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-id="${item.id}">${item.title}</a>`;
            ul.appendChild(li);
        });
        
        archiveList.appendChild(ul);
        
        // 添加點擊事件
        const links = archiveList.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const newsId = this.dataset.id;
                showNewsDetails(newsId);
            });
        });
    }
}

// 新聞數據
const news = [
    {
        id: 1,
        title: "頂盛實業推出新一代切割工具系列",
        titleEn: "LE SUMMIT Launches New Generation of Cutting Tools",
        titleZh: "顶盛实业推出新一代切割工具系列",
        category: "product",
        date: "2024-03-15",
        image: "images/news/news1.jpg",
        description: "我們很高興地宣布推出新一代切割工具系列，包括改進的圓刀切割器和新型透明切割墊。這些產品採用創新設計，提供更好的切割體驗。",
        descriptionEn: "We are excited to announce the launch of our new generation of cutting tools, including improved circle cutters and new transparent cutting mats. These products feature innovative designs for better cutting experience.",
        descriptionZh: "我们很高兴地宣布推出新一代切割工具系列，包括改进的圆刀切割器和新型透明切割垫。这些产品采用创新设计，提供更好的切割体验。",
        content: "新一代切割工具系列採用最新材料技術，提供更精確的切割效果。圓刀切割器新增可調節壓力功能，透明切割墊則採用特殊防刮材質，延長使用壽命。",
        contentEn: "The new generation of cutting tools uses the latest material technology to provide more precise cutting results. The circle cutter features adjustable pressure, while the transparent cutting mat uses special anti-scratch material for extended durability.",
        contentZh: "新一代切割工具系列采用最新材料技术，提供更精确的切割效果。圆刀切割器新增可调节压力功能，透明切割垫则采用特殊防刮材质，延长使用寿命。"
    },
    {
        id: 2,
        title: "頂盛實業參加2024台北國際工具展",
        titleEn: "LE SUMMIT to Participate in 2024 Taipei International Tools Exhibition",
        titleZh: "顶盛实业参加2024台北国际工具展",
        category: "event",
        date: "2024-02-20",
        image: "images/news/news2.jpg",
        description: "我們將於2024年台北國際工具展展示最新產品系列，歡迎參觀我們的展位。",
        descriptionEn: "We will showcase our latest product line at the 2024 Taipei International Tools Exhibition. Welcome to visit our booth.",
        descriptionZh: "我们将在2024年台北国际工具展展示最新产品系列，欢迎参观我们的展位。",
        content: "展會期間，我們將展示全系列切割工具，並提供現場產品演示和技術諮詢。",
        contentEn: "During the exhibition, we will showcase our full range of cutting tools and provide on-site product demonstrations and technical consultations.",
        contentZh: "展会期间，我们将展示全系列切割工具，并提供现场产品演示和技术咨询。"
    },
    {
        id: 3,
        title: "新型壓克力尺系列上市",
        titleEn: "New Acrylic Ruler Series Now Available",
        titleZh: "新型压克力尺系列上市",
        category: "product",
        date: "2024-01-10",
        image: "images/news/news3.jpg",
        description: "我們推出新型壓克力尺系列，採用高品質材料，提供更精確的測量和切割體驗。",
        descriptionEn: "We have launched our new acrylic ruler series, using high-quality materials to provide more precise measurement and cutting experience.",
        descriptionZh: "我们推出新型压克力尺系列，采用高品质材料，提供更精确的测量和切割体验。",
        content: "新型壓克力尺採用特殊防刮材質，刻度清晰，適合各種精密切割需求。",
        contentEn: "The new acrylic rulers feature special anti-scratch material and clear markings, suitable for various precision cutting needs.",
        contentZh: "新型压克力尺采用特殊防刮材质，刻度清晰，适合各种精密切割需求。"
    }
];

// 移除訂閱相關功能
function handleSubscription(event) {
    event.preventDefault();
    // 移除訂閱功能
}

// 產品數據
const products = [
    {
        id: 1,
        name: "超大型切割墊",
        nameEn: "Extra Large Cutting Mat",
        category: "cutting-mats",
        description: "大尺寸切割墊，適合大型作品製作",
        descriptionEn: "Large size cutting mat, perfect for big projects",
        image: "images/products/cutting-mat-xl.jpg",
        features: ["防滑底層", "自癒合表面", "網格刻度"]
    },
    {
        id: 2,
        name: "透明切割墊",
        nameEn: "Transparent Cutting Mat",
        category: "cutting-mats",
        description: "透明材質，方便對齊和定位",
        descriptionEn: "Transparent material for easy alignment",
        image: "images/products/cutting-mat-transparent.jpg",
        features: ["高透明度", "防刮表面", "精確刻度"]
    },
    {
        id: 3,
        name: "圓刀切割器",
        nameEn: "Circle Cutter",
        category: "blades",
        description: "專業圓形切割工具",
        descriptionEn: "Professional circle cutting tool",
        image: "images/products/circle-cutter.jpg",
        features: ["可調節半徑", "精確切割", "防滑握把"]
    },
    {
        id: 4,
        name: "圓刀",
        nameEn: "Rotary Blade",
        category: "blades",
        description: "旋轉式切割刀片",
        descriptionEn: "Rotary cutting blade",
        image: "images/products/rotary-blade.jpg",
        features: ["鋒利耐用", "更換方便", "多種尺寸"]
    },
    {
        id: 5,
        name: "筆刀",
        nameEn: "Design Knife",
        category: "blades",
        description: "精密設計切割刀",
        descriptionEn: "Precision design knife",
        image: "images/products/design-knife.jpg",
        features: ["精密控制", "人體工學設計", "可換刀片"]
    },
    {
        id: 6,
        name: "切割尺",
        nameEn: "Ruler & Cutter",
        category: "rulers",
        description: "結合尺和切割功能的工具",
        descriptionEn: "Combined ruler and cutting tool",
        image: "images/products/ruler-cutter.jpg",
        features: ["防滑設計", "精確刻度", "一體成型"]
    },
    {
        id: 7,
        name: "大型切割尺",
        nameEn: "Slide Cutter",
        category: "rulers",
        description: "大尺寸滑動式切割尺",
        descriptionEn: "Large size slide cutting ruler",
        image: "images/products/slide-cutter.jpg",
        features: ["滑動順暢", "穩固耐用", "多用途設計"]
    },
    {
        id: 8,
        name: "拼布尺",
        nameEn: "Quilting Ruler",
        category: "rulers",
        description: "專業拼布製作尺",
        descriptionEn: "Professional quilting ruler",
        image: "images/products/quilting-ruler.jpg",
        features: ["特殊角度", "防滑設計", "清晰刻度"]
    },
    {
        id: 9,
        name: "壓克力尺",
        nameEn: "Acrylic Ruler",
        category: "rulers",
        description: "透明壓克力材質尺",
        descriptionEn: "Transparent acrylic ruler",
        image: "images/products/acrylic-ruler.jpg",
        features: ["高透明度", "耐磨損", "精確刻度"]
    }
]; 