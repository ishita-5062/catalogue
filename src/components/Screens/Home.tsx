import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Alert, Text, AppState} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, useDerivedValue, interpolate, runOnJS } from 'react-native-reanimated';

// Adjust paths as needed for Card component and data
import Card from '../Card'; // Adjust path as needed
import stylesData from '../../../myntradataset/styles.json'; // Adjust path as needed
import imageMap from '../../../android/app/src/main/assets/imageMap.js'; // Adjust path as needed
import { getMostSimilarIndex, addToVisitedSet, clearVisitedSet } from '../utils/recommendationUtils';
import { useCart } from '../CartContext';  // Import the useCart hook
import ConditionalBottomBar from './ConditionalBottomBar'

import { FIREBASE_AUTH } from '../../../firebaseAuth';
import axios from 'axios';

const ROTATION = 60;
const SWIPE_VELOCITY = 800;
const UPWARD_SWIPE_THRESHOLD = -200; // Adjust as needed

const handleSwipeRight = async (productId: number) => {
  try {
    const response = await axios.post('http://10.0.2.2:3001/api/updateSwipeCount', {
      productId,
    });

    console.log('Swipe count updated:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating swipe count:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

const Home = () => {
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currProduct = stylesData[currentIndex];
  const nextProduct = stylesData[nextIndex];
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const hiddenTranslateX = 2 * screenWidth;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [streak, setStreak] = useState(0);

  const fetchUserData = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) throw new Error('No user logged in');

      const response = await axios.get(`http://10.0.2.2:3001/api/users/${user.uid}`);
      console.log("Data received", response.data.swipeStreak);
      setStreak(response.data.swipeStreak);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSwipe = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) throw new Error('No user logged in');

      const response = await axios.post(`http://10.0.2.2:3001/api/users/${user.uid}/extend-streak`);
      setStreak(response.data.newStreak);
      console.log("Streak set to", response.data.swipeStreak);
    } catch (error) {
      console.error('Error extending streak:', error);
    }
  };


  const rotate = useDerivedValue(() =>
    interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) + 'deg'
  );

const cardStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: translateX.value },
    { translateY: translateY.value }, // Vertical movement for swipe actions
    { rotate: rotate.value }
  ],
  opacity: interpolate(translateX.value, [-screenWidth, 0, screenWidth], [0, 1, 0]),
}));

const nextCardStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: interpolate(translateY.value, [-screenHeight, 0], [1.2, 1]), // Scale up when moving upward
      // Consider adding a conditional check for horizontal swipes if needed
    },
    {
      scale: interpolate(translateX.value, [-screenWidth, 0, screenWidth], [1, 0.8, 1]) // Scale for horizontal swipes
    }
  ],
  opacity: interpolate(translateX.value, [-screenWidth, 0, screenWidth], [0, 1, 0]),
}));


  const heartStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, screenWidth / 4], [0, 1]),
    transform: [{ translateX: translateX.value / 2 }]
  }));

  const crossStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -screenWidth / 4], [0, 1]),
    transform: [{ translateX: translateX.value / 2 }]
  }));

    const onSwipe = (direction: 'left' | 'right' | 'up') => {
      const newCurrentIndex = nextIndex;
      let newNextIndex;

      console.log(direction);
      handleSwipe();

      if (direction === 'right') {
        newNextIndex = getMostSimilarIndex(currentIndex, stylesData.length);
        handleSwipeRight(currProduct.id);
      } else if (direction === 'left') {
        newNextIndex = (nextIndex + 1) % stylesData.length;
      } else if (direction === 'up') {
        addToCart(currProduct);  // Add the current product to cart
        Alert.alert("Added to Cart", `${currProduct.productDisplayName} has been added to your cart!`);
        newNextIndex = (nextIndex + 1) % stylesData.length;
      }

      setCurrentIndex(newCurrentIndex);
      setNextIndex(newNextIndex);
    };

const SWIPE_VELOCITY = 800;
const UPWARD_SWIPE_THRESHOLD = -200; // Adjust as needed

const gestureHandler = useAnimatedGestureHandler({
  onStart: (_, context) => {
    context.startX = translateX.value;
    context.startY = translateY.value;
  },
  onActive: (event, context) => {
    translateX.value = context.startX + event.translationX;
    translateY.value = context.startY + event.translationY;
  },
  onEnd: (event) => {
    const velocityX = event.velocityX;
    const velocityY = event.velocityY;

    // Check if the swipe doesn't meet the velocity threshold or if it's an insufficient upward swipe
    let direction: 'left' | 'right' | 'up' = 'left';
    if (event.translationY <= UPWARD_SWIPE_THRESHOLD) {
      direction = 'up';
    } else if (velocityX > 0) {
      direction = 'right';
    }

    if (direction!='up' && Math.abs(velocityX) < SWIPE_VELOCITY) {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      return;
    }

    if (direction === 'up') {
      // Immediate upward movement
      translateX.value = withSpring(0); // No horizontal movement
      translateY.value = withSpring(-screenHeight, { damping: 2 }, () => runOnJS(onSwipe)('up')); // Push card out of view
    } else {
      translateX.value = withSpring(hiddenTranslateX * Math.sign(velocityX), {}, () => runOnJS(onSwipe)(direction));
      translateY.value = withSpring(0); // Reset vertical position for left/right swipes
    }
  }
});

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
//     setNextIndex((currentIndex + 1) % stylesData.length);
  }, [currentIndex]);

    const [currentDate, setCurrentDate] = useState(new Date());
    const streakLogicExecuted = useRef(false);
    const appState = useRef(AppState.currentState);
    const intervalRef = useRef(null);

    useEffect(() => {
      const checkStreakStatus = async () => {
        if (streakLogicExecuted.current) return;

        const fb_user = FIREBASE_AUTH.currentUser;
        if (fb_user) {
          try {
            const response = await axios.get(`http://10.0.2.2:3001/api/users/${fb_user.uid}`);
            const userData = response.data;
            const currentDate = new Date();
            const lastSwipedDate = new Date(userData.lastSwiped);
            const yesterdayDate = new Date(currentDate);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);

            // Convert dates to ISO string format (YYYY-MM-DD) for comparison
//             const currentDateISO = currentDate.toISOString().split('T')[0];
//             const lastSwipedDateISO = lastSwipedDate.toISOString().split('T')[0];
//             const yesterdayDateISO = yesterdayDate.toISOString().split('T')[0];

            const currentDateISO = currentDate;
            const lastSwipedDateISO = lastSwipedDate;
            const yesterdayDateISO = yesterdayDate;

            const twoMinutesInMilliseconds = 2 * 60 * 1000; // 5 minutes in milliseconds
            const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes in milliseconds

            const differenceInMilliseconds_lastSwiped = currentDate - lastSwipedDate;
//             const differenceInMilliseconds_lastSwiped = currentDate - lastSwipedDate;


            console.log("Today =>", currentDateISO);
            console.log("Yesterday =>", yesterdayDateISO);
            console.log("lastSwiped =>", lastSwipedDateISO);

            let updateData = {};
//             if (lastSwipedDateISO !== currentDateISO) {
//               // Reset didSwipe for the new day
//               updateData.didSwipe = false;
//
//               if (lastSwipedDateISO < yesterdayDateISO) {
//                 // If last swipe was before yesterday, reset streak
//                 updateData.swipeStreak = 0;
//                 console.log("User did not swipe yesterday!");
//               }
//               else{
//                   console.log("User swiped yesterday!");
//               }
//             }

//          TEMPORARYYYYY
            if (differenceInMilliseconds_lastSwiped > twoMinutesInMilliseconds) {
              // Reset didSwipe for the new day
              updateData.didSwipe = false;
              console.log("Set did swipe to false");

              if (differenceInMilliseconds_lastSwiped > fiveMinutesInMilliseconds) {
                // If last swipe was before yesterday, reset streak
                updateData.swipeStreak = 0;
                console.log("User did not swipe yesterday!");
              }
              else{
                  console.log("User swiped yesterday!");
              }
            }


            if (Object.keys(updateData).length > 0) {
              await axios.put(`http://10.0.2.2:3001/api/users/${fb_user.uid}`, updateData);
            }
            else{
                console.log("User has already swiped today!");
            }
          } catch (error) {
            console.error('Error checking user streak status:', error);
          }
        }

        streakLogicExecuted.current = true;
      };

//     const handleAppStateChange = (nextAppState) => {
//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         const newDate = new Date();
//         if (newDate.toDateString() !== currentDate.toDateString()) {
//           setCurrentDate(newDate);
//           streakLogicExecuted.current = false; // Reset this so logic runs again on date change
//         }
//       }
//       appState.current = nextAppState;
//     };


//     TEMPORARYYYYY
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        checkStreakStatus();
      }
      appState.current = nextAppState;
    };

      checkStreakStatus();

//       TEMPORARYYYYY
    console.log("Defining Interval!");
    const intervalId = setInterval(() => {
      console.log("Checking streak status (2-minute interval)");
      streakLogicExecuted.current = false;
      checkStreakStatus();
      console.log("function called");
    }, 2 * 60 * 1000);
    // Set up AppState listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(intervalId);
      subscription.remove(); // This correctly removes the event listener
    };

    }, []);

    useEffect(() => {
        console.log("Reaching here!");
       fetchUserData();
     }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Cards */}
      <View style={styles.pageContainer}>
        {nextProduct && (
          <View style={styles.nextCardContainer}>
            <Animated.View style={[styles.animatedCard, nextCardStyle]}>
              <Card product={nextProduct} imageMap={imageMap} />
            </Animated.View>
          </View>
        )}

        {currProduct && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.animatedCard, cardStyle]}>
              <Card product={currProduct} imageMap={imageMap} />
              <View style={styles.iconContainer}>
                <Animated.Image source={require('../../../assets/images/heart.png')} style={[styles.icon, heartStyle]} />
                <Animated.Image source={require('../../../assets/images/cross.png')} style={[styles.icon, crossStyle]} />
              </View>
            </Animated.View>
          </PanGestureHandler>
        )}
      </View>
      <ConditionalBottomBar />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 85,
    height: 70,
    marginLeft: 10,
  },
  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -42.5 }, { translateY: -35 }],
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 170,
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCard: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;