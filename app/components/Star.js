import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";

const Star = ({ isSelected, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={isSelected ? require('../assets/selected-hat.png') : require('../assets/unselected-hat.png')}
      style={isSelected ? styles.starSelected : styles.starUnselected}
    />
  </TouchableOpacity>
);  


const styles = StyleSheet.create({
  starUnselected: {
    // Add your unselected star styles here
    width: 30,
    height: 30,
    //tintColor: 'black', // You may change the color here
  },
  starSelected: {
    // Add your selected star styles here
    width: 30,
    height: 30,
    //tintColor: 'white', // You may change the color here
  },
});

export default Star;
