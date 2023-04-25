const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SpecificationsSchema = new Schema({
    memory: { type: String, required: true },
    memoryType: { type: String, required: true },
    GPUClockSpeed: { type: String, required: true },
    GPUBoostClockSpeed: { type: String, required: true },
});

SpecificationsSchema.virtual("url").get(function () {
    return `catalog/${this.videoCard}/${this._id}`
});

module.exports = mongoose.model("Specifications", SpecificationsSchema);