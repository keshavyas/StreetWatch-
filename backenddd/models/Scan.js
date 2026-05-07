const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    incidents: [{
        timestamp: String,
        description: String,
        severity: String,
        confidence: Number
    }],
    dateTime: { type: Date, default: Date.now },
    location: { type: String, default: 'Indore' },
    status: { type: String, default: 'completed' },
    threatScore: { type: Number, default: 0 },
    type: { type: String, default: 'GENERAL' },
    photoUrl: { type: String, default: '' }
});


const Scan = mongoose.model('Scan', scanSchema);
module.exports = Scan;
