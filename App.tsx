import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './navigation/StackNavigator';
import { useNavigation } from '@react-navigation/native';


import Home from './src/components/Screens/Home'
import Cart from './src/components/Screens/Cart'
import TopBar from './src/components/Screens/TopBar'

enableScreens();



const BottomBar = () =>(
  <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('./assets/images/icons8-play-50.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('./assets/images/icons8-hashtag-64.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('./assets/images/icons8-search-50.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('./assets/images/icons8-male-user-30.png')} style={styles.navIcon} />
      </TouchableOpacity>
  </View>
);

const App = () => {

    return(

     <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1 }}>
                {/*top navigation */}
              {/* Screens */}
              <View style = {styles.pageContainer}>
                  <StackNavigator />
              </View>

              {/* Bottom Navigation */}
              <BottomBar/>
          </GestureHandlerRootView>
     </NavigationContainer>

   );
};

const styles = StyleSheet.create( {
//     {/* topBar styles*/}


//     {/* page styles*/}
    pageContainer: {
        flex: 1,
    },

//     {/* bottomBar styles*/}
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F14685', // Pink background color
        borderTopLeftRadius: 20, // Rounded corners
        borderTopRightRadius: 20, // Rounded corners
      },
      navButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
      },
      navIcon: {
        width: 30,
        height: 30,
      },
});

export default App;