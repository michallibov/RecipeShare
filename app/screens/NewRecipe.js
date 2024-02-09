import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
    StyleSheet,
    View,
    TextInput,
    StatusBar,
    TouchableOpacity,
    Text,
    Image,
    ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { addDoc, collection, getDocs, query, limit, where } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB } from '../../FirebaseConfig';
import IngredientComponent from '../components/IngredientComponent';
import globalStyles from '../config/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

function NewRecipe({navigation}) {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    
    const addIngredient = () => {
        const newIngredient = { id: String(ingredients.length + 1), name: '' };
        setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
      };
    
    const handleInstructionsChange = (text) => {
        setInstructions(text);
    }
    
    const pickImage = async () => {
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        }).then((res) => {
            if (!res.canceled) {
                setImage(res.assets[0].uri);
            }
            else {
                console.log("cancelled");
            }

            console.log(image);
        });
    };
    
    const checkData = () => {
        if (title === '') {
            alert("You forgot to enter a title!");
            return false;
        }
        if (ingredients.length === 0 || ingredients.some(item => item.name === '' || item.quantity === '' || item.measurement === '')) {
            alert("You forgot to enter all details for some ingredients!");
            console.log("whay>?")
            return false;
        }
        if (instructions === '') {
            alert("You did not give instructions!");
            return false;
        }
        console.log("passed");
        return true;
    }

    const saveRecipe = async () => {
        
        if (checkData()) {
            const auth = getAuth();
            const usersCollection = collection(FIREBASE_DB, 'Users');
            const q = query(usersCollection, where("email", "==", auth.currentUser.email), limit(1));
            const querySnapshot = await getDocs(q);

            const recipeImage = image ? image : 'https://www.greatwall.lk/assets/image/default.png';

            const data = {
                email: auth.currentUser.email,
                title: title,
                ingredients: ingredients,
                instructions: instructions,
                image: recipeImage,
                ratings: [],
                nickname: querySnapshot.docs[0].data().nickname,
                shared: false,
                comments: []
            };

            try {
                const myCollection = collection(FIREBASE_DB, 'recipes');
                await addDoc(myCollection, data);
                alert("Your recipe is saved!");
                setImage(null);
                setIngredients([]);
                setInstructions('');
                setTitle('');
                navigation.navigate('Feed');
            } catch (error) {
                console.error('Error adding recipe:', error);
            }
        }
    }
    
    const deleteIngredient = (id) => {
        setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== id)
        );
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Please enter the title of the recipe'
                        onChangeText={(text) => { text.length <= 40 && setTitle(text) }}
                        value={title}
                    />
                    <View style={styles.ingredientsList}>
                        {ingredients.map((item, index) => (
                            <IngredientComponent
                                key={item.id}
                                item={item}
                                onMeasurementChange={(value) => {
                                    const updatedIngredients = [...ingredients];
                                    console.log(value)
                                    updatedIngredients[index].measurement = value;
                                    setIngredients(updatedIngredients);
                                }}
                                onQuantityChange={(quantity) => {
                                    const updatedIngredients = [...ingredients];
                                    updatedIngredients[index].quantity = quantity;
                                }}
                                onNameChange={(name) => {
                                    const updatedIngredients = [...ingredients];
                                    updatedIngredients[index].name = name;
                                }}
                                onDelete={deleteIngredient}
                            />
                        ))}
                        <TouchableOpacity style={globalStyles.addButton} onPress={addIngredient}>
                            <Text style={globalStyles.buttonTextStyle}>Add Ingredient</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={[styles.input, styles.instructionsInput]}
                        onChangeText={(text) => handleInstructionsChange(text)}
                        value={instructions}
                        placeholder='Please provide informative instructions'
                        multiline={true}
                        numberOfLines={4}
                    />
                    <TouchableOpacity style={[globalStyles.addButton, styles.buttonMargin]} onPress={pickImage}>
                        <Text style={globalStyles.buttonTextStyle}>Pick Image</Text>
                    </TouchableOpacity>
                    {image && (
                        <View style={styles.imageBox}>
                            <Image
                                source={{ uri: image }}
                                style={styles.imageStyle}
                            />
                            <TouchableOpacity
                                onPress={() => setImage(null)}
                                style={styles.deleteButton}>
                                <FontAwesome name='trash-o' size={20} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity style={globalStyles.addButton} onPress={saveRecipe}>
                        <Text style={globalStyles.buttonTextStyle}>Save!</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        marginBottom: 90
    },
    inputContainer: {
        flex: 1,
        padding: 16,
        alignContent: 'center'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        padding: 8,
        borderRadius: 10,
        color: 'grey',
        flex: 4
    },
    instructionsInput: {
        height: 80,
        textAlignVertical: 'top'
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        marginLeft: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'black'
    },
    ingredientsList: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
        padding: 3,
        marginBottom: 8,
        backgroundColor: 'rgba(194, 165, 130, 1)'
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'space-between'
    },
    imageStyle: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    imageBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    quantity: {
        flex: 2,
    },
    ingredientInput: {
        flex: 2
    },
    dropdown: {
        marginHorizontal: 4,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        flex: 3,
        height: 40,
        padding: 4,
        marginBottom: 8,
    },
    placeholderStyle: {
        fontSize: 13,
        color: 'gray',
    },
    selectedTextStyle: {
        fontSize: 13,
        color: 'gray'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 13,
        color: 'gray'
    },
    labelStyle: {
        fontSize: 15,
        margin: 2,
        marginBottom: 5,
        backgroundColor: 'rgba(231, 217, 203, 220)',
        padding: 2,
        borderRadius: 5
    },
    buttonMargin: {
        marginBottom: 8
    }
})

export default NewRecipe;