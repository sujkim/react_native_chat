import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  NavigationContainer,
  NavigationHelpersContext,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Chats from './src/screens/Chats';
import SignIn from './src/screens/SignIn';
import ChatDetail from './src/screens/ChatDetail';
import SignUp from './src/screens/SignUp';
import signOutButton from './src/components/signOutButton';
import NewMessage from './src/screens/NewMessage';

const Stack = createNativeStackNavigator();

function App() {
  // Check for user
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const headerColor = '#FA8062';
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Chats"
            component={Chats}
            options={{
              headerTitle: '',
              headerStyle: {backgroundColor: headerColor},
              // headerTitleStyle: {fontSize: 10},
              headerRight: () => signOutButton(user),
            }}
          />
          <Stack.Screen
            name="Chat Detail"
            component={ChatDetail}
            options={{
              headerStyle: {backgroundColor: headerColor},
              headerTintColor: 'white',
              // headerLeft: <Button title="Chats" onPress={() => <Chats />} />,
            }}
          />
          <Stack.Screen
            name="New Message"
            component={NewMessage}
            options={{
              headerTitle: '',
              headerTitleStyle: {fontSize: 25},
              headerStyle: {backgroundColor: headerColor},
              // headerRight: () => signOutButton(user),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Sign Up"
            component={SignUp}
            options={{
              headerStyle: {backgroundColor: headerColor},

              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="Sign In"
            component={SignIn}
            options={{
              headerStyle: {backgroundColor: headerColor},
              headerBackVisible: false,
              headerTintColor: 'white',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // return <LogIn />;
  }
}
export default App;
