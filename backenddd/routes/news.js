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

        // Call NewsData.io
        // country=in for India, language=en
        const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(fullQuery)}&country=in&language=en`;
        
        const response = await axios.get(apiUrl);

        if (response.data.status !== 'success') {
            throw new Error(response.data.message || 'Error fetching news from provider');
        }

        // Filter and categorize the results
        const rawArticles = response.data.results || [];
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
