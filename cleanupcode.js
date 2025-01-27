const fs = require('fs');
const https = require('https');
const http = require('http');

// Function to check if an image URL is valid
const checkImageURL = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (response) => {
      if (response.statusCode === 200) {
        resolve(true); // Image URL is valid
      } else {
        resolve(false); // Image URL is not valid
      }
    }).on('error', (err) => {
      resolve(false); // If there's an error, treat the image as invalid
    });
  });
};

// Function to clean up the JSON by removing products with invalid images
const cleanProductData = async (jsonData) => {
  const validProducts = [];
  
  for (let product of jsonData) {
    if (product.imageURL && await checkImageURL(product.imageURL)) {
      validProducts.push(product);
    }
  }

  return validProducts;
};

// Load the JSON data from a file
fs.readFile('classified-products.json', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const jsonData = JSON.parse(data);
  const cleanedData = await cleanProductData(jsonData);

  // Write the cleaned data back to a new JSON file
  fs.writeFile('cleaned_products.json', JSON.stringify(cleanedData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('File has been cleaned and saved!');
    }
  });
});
