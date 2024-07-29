import {StylesSheet, Text, View} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../src/components/Screens/Home'
import Cart from '../src/components/Screens/Cart'
import TopBar from '../src/components/Screens/TopBar';

const Stack = createStackNavigator();

export const StackNavigator = () => (
  <Stack.Navigator
        screenOptions={{
          header: (props) => <TopBar {...props} />,
        }}
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Cart" component={Cart} />
  </Stack.Navigator>
);

