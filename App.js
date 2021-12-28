import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  NavigationContainer,
  NavigationHelpersContext,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Chats from './src/Chats';
import SignIn from './src/SignIn';
import ChatDetail from './src/ChatDetail';
import SignUp from './src/SignUp';
import signOutButton from './src/signOutButton';
import NewMessage from './src/NewMessage';

const Stack = createNativeStackNavigator();

function App() {
  // Check for user
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // const [noUser, set]

  // Handle user state changes
  function onAuthStateChanged(user) {
    // if (user) auth().currentUser.reload();
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (user) {
    // console.log(user);
    // return <Chats />;
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Chats"
            component={Chats}
            options={{
              headerTitle: '',
              headerTitleStyle: {fontSize: 25},
              headerRight: () => signOutButton(user),
            }}
          />

          <Stack.Screen
            name="Chat Detail"
            component={ChatDetail}
            options={
              {
                // headerLeft: <Button title="Chats" onPress={() => <Chats />} />,
              }
            }
          />
          <Stack.Screen
            name="New Message"
            component={NewMessage}
            options={{
              headerTitle: '',
              headerTitleStyle: {fontSize: 25},
              // headerRight: () => signOutButton(user),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // navigate('Chats', {user: user});
    // return <Chats user={user} />;
  }

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Sign In" component={SignIn} />
          <Stack.Screen name="Sign Up" component={SignUp} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    // return <LogIn />;
  }
}
export default App;
