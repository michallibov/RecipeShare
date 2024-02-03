import React, {useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text,  View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import Recipe from '../components/Recipe'
import { StyleSheet } from 'react-native'
import { getAuth } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { FIREBASE_DB } from '../../FirebaseConfig'
import Search from '../components/Search'
import globalStyles from '../config/colors'

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecipes = async () => {
        try {
            setIsLoading(true);
            const auth = getAuth();
            const user = auth.currentUser;
  
            if (user) {
                const userEmail = user.email;
                console.log(userEmail);
                const querySnapshot = await getDocs(
                    query(collection(FIREBASE_DB, 'recipes'), where('email', '==', userEmail))
                );
  
                const recipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setRecipes(recipesData);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setIsLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRecipes();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, []);
    
    const handleChange = () => {
        fetchRecipes();
    };

    const handleSearch = (text) => {
        setIsLoading(true);
        const filtered = recipes.filter(recipe =>
          recipe.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredRecipes(filtered);
        setIsLoading(false);
    };

    return (
        <View style={globalStyles.container}>
            <ScrollView
                    refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <SafeAreaView>
                    <Search onSearch={handleSearch} />
                    {isLoading ? <ActivityIndicator size={40} color={'black'} /> :
                        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                            {recipes.length === 0 ?
                                <View style={styles.emptyList}>
                                    <Text>You don't have any recipes yet!</Text>
                                </View>
                                :
                                recipes.map((recipe, index) => (
                                    <Recipe key={index} recipe={recipe} index={index} onChange={handleChange} />
                                ))}
                        </ScrollView>
                    }
                </SafeAreaView>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    emptyList: {
        justifyContent: 'center',
        alignContent: 'center',
        padding: 5,
        flexDirection: 'row',
    },
});

export default MyRecipes;