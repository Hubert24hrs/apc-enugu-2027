# APC GAT 2027 Website - News Management Guide

## How to Add New News Articles

### Step 1: Add Your News Image
1. Save your news image to the `assets/` folder
2. Use descriptive names: `news-[topic].jpg` or `news-[topic].png`
3. Recommended size: 400x250 pixels

### Step 2: Add News HTML
Copy this template and paste it inside `<div class="news-grid" id="newsGrid">`:

```html
<div class="news-card" data-category="breaking|press|events">
    <div class="news-image">
        <img src="assets/your-image.jpg" alt="News description">
        <span class="news-category" style="background: #dc3545;">Breaking</span>
    </div>
    <div class="news-content">
        <div class="news-meta">
            <span><i class="far fa-calendar"></i> December 15, 2025</span>
        </div>
        <h3>Your News Headline Here</h3>
        <p>Brief description of the news article...</p>
        <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
    </div>
</div>
```

### Category Options
- `data-category="breaking"` - Breaking news (red badge)
- `data-category="press"` - Press releases (green badge)
- `data-category="events"` - Events (purple badge)

### Category Badge Colors
```html
<!-- Breaking News (Red) -->
<span class="news-category" style="background: #dc3545;">Breaking</span>

<!-- Press Release (Green - default) -->
<span class="news-category">Press Release</span>

<!-- Events (Purple) -->
<span class="news-category" style="background: #6f42c1;">Event</span>
```

## Updating the Live News Ticker
Edit the ticker content in the `<div class="ticker-content">` section:

```html
<span>📢 Your breaking news headline here</span>
<span style="margin-left: 3rem;">📢 Another headline</span>
```

---

## Important Notes for Daily Updates

Since this is a **static HTML website**, news updates require manual editing of the `index.html` file. For automatic daily updates, you would need:

1. **Content Management System (CMS)** - Like WordPress
2. **Backend API** - Server that fetches news automatically
3. **RSS Feed Integration** - Pull news from external sources

For now, **manually update the news by editing index.html** following the instructions above.
