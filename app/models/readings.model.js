const mongoose = require('mongoose');

const ReadingsSchema = mongoose.Schema({
    sensorId: String,
    sensorIP: String,
    time: { type: Date, default: Date.now, index: true },
    co2: Number,
    temperature: Number,
    pressure: Number,
    humidity: Number
}, {
    versionKey: false
});

module.exports = mongoose.model('Readings', ReadingsSchema);