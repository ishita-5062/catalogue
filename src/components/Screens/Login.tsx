import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FIREBASE_AUTH } from '../../../firebaseAuth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]= useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword (auth, email, password);
            console.log(response);
            alert('Signed In!');
        }catch(error: any){
            console.log(error);
            alert(`Sign in failed: ${error.message}`);
        } finally {
            setTimeout(() => {
                // Display the alert
            }, 1000);
            setLoading (false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword (auth, email, password);
            console.log(response);
            alert('Check your email!');
        }catch(error: any){
          console.log(error);
            alert(`Sign up failed: ${error.message}`);
        } finally {
            setTimeout(() => {
                    // Display the alert
                }, 1000);
           setLoading (false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
            <Text style={styles.title}>Welcome</Text>
            <TextInput
              value={email}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              autoCapitalize="none"
              onChangeText={(text) => setPassword(text)}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#FF3F6C" />
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={() => signIn()}>
                  <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => signUp()}>
                  <Text style={styles.secondaryButtonText}>SIGN UP</Text>
                </TouchableOpacity>
              </>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E4152',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D4D5D9',
    borderRadius: 4,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#3E4152',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF3F6C',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#FF3F6C',
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  secondaryButtonText: {
    color: '#FF3F6C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;

