import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';

const CommentComponent = ({ comment, recipe, onDeleteComment }) => {
    const currentUserEmail = getAuth().currentUser.email;
    const [like, setLike] = useState(comment.likes.includes(currentUserEmail));
    const [dislike, setDislike] = useState(comment.dislikes.includes(currentUserEmail));
    const [isLoading, setIsLoading] = useState(false);
    const [numOfDislikes, setNumOfDislikes] = useState(comment.dislikes ? comment.dislikes.length : 0);
    const [numOfLikes, setNumOfLikes] = useState(comment.likes ? comment.likes.length : 0);

    useEffect(() => {
        setLike(comment.likes ? comment.likes.includes(currentUserEmail) : false);
        setDislike(comment.dislikes ? comment.dislikes.includes(currentUserEmail) : false);
        setNumOfLikes(comment.likes ? comment.likes.length : 0);
        setNumOfDislikes(comment.dislikes ? comment.dislikes.length : 0);
    }, [comment.likes, comment.dislikes, currentUserEmail]);

    const deleteComment = async () => {
        try {
            onDeleteComment();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }

    const updateComment = async (updatedComment) => {
        try {
            const recipeRef = doc(FIREBASE_DB, 'recipes', recipe.id);
            const recipeSnapshot = await getDoc(recipeRef);
            const recipeData = recipeSnapshot.data();
            const updatedComments = recipeData.comments.map(c => {
                if (c.id === updatedComment.id) {
                    return updatedComment;
                }
                return c;
            });
            await updateDoc(recipeRef, { comments: updatedComments });
            return updatedComment;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    };

    const handleLike = async () => {
        try {
            setIsLoading(true); 

            let updatedComment;

            if (like) {
                const updatedLikes = comment.likes.filter(email => email !== currentUserEmail);
                updatedComment = { ...comment, likes: updatedLikes };
            } else if (dislike) {
                const updatedDislikes = comment.dislikes.filter(email => email !== currentUserEmail);
                const updatedLikes = [...comment.likes, currentUserEmail];
                updatedComment = { ...comment, dislikes: updatedDislikes, likes: updatedLikes };
            } else {
                const updatedLikes = [...comment.likes, currentUserEmail];
                updatedComment = { ...comment, likes: updatedLikes };
            }

            updatedComment = await updateComment(updatedComment); 

            setNumOfDislikes(updatedComment.dislikes.length);
            setNumOfLikes(updatedComment.likes.length);
            setDislike(updatedComment.dislikes.includes(currentUserEmail));
            setLike(updatedComment.likes.includes(currentUserEmail));
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDislike = async () => {
        try {
            setIsLoading(true);

            let updatedComment;

            if (dislike) {
                const updatedDislikes = comment.dislikes.filter(email => email !== currentUserEmail);
                updatedComment = { ...comment, dislikes: updatedDislikes };
            } else if (like) {
                const updatedLikes = comment.likes.filter(email => email !== currentUserEmail);
                const updatedDislikes = [...comment.dislikes, currentUserEmail];
                updatedComment = { ...comment, dislikes: updatedDislikes, likes: updatedLikes };
            } else {
                const updatedDislikes = [...comment.dislikes, currentUserEmail];
                updatedComment = { ...comment, dislikes: updatedDislikes };
            }

            updatedComment = await updateComment(updatedComment); 

            setNumOfDislikes(updatedComment.dislikes.length);
            setNumOfLikes(updatedComment.likes.length);
            setDislike(updatedComment.dislikes.includes(currentUserEmail));
            setLike(updatedComment.likes.includes(currentUserEmail));
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.comment}>
            <View style={styles.commentContainer}>
                <View style={styles.authorContainer}>
                    <Image
                        source={comment.author.image !== '../assets/chef.png' ? { uri: comment.author.image } : require('../assets/chef.png')} 
                        style={styles.profilePicture} 
                    />
                    <Text style={styles.authorText}>{comment.author.nickname ? comment.author.nickname : comment.author.email}</Text>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.iconButton, { marginRight: 10 }]} onPress={handleLike}>
                    <FontAwesome
                        name={like ? 'thumbs-up' : 'thumbs-o-up'}
                        size={20}
                        color={like ? 'blue' : 'black'}
                    />
                    <Text style={{ marginLeft: 5 }}>{numOfLikes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleDislike}>
                    <FontAwesome
                        name={dislike ? 'thumbs-down' : 'thumbs-o-down'}
                        size={20}
                        color={dislike ? 'red' : 'black'}
                    />
                    <Text style={{ marginLeft: 5 }}>{numOfDislikes}</Text>
                </TouchableOpacity>
            </View>
            {getAuth().currentUser.email === comment.author.email && (
                <TouchableOpacity style={styles.deleteButton} onPress={deleteComment}>
                    <FontAwesome name='trash-o' size={20} color='gray' />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    comment: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#6e492a',
        marginBottom: 10,
        padding: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    authorText: {
        fontWeight: 'bold',
    },
    commentText: {
        flex: 1,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default CommentComponent;
