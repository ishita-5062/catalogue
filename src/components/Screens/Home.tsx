import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, useDerivedValue, interpolate, runOnJS } from 'react-native-reanimated';

// Adjust paths as needed for Card component and data
import Card from '../Card'; // Adjust path as needed
import stylesData from '../../../myntradataset/styles.json'; // Adjust path as needed
import imageMap from '../../../android/app/src/main/assets/imageMap.js'; // Adjust path as needed
import { getMostSimilarIndex, addToVisitedSet, clearVisitedSet } from '../utils/recommendationUtils';
const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currProduct = stylesData[currentIndex];
  const nextProduct = stylesData[nextIndex];

  const { width: screenWidth } = useWindowDimensions();
  const hiddenTranslateX = 2 * screenWidth;
  const translateX = useSharedValue(0);
  const rotate = useDerivedValue(() =>
    interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) + 'deg',
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: rotate.value },
    ],
    opacity: interpolate(translateX.value, [-screenWidth, 0, screenWidth], [0, 1, 0]),
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(translateX.value, [-hiddenTranslateX, 0, hiddenTranslateX], [1, 0.8, 1]) },
    ],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, screenWidth / 4], [0, 1]),
    transform: [
      { translateX: translateX.value / 2 },
    ],
  }));

  const crossStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -screenWidth / 4], [0, 1]),
    transform: [
      { translateX: translateX.value / 2 },
    ],
  }));

   const onSwipe = (direction: 'left' | 'right') => {
     const newCurrentIndex = nextIndex;
     let newNextIndex;

     if (direction === 'right') {
       // User liked the item, get the most similar item
       newNextIndex = getMostSimilarIndex(currentIndex, stylesData.length);
     } else {
       // User disliked the item, move to the next one
       newNextIndex = (nextIndex + 1) % stylesData.length;
     }

     setCurrentIndex(newCurrentIndex);
     setNextIndex(newNextIndex);
   };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }

      const direction = event.velocityX > 0 ? 'right' : 'left';
      translateX.value = withSpring(
          hiddenTranslateX * Math.sign(event.velocityX),
          {},
          () => {
                    runOnJS(onSwipe)(direction);
                  }
    );
    },
  });

  useEffect(() => {
    translateX.value = 0;
//     removed this line
//     setNextIndex(currentIndex + 1);
  }, [currentIndex]);

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