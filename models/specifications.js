const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SpecificationsSchema = new Schema({
    memory: { type: String, required: true },
    memoryType: { type: String, required: true },
    GPUClockSpeed: { type: String, required: true },
    GPUBoostClockSpeed: { type: String, required: true },
});

module.exports = mongoose.model("Specifications", SpecificationsSchema);