import React from 'react';
import { Text, Image, View, StyleSheet } from 'react-native';

const CartItem = ({ product, imageMap, price }) => {
  const { productDisplayName, image } = product;
  const imagePath = imageMap[image]; // Use the imageMap to get the image path by id

  return (
    <View style={styles.cardContainer}>
      <Image
        source={imagePath}
        style={styles.image}
      />
      <View style={styles.cardInner}>
        <Text style={styles.name}>{productDisplayName}</Text>
        <Text style={styles.price}>₹ {price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    height: 120,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
    backgroundColor: '#fff',
    marginBottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  cardInner: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
});

export default CartItem;
