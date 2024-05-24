import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, ScrollView } from 'react-native';

const Search = ({ onSearch, onFilter }) => {
  const [searchRecipe, setSearchRecipe] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handlePress = async () => {
    await onSearch(searchRecipe);
    setSearchRecipe('');
  };

  const handleFilter = async (filter) => {
    setSelectedFilters(prevFilters => {
      let updatedFilters;
      if (prevFilters.includes(filter)) {
        updatedFilters = prevFilters.filter(item => item !== filter);
      } else {
        updatedFilters = [...prevFilters, filter];
      }
      onFilter(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a recipe"
          value={searchRecipe}
          onChangeText={(text) => setSearchRecipe(text)}
        />
        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Search!</Text>
        </Pressable>
        <View style={styles.filtersContainer}>
          <Pressable
            style={[styles.filterButton, selectedFilters.includes('Vegan') && styles.selectedFilter]}
            onPress={() => handleFilter('Vegan')}
          >
            <Text>Vegan</Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, selectedFilters.includes('Vegetarian') && styles.selectedFilter]}
            onPress={() => handleFilter('Vegetarian')}
          >
            <Text>Vegetarian</Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, selectedFilters.includes('Kosher') && styles.selectedFilter]}
            onPress={() => handleFilter('Kosher')}
          >
            <Text>Kosher</Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, selectedFilters.includes('Halal') && styles.selectedFilter]}
            onPress={() => handleFilter('Halal')}
          >
            <Text>Halal</Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, selectedFilters.includes('Gluten Free') && styles.selectedFilter]}
            onPress={() => handleFilter('Gluten Free')}
          >
            <Text>Gluten Free</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    width: 180
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#6e492a',
  },
  buttonText: {
    color: 'white',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginLeft: 5,
  },
  selectedFilter: {
    backgroundColor: '#f7f3f2',
  },
  scrollContainer: {
    padding: 10
  }
});

export default Search;
