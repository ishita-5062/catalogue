import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { StackNavigator } from './navigation/StackNavigator';
import { useNavigation } from '@react-navigation/native';
import { CartProvider } from './src/components/CartContext';

import { createStackNavigator } from '@react-navigation/stack';
import {User, onAuthStateChanged} from 'firebase/auth';

import Home from './src/components/Screens/Home'
import Cart from './src/components/Screens/Cart'
import Streak from './src/components/Screens/Streak'
import Admin from './src/components/Screens/Admin';

import TopBar from './src/components/Screens/TopBar'
import ConditionalBottomBar from './src/components/Screens/ConditionalBottomBar'
import {FIREBASE_AUTH} from './firebaseAuth'
import Login from './src/components/Screens/Login';

import { UserDataProvider, useUserData } from './src/components/utils/UserDataContext';

import axios from 'axios';

enableScreens();

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Login" component={Login} />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator
      screenOptions={({ route }) => ({
        header: (props) => {
          // Hide TopBar for Login and Admin screens
          if (route.name === 'Login' || route.name === 'Admin') {
            return null;
          }
          // Show TopBar for all other screens
          return <TopBar {...props} />;
        },
      })}
    >
    <AppStack.Screen name="Home" component={Home} />
    <AppStack.Screen name="Cart" component={Cart} />
    <AppStack.Screen name="Streak" component={Streak} />
    <AppStack.Screen name="Admin" component={Admin} />
  </AppStack.Navigator>

);

const App = () => {
    const [fb_user, setUser] = useState<User | null>(null);


    useEffect(() =>{
        console.log('Effect running');
        onAuthStateChanged(FIREBASE_AUTH, async(fb_user) => {
            console.log('Auth state changed:', fb_user ? 'User logged in' : 'User logged out');
            setUser(fb_user);
            if (fb_user) {
                console.log('User authenticated. Attempting to check/create user in MongoDB');
                // Check if user exists in MongoDB and create if not
                try {
                    console.log('Making axios request to:', 'http://10.0.2.2:3005/api/users/check-or-create');
                    console.log('Request payload:', { email: fb_user.email, uid: fb_user.uid });

                    const response = await axios.post('http://10.0.2.2:3005/api/users/check-or-create', {
                        email: fb_user.email,
                        uid: fb_user.uid
                    });
                    console.log('Axios request successful');
                    console.log('Response status:', response.status);
                    console.log('Response data:', response.data);
                } catch (error) {
                    console.error('Error checking/creating user in MongoDB:', error);
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            // The request was made and the server responded with a status code
                            // that falls out of the range of 2xx
                            console.error('Error data:', error.response.data);
                            console.error('Error status:', error.response.status);
                            console.error('Error headers:', error.response.headers);
                        } else if (error.request) {
                            // The request was made but no response was received
                            console.error('No response received: ', error.request);
                        } else {
                            console.error('Error message:', error.message);
                        }
                    }
                }
                console.log('ended');
            }


        });
    }, [])

    return(

    <CartProvider>
     <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1 }}>
                {/*top navigation */}
              {/* Screens */}
              <View style = {styles.pageContainer}>
                     {fb_user ? <AppNavigator /> : <AuthNavigator />}
              </View>

              {/* Bottom Navigation */}
          </GestureHandlerRootView>
     </NavigationContainer>
     </CartProvider>

   );
};

const styles = StyleSheet.create( {


//     {/* page styles*/}
    pageContainer: {
        flex: 1,
    },


});

export default App;