import React from 'react';
import { Button, Platform, StyleSheet, TouchableOpacity, Text} from 'react-native';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';

const ExcelDownloadButton = ({ data }) => {
  const generateExcel = async () => {
    console.log('Generating Excel file...');
    console.log('Data:', JSON.stringify(data, null, 2));

    try {
      // Create workbook and worksheets
      const wb = XLSX.utils.book_new();

      // Process byGender data
      if (data.byGender && Array.isArray(data.byGender)) {
        const wsGender = XLSX.utils.json_to_sheet(data.byGender);
        XLSX.utils.book_append_sheet(wb, wsGender, "By Gender");
      }

      // Process bySubCategory data
      if (data.bySubCategory && Array.isArray(data.bySubCategory)) {
        const wsSubCategory = XLSX.utils.json_to_sheet(data.bySubCategory);
        XLSX.utils.book_append_sheet(wb, wsSubCategory, "By SubCategory");
      }

      if (data.byUsage && Array.isArray(data.byUsage)) {
        const wsUsage = XLSX.utils.json_to_sheet(data.byUsage);
        XLSX.utils.book_append_sheet(wb, wsUsage, "By Usage");
      }


      // Generate buffer
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      // Define file path
      const filePath = `${RNFS.DownloadDirectoryPath}/aggregated_data.xlsx`;

      // Write file
      try {
        await RNFS.writeFile(filePath, wbout, 'base64');

        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
          console.log(`Excel file successfully saved to ${filePath}`);
        } else {
          console.log('File was not saved successfully');
        }
      } catch (error) {
        console.error('Error writing file:', error);
      }
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };

  const handleDownload = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await generateExcel();
        } else {
          console.log('Storage permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      await generateExcel();
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleDownload}>
      <Text style={styles.buttonText}>Download Excel</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff3f6c', // Myntra's primary pink color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default ExcelDownloadButton;