/**
 * APC GAT 2027 Enugu - Dynamic News Loader
 * Fetches live news from RSS feeds via the PHP backend
 */

class APCNewsLoader {
    constructor() {
        this.apiUrl = 'api/news.php';
        this.newsContainer = document.getElementById('liveNewsContainer');
        this.loadingIndicator = null;
        this.init();
    }

    init() {
        if (this.newsContainer) {
            this.showLoading();
            this.fetchNews();
            // Auto-refresh every 30 minutes
            setInterval(() => this.fetchNews(), 30 * 60 * 1000);
        }
    }

    showLoading() {
        this.newsContainer.innerHTML = `
            <div class="news-loading" style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #00A859;"></i>
                <p style="margin-top: 1rem; color: #666;">Loading latest news...</p>
            </div>
        `;
    }

    async fetchNews() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();

            if (data.success && data.news.length > 0) {
                this.renderNews(data.news, data.lastUpdated);
            } else {
                this.showFallbackNews();
            }
        } catch (error) {
            console.log('RSS feed unavailable, showing static news');
            this.showFallbackNews();
        }
    }

    renderNews(newsItems, lastUpdated) {
        let html = '';

        newsItems.forEach((item, index) => {
            const isFeatured = index === 0;
            const category = this.detectCategory(item.title);
            const categoryStyle = this.getCategoryStyle(category);
            const defaultImage = `https://via.placeholder.com/400x250/00A859/ffffff?text=${encodeURIComponent(item.source || 'News')}`;

            html += `
                <div class="news-card ${isFeatured ? 'featured' : ''}" data-category="${category}">
                    <div class="news-image">
                        <img src="${item.image || defaultImage}" 
                             alt="${item.title}"
                             onerror="this.src='${defaultImage}'">
                        <span class="news-category" style="${categoryStyle}">${this.formatCategory(category)}</span>
                    </div>
                    <div class="news-content">
                        <div class="news-meta">
                            <span><i class="far fa-calendar"></i> ${item.pubDate}</span>
                            <span><i class="far fa-newspaper"></i> ${item.source || 'News'}</span>
                        </div>
                        <h3>${this.truncateText(item.title, 80)}</h3>
                        <p>${this.truncateText(item.description, 120)}</p>
                        <a href="${item.link}" target="_blank" rel="noopener" class="read-more">
                            Read Full Story <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            `;
        });

        // Add last updated info
        html += `
            <div style="grid-column: 1 / -1; text-align: center; padding: 1rem; color: #666; font-size: 0.9rem;">
                <i class="fas fa-sync-alt"></i> Last updated: ${lastUpdated}
                <span style="margin-left: 1rem; color: #00A859;">● Live Feed Active</span>
            </div>
        `;

        this.newsContainer.innerHTML = html;
        this.reinitAnimations();
    }

    detectCategory(title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('breaking') || titleLower.includes('defect') || titleLower.includes('crisis')) {
            return 'breaking';
        } else if (titleLower.includes('event') || titleLower.includes('rally') || titleLower.includes('meeting')) {
            return 'events';
        }
        return 'press';
    }

    getCategoryStyle(category) {
        switch (category) {
            case 'breaking': return 'background: #dc3545;';
            case 'events': return 'background: #6f42c1;';
            default: return 'background: #00A859;';
        }
    }

    formatCategory(category) {
        switch (category) {
            case 'breaking': return 'Breaking News';
            case 'events': return 'Event';
            default: return 'Press';
        }
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        text = text.replace(/<[^>]*>/g, '').trim();
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    showFallbackNews() {
        // If RSS fails, show the static news that's already in the HTML
        const staticNews = document.getElementById('newsGrid');
        if (staticNews && this.newsContainer) {
            this.newsContainer.innerHTML = staticNews.innerHTML;
        }
    }

    reinitAnimations() {
        const cards = this.newsContainer.querySelectorAll('.news-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Only initialize if the live news container exists
    if (document.getElementById('liveNewsContainer')) {
        new APCNewsLoader();
    }
});
