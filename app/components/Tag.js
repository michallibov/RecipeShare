import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const Tag = ({ name, pressedTag, touchable, chosenTags }) => {

    const handlePress = () => {
        pressedTag(name);
    }

    return (
        <View style={[styles.buttonView, (chosenTags.includes(name) || !touchable) ? styles.pressedStyle : styles.notPressedStyle]}>
            {touchable ?
                <TouchableOpacity onPress={handlePress}>
                    <Text style={(chosenTags.includes(name) || !touchable) && styles.textStyle}>#{name}</Text>
            
                </TouchableOpacity> : 
                <View>
                    <Text style={(chosenTags.includes(name) || !touchable) && styles.textStyle}>#{name}</Text>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    buttonView: {
        borderRadius: 100,
        margin: 4,
        padding: 6,
        marginBottom: 10,
        borderColor: '#6c4c2c'
    },
    pressedStyle: {
        backgroundColor: '#f7f3f2',
        borderWidth: 1
    },
    notPressedStyle: {
        backgroundColor: '#c4ac94'
    },
    textStyle: {
        fontWeight: 'bold',
        color: '#6c4c2c'
    }
})
export default Tag;