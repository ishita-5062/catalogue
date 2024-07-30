import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { FIREBASE_AUTH } from '../../../firebaseAuth';

const Streak = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) throw new Error('No user logged in');

        const response = await axios.get(`http://10.0.2.2:3001/api/users/${user.uid}`);
        console.log("Data received", response.data.swipeStreak);
        setStreak(response.data.swipeStreak); // Update with actual data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const getStreakMessage = () => {
    if (streak === 0) return "Find your fashion type and start your streak!";
    if (streak <= 5) return "Keep going! You're on your way to some great rewards!";
    if (streak <= 10) return "Great job! You're building a solid streak!";
    if (streak <= 50) return "Awesome! You're a streak champion!";
    return "Incredible! You're a streak master!";
  };

  const coupons = [
    { id: 1, text: 'Cashback of upto ₹10 for streak - 5 or above', threshold: 5, amount: 10 },
    { id: 2, text: 'Cashback of upto ₹50 for streak - 15 or above', threshold: 15, amount: 50 },
    { id: 3, text: 'Cashback of upto ₹100 for streak - 50 or above', threshold: 50, amount: 100 },
    { id: 4, text: 'Discount of 10% for streak - 20 or above', threshold: 20, amount: 10 },
    { id: 5, text: 'Discount of 20% for streak - 30 or above', threshold: 30, amount: 20 },
    { id: 6, text: 'Cashback of upto ₹200 for streak - 75 or above', threshold: 75, amount: 200 },
    { id: 7, text: 'Exclusive offer for streak - 100 or above', threshold: 100, amount: 300 },
    { id: 8, text: 'Free delivery on orders for streak - 40 or above', threshold: 40, amount: 0 },
    { id: 9, text: 'Buy one get one free for streak - 60 or above', threshold: 60, amount: 0 },
  ];

  const getCouponStyle = (available) => ({
    backgroundColor: available ? '#f7e1e2' : '#7e7e7e',
    color: available ? 'black' : 'white'
  });

  const handleCouponPress = (coupon) => {
    // Handle the coupon press event, e.g., show details, apply coupon, etc.
    alert(`Coupon Applied: ${coupon.text}`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.mainContent}>
        <View style={styles.streakContainer}>
          <Image source={require('../../../assets/images/flame.png')} style={styles.logo} />
          <Text style={styles.streakNumber}>{streak}</Text>
        </View>
        <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
        <Text style={styles.header}>Available Coupons</Text>
        <ScrollView contentContainerStyle={styles.couponsContainer}>
          {coupons.map(coupon => {
            const available = streak >= coupon.threshold;
            return (
              <TouchableOpacity
                key={coupon.id}
                style={[
                  styles.coupon,
                  { backgroundColor: available ? '#f7e1e2' : '#7e7e7e' }
                ]}
                onPress={() => handleCouponPress(coupon)}
                disabled={!available}
              >
                <Text
                  style={[
                    styles.couponText,
                    { color: available ? 'black' : 'white' }
                  ]}
                >
                  {coupon.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center', // Center the streak container vertically
    alignItems: 'center',     // Center the content horizontally
  },
  streakContainer: {
    marginTop: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120, // Adjust as needed
    height: 150, // Adjust as needed
    marginRight: 20, // Space between logo and streak number
  },
  streakNumber: {
    fontSize: 120, // Large size for the streak number
    fontWeight: 'bold',
    color: '#F14685',
  },
  streakMessage: {
    fontSize: 20,
    color: '#F14685',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 40, // Space below the streak message
    paddingHorizontal: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#F14685',
    marginBottom: 10, // Space above the coupons section
    marginTop: 10,    // Space above the header
  },
  couponsContainer: {
    flexGrow: 1, // Ensure the ScrollView takes up remaining space
    padding: 10,
    marginTop: 25,
  },
  coupon: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  couponText: {
    fontSize: 16,
  },
});

export default Streak;
