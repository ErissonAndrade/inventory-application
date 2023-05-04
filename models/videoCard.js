const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VideoCardSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    specifications: { type: Schema.Types.ObjectId, ref: "Specifications", required: true},
    stock: { type: Schema.Types.ObjectId, ref: "Stock", required: true },
    price: { type: Number }
});

VideoCardSchema.virtual("url").get(function() {
    return `/video-cards/${this.id}`;
});

VideoCardSchema.virtual("title").get(function () {
    return `${this.manufacturer} ${this.model}`
});

module.exports = mongoose.model("VideoCards", VideoCardSchema);

