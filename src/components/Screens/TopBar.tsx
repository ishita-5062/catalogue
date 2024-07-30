import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const TopBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Streak')}>
            <Image source={require('../../../assets/images/flame.png')} style={styles.topStreakBarIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../../../assets/images/heart-icon.png')} style={styles.topBarIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Image source={require('../../../assets/images/shopping-cart-icon.png')} style={styles.topBarIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          height: 80, // Adjust this height as needed
        },
      logo: {
        width: 80,
        height: 40,
      },
      iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
      },
      topBarIcon: {
          width: 35,
          height: 30,
          marginLeft: 10,
      },

      topStreakBarIcon: {
                width: 30,
                height: 35,
                marginLeft: 10,
            },
});

export default TopBar;
