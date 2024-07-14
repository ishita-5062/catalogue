const fs = require('fs');
const path = require('path');

// Update this path to point to your Android assets directory
const imagesDir = path.join(__dirname, 'android/app/src/main/assets');
const outputFilePath = path.join(__dirname, 'android/app/src/main/assets/imageMap.js');

const generateImageMap = (dir) => {
  const files = fs.readdirSync(dir);
  const imageMap = {};

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      Object.assign(imageMap, generateImageMap(filePath));
    } else {
      const key = path.relative(imagesDir, filePath).replace(/\\/g, '/');
      imageMap[key] = `require('./${key}')`;
    }
  });

  return imageMap;
};

const imageMap = generateImageMap(imagesDir);

const jsContent = `export default ${JSON.stringify(imageMap, null, 2)};`;

fs.writeFileSync(outputFilePath, jsContent);
console.log('Image map generated successfully as JavaScript file.');
