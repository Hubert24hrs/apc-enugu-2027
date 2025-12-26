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

            html += `
                <div class="news-card ${isFeatured ? 'featured' : ''}" data-category="${category}" style="background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); transition: all 0.3s ease; border-left: 4px solid ${category === 'breaking' ? '#dc3545' : '#00A859'}; margin-bottom: 1.25rem; padding: 1.25rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.875rem; gap: 0.75rem; flex-wrap: wrap;">
                        <span style="${categoryStyle} color: white; padding: 0.35rem 0.875rem; border-radius: 20px; font-weight: 600; font-size: 0.75rem; white-space: nowrap;">${this.formatCategory(category)}</span>
                        <div style="display: flex; gap: 0.75rem; font-size: 0.75rem; color: #888; flex-wrap: wrap;">
                            <span style="white-space: nowrap;"><i class="far fa-calendar"></i> ${item.pubDate}</span>
                            <span style="white-space: nowrap;"><i class="far fa-newspaper"></i> ${item.source || 'News'}</span>
                        </div>
                    </div>
                    <h3 style="color: #1a5f3c; margin: 0 0 0.75rem; font-size: clamp(1.05rem, 3vw, 1.25rem); line-height: 1.35; font-weight: 700; background: linear-gradient(135deg, #00A859 0%, #004B87 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; word-wrap: break-word;">${this.truncateText(item.title, 130)}</h3>
                    <p style="color: #555; line-height: 1.55; margin: 0 0 0.875rem; font-size: clamp(0.875rem, 2.5vw, 0.95rem); word-wrap: break-word;">${this.truncateText(item.description, 190)}</p>
                    <a href="${item.link}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 0.4rem; color: #00A859; font-weight: 600; text-decoration: none; transition: all 0.3s ease; font-size: 0.875rem; padding: 0.4rem 0; border-bottom: 2px solid transparent;">
                        Read Full Story <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
                    </a>
                </div>
            `;
        });

        // Add last updated info
        html += `
            <div style="text-align: center; padding: 1.25rem; color: #666; font-size: 0.875rem; background: #f8f9fa; border-radius: 12px; margin-top: 1rem;">
                <i class="fas fa-sync-alt"></i> Last updated: ${lastUpdated}
                <span style="margin-left: 1rem; color: #00A859; font-weight: 600;">● Live Feed Active</span>
            </div>
        `;

        this.newsContainer.innerHTML = html;

        // Add defensive CSS to force hide any images
        this.injectDefensiveStyles();
        this.reinitAnimations();
    }

    injectDefensiveStyles() {
        // Ensure no images appear in news cards - defensive CSS
        if (!document.querySelector('#news-defensive-styles')) {
            const style = document.createElement('style');
            style.id = 'news-defensive-styles';
            style.textContent = `
                .news-card img,
                .news-card .news-image,
                #liveNewsContainer img,
                #liveNewsContainer .news-image {
                    display: none !important;
                    height: 0 !important;
                    width:0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .news-card {
                    display: block !important;
                }
            `;
            document.head.appendChild(style);
        }
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
