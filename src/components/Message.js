import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';

const Message = () => {
  const sendMessage = () => {
    console.log('send');
    console.log(user, to, user.displayName, message, user.photoURL);
    if (to && message) {
      firestore()
        .collection('chats')
        .add({
          fromTo: {
            from: user.email,
            to: to,
          },
          fromToArray: [user.email, to],
          name: user.displayName,
          message: message,
          imageURL: user.photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          // navigation.navigate('Chat Detail', {user: user, to: to});

          navigation.navigate('Chats');
        });
      // .catch(error => {
      //   console.log(error);
      // });
    }
  };

  return (
    <View style={styles.messageContainer}>
      <TextInput
        style={styles.text}
        onChangeText={onChangeMessage}
        value={message}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => sendMessage()}>
        <Image source={require('../assets/send.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Message;
