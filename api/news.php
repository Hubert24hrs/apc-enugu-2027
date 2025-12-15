<?php
/**
 * APC GAT 2027 Enugu - RSS News Fetcher
 * This script fetches news from Nigerian news RSS feeds and returns JSON
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// RSS Feed URLs - Nigerian news sources
$feeds = [
    'https://punchng.com/feed/',
    'https://www.vanguardngr.com/feed/',
    'https://dailypost.ng/feed/',
    'https://thenationonlineng.net/feed/'
];

// Keywords to filter political/APC news
$keywords = ['APC', 'Tinubu', 'Enugu', 'governor', 'senator', 'defection', 'Nigeria', 'political', 'election', '2027'];

function fetchRSSFeed($url) {
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'user_agent' => 'Mozilla/5.0 (compatible; APC News Bot)'
        ]
    ]);
    
    $content = @file_get_contents($url, false, $context);
    if ($content === false) {
        return [];
    }
    
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($content);
    if ($xml === false) {
        return [];
    }
    
    return $xml;
}

function extractNewsItems($xml, $keywords, $limit = 5) {
    $items = [];
    
    if (!isset($xml->channel->item)) {
        return $items;
    }
    
    foreach ($xml->channel->item as $item) {
        $title = (string) $item->title;
        $description = (string) $item->description;
        $link = (string) $item->link;
        $pubDate = (string) $item->pubDate;
        
        // Get image from media:content or enclosure
        $image = '';
        $namespaces = $item->getNameSpaces(true);
        
        if (isset($namespaces['media'])) {
            $media = $item->children($namespaces['media']);
            if (isset($media->content)) {
                $image = (string) $media->content->attributes()->url;
            }
        }
        
        if (empty($image) && isset($item->enclosure)) {
            $image = (string) $item->enclosure->attributes()->url;
        }
        
        // Check if news contains relevant keywords
        $text = strtolower($title . ' ' . $description);
        $isRelevant = false;
        
        foreach ($keywords as $keyword) {
            if (strpos($text, strtolower($keyword)) !== false) {
                $isRelevant = true;
                break;
            }
        }
        
        if ($isRelevant) {
            $items[] = [
                'title' => html_entity_decode($title, ENT_QUOTES, 'UTF-8'),
                'description' => strip_tags(html_entity_decode($description, ENT_QUOTES, 'UTF-8')),
                'link' => $link,
                'pubDate' => date('F j, Y', strtotime($pubDate)),
                'image' => $image,
                'source' => parse_url($link, PHP_URL_HOST)
            ];
        }
        
        if (count($items) >= $limit) {
            break;
        }
    }
    
    return $items;
}

// Fetch news from all feeds
$allNews = [];

foreach ($feeds as $feedUrl) {
    $xml = fetchRSSFeed($feedUrl);
    if (!empty($xml)) {
        $news = extractNewsItems($xml, $keywords, 3);
        $allNews = array_merge($allNews, $news);
    }
}

// Sort by date (newest first)
usort($allNews, function($a, $b) {
    return strtotime($b['pubDate']) - strtotime($a['pubDate']);
});

// Limit to 6 news items
$allNews = array_slice($allNews, 0, 6);

// Return JSON response
echo json_encode([
    'success' => true,
    'count' => count($allNews),
    'lastUpdated' => date('F j, Y g:i A'),
    'news' => $allNews
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
