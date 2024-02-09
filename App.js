import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Navbar from './app/navigation/Navbar';
import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import Comments from './app/screens/Comments';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Navbar"
            component={Navbar}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Comments" 
          component={Comments}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
