import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import axios from 'axios';
import { PieChart, BarChart} from 'react-native-chart-kit';

import ExcelDownloadButton from '../ExcelDownloadButton/ExcelDownloadButton';

const API_URL = 'http://10.0.2.2:3005/api/aggregated-swiped-count';
const screenWidth = Dimensions.get('window').width;

const Admin = () => {
  const [aggregatedData, setAggregatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAggregatedData();
  }, []);

  const fetchAggregatedData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      console.log(response);
      setAggregatedData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching aggregated data:", error);
      setError('An error occurred while fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPieChart = (data) => {
    const chartData = data.map((item, index) => ({
      name: item.gender,
      population: item.totalSwipedCount,
      color: COLORS[index % COLORS.length],
      legendFontColor: "#3e4152",
      legendFontSize: 12
    }));

    return (
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  };

  const renderBarChart = (data) => {
    const filteredData = data.filter(item => item.usage !== null);
    const chartData = {
      labels: filteredData.map(item => item.usage),
      datasets: [{
        data: filteredData.map(item => item.totalSwipedCount)
      }]
    };

    return (
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          ...chartConfig,
          colors: COLORS.map((color) => () => color)
        }}
        verticalLabelRotation={30}
        style={styles.barChart}
      />
    );
  };

  const renderBarChartSubCategoryTop = (data) => {
    const filteredData = data.filter(item => item.subCategory !== null);
    const sortedData = [...filteredData].sort((a, b) => b.totalSwipedCount - a.totalSwipedCount);
    const top5Data = sortedData.slice(0, 5);

    const chartData = {
      labels: top5Data.map(item => item.subCategory),
      datasets: [{
        data: top5Data.map(item => item.totalSwipedCount)
      }]
    };

    return (
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          ...chartConfig,
          colors: COLORS.slice(0, 5).map((color) => () => color)
        }}
        horizontal={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
        style={styles.barChart}
      />
    );
  };

  const renderBarChartSubCategoryBottom = (data) => {
    const filteredData = data.filter(item => item.subCategory !== null);
    const sortedData = [...filteredData].sort((a, b) => a.totalSwipedCount - b.totalSwipedCount);
    const bottom5Data = sortedData.slice(0, 5);

    const chartData = {
      labels: bottom5Data.map(item => item.subCategory),
      datasets: [{
        data: bottom5Data.map(item => item.totalSwipedCount)
      }]
    };

    return (
      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          ...chartConfig,
          colors: COLORS.slice(0, 5).map((color) => () => color)
        }}
        horizontal={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
        style={styles.barChart}
      />
    );
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ff3f6c" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }
//     console.log("The aggregated data is ", aggregatedData);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Analytics Dashboard</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Gender Distribution</Text>
          {renderPieChart(aggregatedData.byGender)}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Usage Distribution</Text>
          {renderBarChart(aggregatedData.byUsage)}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Top 5 Sub Categories </Text>
          {renderBarChartSubCategoryTop(aggregatedData.bySubCategory)}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Bottom 5 Sub Categories</Text>
          {renderBarChartSubCategoryBottom(aggregatedData.bySubCategory)}
        </View>

        <ExcelDownloadButton data={aggregatedData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const COLORS = ['#e91e63', '#f06292', '#ff5722', '#ff9800', '#ffc107']; // Shades of pink, orange, and yellow

 const chartConfig = {
   backgroundColor: '#f9f3f6', // Light pink background
   backgroundGradientFrom: '#f9f3f6',
   backgroundGradientTo: '#f9f3f6',
   decimalPlaces: 0,
   color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`, // Using a vibrant orange for text
   labelColor: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`, // Vibrant orange for labels
   style: {
     borderRadius: 10,
   },
   propsForDots: {
     r: '6',
     strokeWidth: '2',
     stroke: '#ff5722', // Vibrant orange for dots
   },
 };


// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f3f6', // Light pink background
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#e83e8c', // Myntra pink
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background for charts
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#e83e8c', // Myntra pink
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc3545', // Error color
    textAlign: 'center',
    fontSize: 16,
  },
  barChart: {
    marginVertical: 10,
    borderRadius: 10,
  },
});


export default Admin;