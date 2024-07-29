const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  gender: { type: String },
  subCategory: { type: String},
  articleType: { type: String},
  usage: { type: String },
  productDisplayName: { type: String, required: true },
  image: { type: String, required: true },
  swipedCount: {type: Number, default:0 }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
