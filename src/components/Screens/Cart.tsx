import React, { useMemo } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CartItem from '../CartItem';
import stylesData from '../../../myntradataset/styles.json';
import imageMap from '../../../android/app/src/main/assets/imageMap.js';
import { useCart } from '../CartContext';

const Cart = () => {
    const { cart, clearCart } = useCart();

    // Generate random prices for each item and calculate total
    const { cartItemsWithPrices, totalAmount } = useMemo(() => {
        const itemsWithPrices = cart.map(item => ({
            ...item,
            price: generateRandomPrice()
        }));
        const total = itemsWithPrices.reduce((sum, item) => sum + item.price, 0);
        return { cartItemsWithPrices: itemsWithPrices, totalAmount: total };
    }, [cart]);

    const handleCheckout = () => {
            Alert.alert(
                'Confirm Checkout',
                'Are you sure you want to place this order?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Yes',
                        onPress: () => {
                            clearCart();  // Clear the cart
                            Alert.alert('Order Successful', 'Your order has been placed successfully!');
                        }
                    }
                ]
            );
        };

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>
                    Shopping Cart
                </Text>
                {cart.length === 0 ? (
                    <Text style={styles.emptyCart}>Your cart is empty.</Text>
                ) : (
                    cartItemsWithPrices.map((item, index) => (
                        <CartItem key={index} product={item} imageMap={imageMap} price={item.price} />
                    ))
                )}
                {cart.length > 0 && (
                    <>
                        <Text style={styles.total}>Total Amount: ₹ {totalAmount}</Text>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

// Helper function to generate a random price ending in 99 or 49
const generateRandomPrice = () => {
    const endings = [49, 99];
    const ending = endings[Math.floor(Math.random() * endings.length)];
    const base = Math.floor(Math.random() * ((999 - 149) / 100)) * 100 + 149;
    return Math.floor(base / 100) * 100 + ending;
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        flex: 1,
        padding: 10,
    },
    container: {
        padding: 10,
        paddingBottom: 20, // Add padding at the bottom to avoid content being hidden behind the button
    },
    header: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#F14685',
        marginBottom: 20, // Add space below the Shopping Cart text
    },
    emptyCart: {
        fontSize: 18,
        fontStyle: 'italic',
        alignSelf: 'center',
        marginTop: 20,
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
    },
    checkoutButton: {
        backgroundColor: '#F14685',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        width: '90%',
        marginTop: 20,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Cart;
