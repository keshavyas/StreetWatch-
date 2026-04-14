const express = require('express');
const axios = require('axios');
const router = express.Router();
const { filterNews } = require('../utils/filter');

/**
 * @route   GET /api/news
 * @desc    Fetch incident-based local news from NewsData.io
 * @access  Public
 */
router.get('/news', async (req, res) => {
    try {
        const { state, city, area } = req.query;

        // Build location part of the query
        let locationQuery = '';
        if (city) locationQuery += `${city} `;
        if (area) locationQuery += `${area} `;
        if (state) locationQuery += `${state} `;

        // Incident keywords for API-level search
        const incidentKeywords = '(fire OR accident OR theft OR crime OR police OR alert)';
        
        const fullQuery = `${locationQuery.trim()} ${incidentKeywords}`.trim();
        
        const apiKey = process.env.NEWS_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ 
                success: false, 
                message: 'News API key is not configured on the server.' 
            });
        }

        // Add a primary fetch with a timeout
        let rawArticles = [];

        try {
            const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(fullQuery)}&country=in&language=en`;
            console.log(`Fetching news from: ${apiUrl.split('apikey=')[0]}apikey=***`);
            
            const response = await axios.get(apiUrl, { timeout: 10000 }); // 10s timeout
            if (response.data.status === 'success') {
                rawArticles = response.data.results || [];
            }
        } catch (error) {
            console.warn(`Primary news fetch failed (${error.message}). Attempting fallback query...`);
            
            try {
                // Fallback to a much simpler query (just the city name) if the primary one fails
                const fallbackUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(city || state)}&country=in&language=en`;
                const response = await axios.get(fallbackUrl, { timeout: 8000 });
                
                if (response.data.status === 'success') {
                    rawArticles = response.data.results || [];
                    console.log('Fallback news query successful.');
                }
            } catch (fallbackError) {
                console.error('All News API requests failed or timed out.');
                throw fallbackError; // Re-throw to be caught by the outer catch block
            }
        }

        // Filter and categorize the results
        const cleanArticles = filterNews(rawArticles);

        res.json(cleanArticles);

    } catch (error) {
        console.error('News API Error:', error.message);
        
        // Handle specific axios errors
        if (error.response) {
            return res.status(error.response.status).json({ 
                success: false, 
                message: error.response.data.message || 'External API Error' 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Server Error while fetching news' 
        });
    }
});

module.exports = router;
