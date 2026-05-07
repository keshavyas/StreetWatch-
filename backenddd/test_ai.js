const AIService = require('./services/aiService');
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    console.log('Testing AI Service...');
    console.log('API Key:', process.env.ROBOFLOW_API_KEY ? 'Present' : 'Missing');
    
    // We can't really test with a real image here easily without a file, 
    // but we can check if the service initializes and if categorizePredictions works.
    
    const preds = [
        { class: 'fire', confidence: 0.9 },
        { class: 'car crash', confidence: 0.8 }
    ];
    
    const results = AIService.categorizePredictions(preds);
    console.log('Categorization results:', JSON.stringify(results, null, 2));
    
    if (results.fire.length > 0 && results.accident.length > 0) {
        console.log('Categorization works!');
    } else {
        console.log('Categorization FAILED');
    }
}

test();
