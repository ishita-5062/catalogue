const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product'); // Adjust the path to where your Product model is located

const allowedFields = ['id', 'gender', 'subCategory', 'articleType', 'usage', 'productDisplayName', 'image'];

function filterFields(product) {
  return allowedFields.reduce((filteredProduct, field) => {
    if (product[field] !== undefined) {
      filteredProduct[field] = product[field];
    }
    return filteredProduct;
  }, {});
}

// Replace the following with your MongoDB connection string
const MONGO_URI = 'mongodb+srv://saachi2222:catalogue@cluster1.xlqon5w.mongodb.net/';

async function loadData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Read JSON file
    const filePath = path.join('../myntradataset/styles.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileData);

    const filteredProducts = products.map(filterFields);

    // Import data
    await Product.insertMany(filteredProducts);
    console.log('Data imported successfully');

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing data:', error);
    mongoose.connection.close();
  }
}

loadData();
