const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StockSchema = new Schema({
    isAvailable: { type: Boolean, required: true },
    quantity: { type: Number, required: true }
});

module.exports = mongoose.model("Stock", StockSchema);