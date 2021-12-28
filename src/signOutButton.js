import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {NavigationHelpersContext} from '@react-navigation/native';
import SignIn from './SignIn';

const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      console.log('Signed Out!');
      return <SignIn />;
    })
    .catch(error => {
      console.error(error);
    });
};

export default function signOutButton(user) {
  return (
    <Pressable onPress={() => signOut()}>
      <View style={styles.button}>
        <Text style={{fontSize: 15, color: 'white'}}>Sign Out</Text>
      </View>
    </Pressable>
    // <View>
    //   <Text>Hi!</Text>
    // </View>
  );
}

styles = StyleSheet.create({
  image: {
    backgroundColor: 'blue',
    width: 30,
    height: 30,
    // resizeMode: 'contain',
    borderRadius: 20,
    overflow: 'hidden',
  },

  button: {
    padding: 10,
    backgroundColor: '#22577E',
    borderRadius: 10,
  },
});
