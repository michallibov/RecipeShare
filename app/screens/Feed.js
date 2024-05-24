import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView , StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDocs, collection } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import Search from '../components/Search';
import RecipeCard from '../components/RecipeCard';
import globalStyles from '../config/colors';

const Feed = ({navigation}) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openRecipeId, setOpenRecipeId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'Recipes'));

        const recipesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const recipesWithUniqueIds = recipesData.map((recipe, index) => ({ ...recipe, id: `${recipe.id}_${index}` }));
        setRecipes(recipesWithUniqueIds);
        setFilteredRecipes(recipesData); 
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = (text) => {
    setIsLoading(true);
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRecipes(filtered);
    setIsLoading(false);
  };

  const handleFilter = (filters) => {
    setIsLoading(true);
    if (filters.length === 0) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        filters.every(filter => recipe.tags.includes(filter))
      );
      setFilteredRecipes(filtered);
    }
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecipes();
    setRefreshing(false);
  }, []);

  const toggleRecipe = (recipeId) => {
    setOpenRecipeId(openRecipeId === recipeId ? null : recipeId);
  };

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
        <Search onSearch={handleSearch} onFilter={handleFilter}/>
        {isLoading ? <ActivityIndicator size={40} color={'black'}/> : 
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {filteredRecipes.length === 0 ? (
                  <View style={styles.emptyList}>
                    <Text>No matching recipes found!</Text>
                  </View>
                ) : (
                  filteredRecipes.map((recipe) => (
                    recipe.shared && <RecipeCard
                      key={recipe.id}
                      id={recipe.id}
                      recipe={recipe}
                      isOpen={openRecipeId === recipe.id}
                      toggleRecipe={toggleRecipe}
                    />
                    
                  ))
                )}
              </ScrollView>
        }
      </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyList: {
    justifyContent: 'center',
    alignContent: 'center',
    padding: 5,
    flexDirection: 'row',
  },
});

export default Feed;
