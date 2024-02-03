import React from 'react'
import { View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

const SavedRecipe = ({ recipe, index, onChange }) => {
    
    const deleteSavedRecipe = async (item) => {
        try {
            const recipeRef = doc(FIREBASE_DB, 'favorite-recipes', item.id);
            await deleteDoc(recipeRef);
            alert("Recipe deleted successfully!");
            onChange();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

  return (
    <View key={index} style={styles.item}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: recipe.image }} style={styles.imageStyle} /> 
              <React.Fragment> 
                    <TouchableOpacity
                        onPress={() => deleteSavedRecipe(recipe)}
                        style={styles.deleteButton}>
                        <Text>Remove recipe</Text> 
                    </TouchableOpacity>
                </React.Fragment>
            </View>
            <Text style={styles.subTitles}>Ingredients:</Text>
            {recipe.ingredients.map((ingredient, ingredientIndex) => (
                <Text key={ingredientIndex}>
                  <FontAwesome name="check-square-o" /> {ingredient.name}
            </Text>
            ))}
        <Text style={styles.subTitles}>Instructions:</Text><Text>{recipe.instructions}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'rgba(194, 165, 130, 1)',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    recipeTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        textDecorationLine: 'underline'
    },
    subTitles: {
        marginTop: 10,
        textDecorationLine: 'underline'
    },
    imageWrapper: {
        flexDirection: 'row',
        paddingTop: 10
    },
    deleteButton: {
        backgroundColor: 'rgba(216,71,63,255)',
        padding: 8,
        borderRadius: 5,
        marginBottom: 8,
        marginLeft: 60,
        borderWidth: 1,
        borderColor: 'black',
        height: 40,
        marginTop: 30,
        alignItems: 'center'
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5
    }
})

export default SavedRecipe;