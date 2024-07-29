import React from 'react'
import {SafeAreaView, View, Text, StyleSheet} from 'react-native'

const Cart = () =>{
    return(
        <SafeAreaView style = {styles.root}>
        <View style ={styles.container}>
            <Text style ={{fontWeight: 'bold', fontSize: 24, color:'#F14685'}}>
            Your cart
            </Text>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root:{
        width:'100%',
        flex:1,
        padding: 10,

    },
    container:{
        padding: 10,
    },
});

export default Cart;