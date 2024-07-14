import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Card from '../Card';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, useDerivedValue, interpolate, runOnJS } from 'react-native-reanimated';

const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const AnimatedStack = (props) => {

  const {data, renderItem} = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currProduct = data[currentIndex];
  const nextProduct = data[nextIndex];

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

      translateX.value = withSpring(hiddenTranslateX * Math.sign(event.velocityX),
        {},
        () => runOnJS(setCurrentIndex)(currentIndex + 1),
      );
    },
  });

  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        {nextProduct && (
          <View style={styles.nextCardContainer}>
            <Animated.View style={[styles.animatedCard, nextCardStyle]}>
                {renderItem({item:nextProduct})}
            </Animated.View>
          </View>
        )}

        {currProduct && (
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.animatedCard, cardStyle]}>
               {renderItem({item:currProduct})}
              <Animated.Image source={require('C:/Users/ishit/OneDrive/Desktop/ReactNativeProjects/try3/assets/images/heart.png')} style={[styles.icon, heartStyle]} />
              <Animated.Image source={require('C:/Users/ishit/OneDrive/Desktop/ReactNativeProjects/try3/assets/images/cross.png')} style={[styles.icon, crossStyle]} />
            </Animated.View>
          </PanGestureHandler>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
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
  icon: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
});

export default AnimatedStack;
