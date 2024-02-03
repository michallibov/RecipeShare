import React, {useState} from 'react'
import { View, TextInput, Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native';

const Search = ({onSearch }) => {
    const [searchRecipe, setSearchRecipe] = useState('');

    const handlePress = async () => {
        await onSearch(searchRecipe);
        setSearchRecipe('');
    };
    
  return (
    <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder="Search for a recipe"
            value={searchRecipe}
            onChangeText={(text) => setSearchRecipe(text)}
        />
        <Pressable style={styles.buttonStyle} onPress={handlePress}>
            <Text style={styles.buttonTextStyle}>Search!</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    buttonStyle: ({ pressed }) => {
        return {
          backgroundColor: pressed ? 'rgba(231, 217, 203, 220)' : '#6e492a',
          padding: 4,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'white',
          marginLeft: 2,
          alignContent: 'center',
          justifyContent: 'center',
          height: 40,
        };
      },
    inputContainer: {
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        padding: 8,
        width: '85%',
        marginRight: 2,
        borderRadius: 10
    },
    buttonTextStyle: {
        color: 'white'
    }
})

export default Search;