/**
 * Utility to filter and categorize news articles based on incident keywords.
 */

const INCIDENT_KEYWORDS = [
    'fire', 'accident', 'theft', 'robbery', 'crime', 'murder', 
    'violence', 'police', 'injured', 'crash', 'collision', 
    'burglary', 'arrest', 'shooting', 'assault', 'stolen',
    'security', 'attack', 'illegal', 'fraud', 'rape', 'killing'
];

const CATEGORIES = {
    FIRE: { label: 'Fire 🔥', keywords: ['fire'] },
    ACCIDENT: { label: 'Accident 🚗', keywords: ['accident', 'crash', 'collision'] },
    THEFT: { label: 'Theft 🕵️', keywords: ['theft', 'robbery', 'stealing', 'burglary', 'stolen'] },
    CRIME: { label: 'Crime 🚨', keywords: ['crime', 'murder', 'violence', 'police', 'arrest', 'shooting', 'assault'] },
    OTHER: { label: 'Other', keywords: [] }
};

const filterNews = (articles) => {
    if (!articles || !Array.isArray(articles)) return [];

    return articles
        .filter(article => {
            const content = `${article.title} ${article.description || ''}`.toLowerCase();
            return INCIDENT_KEYWORDS.some(keyword => content.includes(keyword));
        })
        .map(article => {
            const content = `${article.title} ${article.description || ''}`.toLowerCase();
            
            // Determine category
            let category = CATEGORIES.OTHER.label;
            for (const key in CATEGORIES) {
                if (key === 'OTHER') continue;
                if (CATEGORIES[key].keywords.some(kw => content.includes(kw))) {
                    category = CATEGORIES[key].label;
                    break;
                }
            }

            // Return clean response matching frontend expectations
            return {
                title: article.title,
                description: article.description || 'No description available.',
                url: article.link || '#',
                image: article.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop', // fallback news image
                urlToImage: article.image_url || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop', // frontend compatibility
                source: { name: article.source_id || 'Local News' },
                sourceName: article.source_id || 'Local News', // extra field just in case
                publishedAt: article.pubDate || new Date().toISOString(),
                category: category
            };
        });
};

module.exports = { filterNews };
