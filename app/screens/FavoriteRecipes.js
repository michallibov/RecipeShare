import React, { useState, useCallback } from 'react'
import { Text, StyleSheet, ScrollView, View, ActivityIndicator, RefreshControl } from 'react-native'
import { getAuth } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import Search from '../components/Search'
import { useFocusEffect } from '@react-navigation/native';
import SavedRecipe from '../components/SavedRecipe';
import globalStyles from '../config/colors';

FavoriteRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


    const fetchRecipes = async () => {
        try {
          setIsLoading(true);
          const auth = getAuth();
          const user = auth.currentUser;
    
          if (user) {
            const querySnapshot = await getDocs(
              query(collection(FIREBASE_DB, 'FavoriteRecipes'), where('email', '==', user.email))
            );
            const recipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
              setRecipes(recipesData);
              console.log(recipes)
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error fetching recipes:', error);
          setIsLoading(false);
        }
    };

    const handleChange = () => {
        fetchRecipes();
    }
  
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchRecipes();
      setRefreshing(false);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
          fetchRecipes();
        }, [])
    );
    
  return (
    <SafeAreaView style={globalStyles.container}>
       <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
          <Search />
          {isLoading ? <ActivityIndicator size={40} color={'black'}/> : 
              <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
              {recipes.length === 0 ? (
                <View style={styles.emptyList}>
                  <Text>No matching recipes found!</Text>
                </View>
              ) : (
                recipes.map((recipe, index) => (
                    <SavedRecipe key={index} recipe={recipe} onChange={handleChange} />
                ))
              )}
            </ScrollView>
        }
      </ScrollView>
    </SafeAreaView>      
  )
}

const styles = StyleSheet.create({
})

export default FavoriteRecipes;