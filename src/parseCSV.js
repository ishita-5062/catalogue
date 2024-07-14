const fs = require('react-native-fs');
const Papa = require('papaparse');

const parseCSV = async () => {
  try {
    const csvPath = '../myntradataset/styles.csv'; // Adjust the path as per your setup
    const csvString = await fs.readFile(csvPath, 'utf8');

    return new Promise((resolve, reject) => {
      Papa.parse(csvString, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};

module.exports = { parseCSV };
