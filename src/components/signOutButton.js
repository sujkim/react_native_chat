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
import SignIn from '../screens/SignIn';

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
        <Image style={styles.image} source={require('../assets/logout.png')} />
        {/* <Text style={{fontSize: 15, color: 'white'}}>Sign Out</Text> */}
      </View>
    </Pressable>
    // <View>
    //   <Text>Hi!</Text>
    // </View>
  );
}

styles = StyleSheet.create({
  image: {
    // backgroundColor: 'blue',
    width: 20,
    height: 20,
    resizeMode: 'contain',
    // borderRadius: 20,
    // overflow: 'hidden',
    // tintColor: '#5b8c8c',
  },

  button: {
    // padding: 10,
    // backgroundColor: '#22577E',
    // borderRadius: 10,
  },
});
