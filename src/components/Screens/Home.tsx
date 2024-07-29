import React, { useState, useEffect} from 'react';
import { View, StyleSheet, useWindowDimensions, Alert, Text} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, useDerivedValue, interpolate, runOnJS } from 'react-native-reanimated';

// Adjust paths as needed
import Card from '../Card';
import stylesData from '../../../myntradataset/styles.json';
import imageMap from '../../../android/app/src/main/assets/imageMap.js';
import { getMostSimilarIndex } from '../utils/recommendationUtils';
import { useCart } from '../CartContext';  // Import the useCart hook

const ROTATION = 60;
const SWIPE_VELOCITY = 800;
const UPWARD_SWIPE_THRESHOLD = -200; // Adjust as needed

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

      if (direction === 'right') {
        newNextIndex = getMostSimilarIndex(currentIndex, stylesData.length);
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              <Text currentIndex/>
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