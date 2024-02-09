import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import globalStyles from '../config/colors';
import { FontAwesome } from '@expo/vector-icons';
import { doc, updateDoc, getDoc, getDocs, collection } from "firebase/firestore"; 
import { FIREBASE_DB } from '../../FirebaseConfig';
import CommentComponent from '../components/CommentComponent';
import { getAuth } from 'firebase/auth';

const Comments = ({ route }) => {
    const { recipe } = route.params;
    const [newComment, setNewComment] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(recipe);
    const [isLoading, setIsLoading] = useState(false);

    const addComment = async () => {
        if (newComment === '')
            return;

        try {
            setIsLoading(true);
            const recipeRef = await doc(FIREBASE_DB, 'recipes', recipe.id);
            const recipeDoc = await getDoc(recipeRef);
            const existingComments = recipeDoc.data().comments || [];
            const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Users'));
            const userData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const user = getAuth().currentUser;
            const currentUser = userData.filter(usr => usr.email === user.email);

            const commentData = {
                comment: newComment,
                likes: [],
                dislikes: [],
                author: currentUser[0]
            }
            
            const updatedComments = [...existingComments, commentData];

            await updateDoc(recipeRef, { comments: updatedComments });
            setNewComment('');

            // Fetch the updated recipe data after adding the comment
            const updatedRecipeDoc = await getDoc(recipeRef);
            const updatedRecipeData = updatedRecipeDoc.data();
            // Update the current recipe state with the new comment
            setCurrentRecipe(updatedRecipeData);
            setIsLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Fetch the latest recipe data from Firebase
        const recipeRef = doc(FIREBASE_DB, 'recipes', recipe.id);
        const updatedRecipeDoc = await getDoc(recipeRef);
        const updatedRecipeData = updatedRecipeDoc.data();
        // Update the current recipe state with the latest data
        setCurrentRecipe(updatedRecipeData);
        setRefreshing(false);
    }, [recipe.id]);

    const deleteComment = async (index) => {
        try {
            const recipeRef = doc(FIREBASE_DB, 'recipes', recipe.id);
            const recipeSnapshot = await getDoc(recipeRef);
            const recipeData = recipeSnapshot.data();
            const updatedComments = [...recipeData.comments];
            updatedComments.splice(index, 1);

            await updateDoc(recipeRef, { comments: updatedComments });

            setCurrentRecipe({
                ...currentRecipe,
                comments: updatedComments
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                <View style={styles.card}>
                    <Text style={styles.recipeTitle}>{currentRecipe.title} by {currentRecipe.nickname ? currentRecipe.nickname : currentRecipe.email}</Text>
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: currentRecipe.image }} style={styles.image} />
                    </View> 
                    <Text style={styles.sectionTitle}>Ingredients:</Text>
                    <ScrollView contentContainerStyle={styles.ingredientsContainer}>
                        {currentRecipe.ingredients.map((ingredient, index) => (
                            <Text key={index} style={styles.ingredient}>
                                {<FontAwesome name="check-square-o" />} {ingredient.quantity} {ingredient.measurement && ingredient.measurement.label} {ingredient.name}
                            </Text>
                        ))}
                    </ScrollView>
                    <Text style={styles.sectionTitle}>Instructions:</Text>
                    <Text style={styles.instructions}>{currentRecipe.instructions}</Text>
                    <View style={styles.commentsContainer}>  
                        <Text style={styles.sectionTitle}>Comments:</Text>
                        <ScrollView contentContainerStyle={styles.commentsList}>
                            {currentRecipe.comments.length === 0 ? <Text style={styles.noCommentsText}>No comments yet..</Text> :
                                <View style={styles.commentItem}>
                                    {
                                        currentRecipe.comments.map((comment, index) => (
                                            <View key={index}>
                                                <CommentComponent
                                                    comment={comment}
                                                    recipe={recipe}
                                                    onDeleteComment={() => deleteComment(index)}
                                                />
                                            </View>
                                        ))
                                    }
                                </View>
                            }
                        </ScrollView>
                    </View>
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChangeText={setNewComment}
                        />
                        <TouchableOpacity style={[globalStyles.addButton, styles.commentButton]} onPress={addComment}>
                            {isLoading ?
                                <ActivityIndicator  size={20} color={'white'} />
                                : <Text style={styles.commentButtonText}>Post</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        marginVertical: 20,
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginTop: StatusBar.currentHeight + 20,
    },
    imageWrapper: {
        borderRadius: 10,
        overflow: 'hidden', // Clip the image to the border radius
        marginBottom: 10,
    },
    recipeTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        color: '#333333',
    },
    image: {
        width: '100%',
        height: 200,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        color: '#333333',
    },
    ingredientsContainer: {
        paddingBottom: 10,
    },
    ingredient: {
        marginBottom: 5,
        color: '#333333',
    },
    instructions: {
        marginBottom: 10,
        color: '#333333',
    },
    commentsContainer: {
        marginTop: 10,
    },
    commentsList: {
        paddingBottom: 10,
    },
    commentItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    noCommentsText: {
        fontStyle: 'italic',
        color: '#333333',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        height: 40,
        color: '#333333',
    },
    commentButton: {
        backgroundColor: '#6e492a',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
    },
    commentButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Comments;
