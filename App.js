import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Chats from './src/Chats';
import SignIn from './src/Login';
import ChatDetail from './src/ChatDetail';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="SignIn" component={SignIn} />

        <Stack.Screen name="ChatDetail" component={ChatDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
