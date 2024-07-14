import React from 'react';
import { Text, ImageBackground, View, StyleSheet } from 'react-native';

const Card = ({ product, imageMap }) => {
  const { productDisplayName, image } = product;
  const imagePath = imageMap[image]; // Use the imageMap to get the image path by id
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <ImageBackground
          source={imagePath}
          style={styles.image}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.cardInner}>
            <Text style={styles.name}>{productDisplayName}</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '95%',
    height: '95%',
    borderRadius: 33,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    paddingTop: 20,
    paddingBottom: 15,
    alignSelf: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 33,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 33,
  },
  cardInner: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomLeftRadius: 33,
    borderBottomRightRadius: 33,
  },
  name: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Card;
