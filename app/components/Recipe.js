import React, { useState, useSyncExternalStore } from 'react'
import { View, TouchableOpacity, Image, Text, TextInput, ActivityIndicator } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { deleteDoc, doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB } from '../../FirebaseConfig';
import ImagePickerComponent from './ImagePickerComponent';
import IngredientComponent from './IngredientComponent';
import globalStyles from '../config/colors';

const Recipe = ({ index, recipe, onChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [newIngredients, setNewIngredients] = useState(recipe.ingredients);
    const [title, setTitle] = useState(recipe.title);
    const [newTitle, setNewTitle] = useState(title);
    const [image, setImage] = useState(recipe.image);
    const [instructions, setInstructions] = useState(recipe.instructions);
    const [newInstructions, setNewInstructions] = useState(instructions);
    const [editing, setEditing] = useState(false);
    const [shared, setShared] = useState(recipe.shared);

    const deleteRecipe = async (item) => {
        try {
            const recipeRef = doc(FIREBASE_DB, 'Recipes', item.id);
            await deleteDoc(recipeRef);
            alert("Recipe deleted successfully!");
            onChange();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const editRecipe = async () => {
        if (newIngredients.length === 0) {
            alert("A recipe must have ingredients!");
            return;
        }
        try {
            const auth = getAuth();
            const recipeRef = await doc(FIREBASE_DB, 'Recipes', recipe.id);
            const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Users'));
            const userData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
           
            const updatedRecipe = {
                email: auth.currentUser.email,
                title: newTitle,
                ingredients: newIngredients,
                instructions: newInstructions,
                image: image || 'https://www.greatwall.lk/assets/image/default.png',
                ratings: recipe.ratings,
                nickname: userData[0].nickname,
                shared: shared ? shared : false
            }
            await updateDoc(recipeRef, updatedRecipe);
            setEditing(false);
            setIsLoading(false);
            onChange();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }

    const deleteIngredient = (id) => {
        setNewIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== id)
        );
    }

    const addIngredient = () => {
        const newIngredient = { id: String(newIngredients.length + 1), name: '' };
        setNewIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    };

    const share = async () => {
        console.log("hey")
        try {
            const recipeRef = await doc(FIREBASE_DB, 'Recipes', recipe.id);
           
            await updateDoc(recipeRef, { shared: !shared });
            setShared(!shared);
            onChange();
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
        <View key={index} style={styles.item}>
            <TextInput
                style={[styles.recipeTitle, editing ? styles.editingStyle : styles.notEditingStyle]}
                editable={editing} defaultValue={title} onChange={(text) => setNewTitle(text)}
                placeholderTextColor={editing ? 'black' : 'gray'}
            />
            <View style={styles.imageWrapper}>
                <ImagePickerComponent image={image} setImage={setImage} editable={editing} circled={false}/> 
                <React.Fragment> 
                    <TouchableOpacity
                        onPress={() => deleteRecipe(recipe)}
                        style={styles.deleteButton}>
                        <FontAwesome name='trash-o' size={20} />
                    </TouchableOpacity>
                    {editing ?
                        <TouchableOpacity style={styles.editButton} onPress={() => editRecipe()}>
                          <FontAwesome name='save' size={20} /> 
                        </TouchableOpacity>
                    :
                        <TouchableOpacity
                            onPress={() => setEditing(true)}
                            style={styles.editButton}
                        >
                            <FontAwesome name='edit' size={20} />
                        </TouchableOpacity>
                    }
              </React.Fragment>
            </View>
            <Text style={styles.subTitles}>Ingredients:</Text>
            <View style={editing && styles.editingStyle}>
            {newIngredients.map((ingredient, ingredientIndex) => (
                editing ?
                    <IngredientComponent
                        item={ingredient}
                        key={ingredient.id}
                        onMeasurementChange={(value) => {
                            const updatedIngredients = [...newIngredients];
                            if (updatedIngredients[ingredientIndex]) { 
                                updatedIngredients[ingredientIndex].measurement = value;
                            }
                            else {console.log("erfre")
                                updatedIngredients[ingredientIndex] = value
                            }
                            setNewIngredients(updatedIngredients);
                            console.log(newIngredients)
                        }}
                        onQuantityChange={(quantity) => {
                            const updatedIngredients = [...newIngredients];
                            updatedIngredients[ingredientIndex].quantity = quantity;
                        }}
                        onNameChange={(name) => {
                            const updatedIngredients = [...newIngredients];
                            updatedIngredients[ingredientIndex].name = name;
                        }}
                      onDelete={deleteIngredient}
                    />
                  :
                    <Text key={ingredientIndex}
                        style={styles.notEditingStyle}
                    >
                        {<FontAwesome name="check-square-o" />} {ingredient.quantity} {(ingredient.measurement && ingredient.measurement.label !== '' ) ? ingredient.measurement.label + (ingredient.quantity  > 1 ? 's of' : ' of') : ''} {ingredient.name}
                    </Text> 
            ))}
                {editing &&
                    <TouchableOpacity style={globalStyles.addButton} onPress={addIngredient}>
                        <Text style={globalStyles.buttonTextStyle}>Add Ingredient</Text>
                    </TouchableOpacity>
                }
            </View>
            <Text style={styles.subTitles}>Instructions:</Text>
            <TextInput
                style={editing ? styles.editingStyle : styles.notEditingStyle}
                onChange={(text) => setNewInstructions(text)}
                placeholderTextColor={editing ? 'black' : 'gray'}
                editable={editing}
                multiline={true}
            >
                {instructions}
          </TextInput>
          {!editing && <View style={styles.shareButtonView}>
              <TouchableOpacity style={styles.shareButton} onPress={share}>
                  <Text style={styles.shareButtonText}>{shared ? 'Stop Sharing' : 'Share'}</Text>
              </TouchableOpacity></View>}
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
        fontSize: 20
    },
    subTitles: {
        marginTop: 10,
        textDecorationLine: 'underline'
    },
    imageWrapper: {
        flexDirection: 'row',
    },
    deleteButton: {
        backgroundColor: 'rgba(216,71,63,255)',
        padding: 8,
        borderRadius: 5,
        marginLeft: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'black',
        height: 40,
        marginTop: 30,
        marginLeft: '40%',
        width: 40,
        alignItems: 'center'
    },
    editButton: {
        backgroundColor: 'wheat',
        padding: 8,
        borderRadius: 5,
        marginLeft: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'black',
        height: 40,
        marginTop: 30,
        width: 40,
        alignItems: 'center'
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5
    },
    editingStyle: {
        borderWidth: 1,
        borderColor: 'white',
        padding: 5,
        borderRadius: 5,
        marginBottom: 5,
        marginTop: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    notEditingStyle: {
        color: 'black',
        paddingBottom: 5
    },
    shareButtonView: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareButton: {
        backgroundColor: '#6e492a',
        paddingVertical: 6,
        paddingHorizontal: '20%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white'
    },
    shareButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
})

export default Recipe;