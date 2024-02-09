import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, Pressable, Animated, TouchableOpacity } from 'react-native';
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FIREBASE_DB } from '../../FirebaseConfig';
import Star from './Star';
import { FontAwesome } from '@expo/vector-icons';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const RecipeCard = ({ recipe, isOpen, toggleRecipe }) => {
    const [starRating, setStarRating] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const currentUserEmail = getAuth().currentUser.email;
    const [isLoading, setIsLoading] = useState(false);
    const [savedRecipe, setSavedRecipe] = useState(false);
    const [savingLoading, setSavingLoading] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const navigation = useNavigation(); // Use useNavigation hook to get navigation prop
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const userRating = recipe.ratings ? recipe.ratings.find((rating) => rating.userId === currentUserEmail) : null;
                setStarRating(userRating ? userRating.rating : null);
                setAverageRating(recipe.ratings ? calculateAverageRating(recipe.ratings) : 0);
                await checkIfSaved();
            } catch (error) {
                console.error('Error in useEffect:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [recipe.ratings, currentUserEmail, recipe.comments]);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isOpen ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isOpen]);

    const checkIfSaved = async () => {
        try {
            const favoriteRecipeRef = doc(FIREBASE_DB, 'favorite-recipes', recipe.id);
            const favoriteRecipeDoc = await getDoc(favoriteRecipeRef);

            if (favoriteRecipeDoc.exists()) {
                setSavedRecipe(true);
            } else {
                setSavedRecipe(false);
            }
        } catch (error) {
            console.error('Error checking if recipe is saved:', error);
        }
    };

    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) {
            return 0;
        }

        const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
        const average = sum / ratings.length;

        return Math.round(average * 10) / 10;
    };

    const saveRecipe = async () => {
        try {
            setSavingLoading(true);

            const favoriteRecipeRef = doc(FIREBASE_DB, 'favorite-recipes', recipe.id);
            const favoriteRecipeDoc = await getDoc(favoriteRecipeRef);

            if (!favoriteRecipeDoc.exists()) {
                await setDoc(favoriteRecipeRef, recipe);
                setSavedRecipe(true);
            }

            setSavingLoading(false);
        } catch (error) {
            console.error('Error saving recipe:', error);
            setSavingLoading(false);
        }
    };

    const setRating = async (rating) => {
        try {
            setIsLoading(true);
            const recipeRef = doc(FIREBASE_DB, 'recipes', recipe.id);
            const recipeDoc = await getDoc(recipeRef);

            const userRatingIndex = recipeDoc.data().ratings.findIndex(
                (rating) => rating.userId === currentUserEmail
            );

            let updatedRatings;

            if (userRatingIndex === -1) {
                updatedRatings = [
                    ...recipeDoc.data().ratings,
                    { userId: currentUserEmail, rating },
                ];
            } else {
                updatedRatings = [...recipeDoc.data().ratings];
                updatedRatings[userRatingIndex] = { userId: currentUserEmail, rating };
            }

            await updateDoc(recipeRef, { ratings: updatedRatings });

            setStarRating(rating);
            setAverageRating(calculateAverageRating(updatedRatings));
            setIsLoading(false);
        } catch (error) {
            console.error('Error updating ratings:', error);
            setIsLoading(false);
        }
    };

    return (
        <Pressable onPress={() => toggleRecipe(recipe.id)}>
            <View style={styles.card}>
                <Collapse>
                    <CollapseHeader>
                        <View style={styles.header}>
                            <Image source={{ uri: recipe.image }} style={styles.image} />
                            <View style={styles.titleContainer}>
                                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                <Pressable style={styles.button} onPress={savedRecipe ? null : saveRecipe}>
                                    {savingLoading ? (
                                        <ActivityIndicator style={styles.activityIndicator} size={20} color={'black'} />
                                    ) : (
                                        <FontAwesome name={savedRecipe ? 'heart' : 'heart-o'} size={20} />
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        <View style={styles.body}>
                            <Text style={styles.subTitle}>Ingredients:</Text>
                            {recipe.ingredients.map((ingredient, index) => (
                                <Text key={index}><FontAwesome name="check-square-o" /> {ingredient.quantity} {(ingredient.measurement && ingredient.measurement.label !== '' ) ? ingredient.measurement.label + (ingredient.quantity  > 1 ? 's of' : ' of') : ''} {ingredient.name}</Text>
                            ))}
                            <Text style={styles.subTitle}>Instructions:</Text>
                            <Text>{recipe.instructions}</Text>
                        </View>
                    </CollapseBody>
                </Collapse>
                <View>
                    <View style={styles.author}><Text style={styles.subText}>Written by: {recipe.nickname ? recipe.nickname : recipe.email}</Text></View>
                    <View style={styles.ratingContainer}>
                        {isLoading ? (
                            <ActivityIndicator style={styles.activityIndicator} size={20} color={'black'} />
                        ) : (
                            <>
                                <View style={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <Star
                                            key={rating}
                                            isSelected={starRating >= rating}
                                            onPress={() => setRating(rating)}
                                        />
                                    ))}
                                </View>
                                <Text style={styles.rating}>{averageRating}/5</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.comments}>
                        <TouchableOpacity style={styles.commentsButton} onPress={() => navigation.navigate('Comments', {recipe: recipe})}>
                            <Text style={styles.commentsButtonText}>Comments</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#CBAE94',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    header: {
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 100,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
    },
    titleContainer: {
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    recipeTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: 'wheat',
        padding: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subTitle: {
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    body: {
        marginTop: 10,
    },
    subText: {
        marginTop: 5,
        color: 'white',
    },
    stars: {
        flexDirection: 'row',
    },
    rating: {
        marginLeft: 10,
        color: 'black',
    },
    ratingContainer: {
        alignItems: 'center',
    },
    activityIndicator: {
        marginLeft: 10,
    },
    author: {
        alignItems: 'center',
        marginBottom: 3
    },
    comments: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5
    },
    commentsButton: {
        backgroundColor: '#6e492a',
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white'
    },
    commentsButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default RecipeCard;
