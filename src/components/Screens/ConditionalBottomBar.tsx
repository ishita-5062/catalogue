import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';


const BottomBar = () =>(
  <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('../../../assets/images/icons8-play-50.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('../../..//assets/images/icons8-hashtag-64.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('../../../assets/images/icons8-search-50.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Image source={require('../../../assets/images/icons8-male-user-30.png')} style={styles.navIcon} />
      </TouchableOpacity>
  </View>
);

const ConditionalBottomBar = () => {
//     const route = useRoute();
//     const currentRoute = route.name;
//     const showBottomBar = currentRoute !== 'Login';
//     console.log("currentRoute is", currentRoute);
//     if (!showBottomBar) return null;
      return (
          <View>
             <BottomBar />
          </View>
     );
};

const styles = StyleSheet.create( {
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

export default ConditionalBottomBar;