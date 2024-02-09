import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import Feed from '../screens/Feed';
import Profile from '../screens/Profile';
import NewRecipe from '../screens/NewRecipe';
import MyRecipes from '../screens/MyRecipes';
import FavoriteRecipes from '../screens/FavoriteRecipes';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused, color, size) => {
  
    if (route.name === 'Feed') {
        return <FontAwesome name='home' size={size} color={color} />;
    } else if (route.name === 'FavoriteRecipes') {
        return <FontAwesome name='heart' size={size} color={color} />;
    } else if (route.name === 'NewRecipe') {
        return <Image source={require('../assets/addRecipe.png')} name='plus' style={styles.addRecipeStyle} />
    } else if (route.name === 'MyRecipes') {
        return <FontAwesome name='book' size={size} color={color} />
    } else if (route.name === 'Profile') {
        return <FontAwesome name='user' size={size} color={color} />;
    } 
};

const Navbar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                bottom: 25,
                left: 20,
                right: 20,
                borderRadius: 15,
                height: 60,
                },
                tabBarIcon: ({ focused, color, size }) => {
                return getTabBarIcon(route, focused, color, size+5);
                },
                tabBarActiveTintColor: '#a48c7c', 
                tabBarInactiveTintColor: '#734414', 
            })}
        >
            <Tab.Screen options={{ headerShown: false }} name="Feed" component={Feed} />
            <Tab.Screen options={{headerShown: false}} name="FavoriteRecipes" component={FavoriteRecipes} />
            <Tab.Screen options={{ headerShown: false }} name="NewRecipe" component={NewRecipe} />
            <Tab.Screen options={{headerShown: false}} name="MyRecipes" component={MyRecipes} />
            <Tab.Screen options={{ headerShown: false }} name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    addRecipeStyle: {
        width: 70,
        height: 70,
        marginTop: -30,
        backgroundColor: 'transparent'
    },
})

export default Navbar;