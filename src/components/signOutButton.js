import React from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';

import auth from '@react-native-firebase/auth';

const signOut = () => {
  auth()
    .signOut()
    .then(() => {
      console.log('Signed Out!');
    })
    .catch(error => {
      console.error(error);
    });
};

export default function signOutButton() {
  return (
    <Pressable onPress={() => signOut()}>
      <View>
        <Image style={styles.image} source={require('../assets/logout.png')} />
      </View>
    </Pressable>
  );
}

styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
