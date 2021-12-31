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

const NewMessage = ({navigation}) => {
  const [to, onChangeTo] = useState(null);
  const [message, onChangeMessage] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const user = auth().currentUser;

  const searchUser = async () => {
    console.log('searching');
    const user = await firestore()
      .collection('users')
      .where('email', '==', to.toLowerCase())
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.exists) {
            console.log('yes', documentSnapshot.data());
            setReceiver(documentSnapshot.data());
          }
        });
      });
  };

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

    // add the message to firebase
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            New Message
          </Text>
          <Button
            onPress={() => navigation.pop()}
            title="Cancel"
            color="#22577E"
          />
        </View>
        <View style={styles.toInput}>
          <Text>To: </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTo}
            value={to}
            placeholder="name@email.com"
            autoCapitalize="none"
            autoFocus={true}
            onSubmitEditing={() => searchUser()}
            returnKeyType="search"
          />
        </View>
        {receiver ? (
          <View
            style={{
              alignSelf: 'center',
              borderWidth: 0.5,
              padding: 30,
              height: '50%',
              width: '50%',
              alignItems: 'center',
            }}>
            <Text>{receiver.displayName}</Text>
            <Image
              source={{uri: receiver.photoURL}}
              style={{height: '50%', resizeMode: 'contain'}}
            />
            <TouchableOpacity>
              <Text>Add</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <SafeAreaView>
        <View style={styles.messageContainer}>
          {/* <SafeAreaView> */}
          <TextInput
            style={styles.message}
            onChangeText={onChangeMessage}
            value={message}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => sendMessage()}>
            <Image source={require('../assets/send.png')} style={styles.send} />
          </TouchableOpacity>
          {/* </SafeAreaView> */}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    // borderWidth: 0.2,
    // backgroundColor: '#70a1c4',
  },

  toInput: {
    padding: 20,
    // backgroundColor: 'red',
    flexDirection: 'row',
    // borderWidth: 2,
  },

  input: {
    paddingStart: 10,
    // borderWidth: 2,
  },
  messageContainer: {
    // position: 'relative',
    flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'flex-end',
    alignItems: 'center',
    // height: '80%',
    // marginStart: 30,
    width: '90%',
    borderWidth: 0.3,
    // height: '10%',
    // backgroundColor: 'red',
    borderRadius: 20,
    alignSelf: 'center',
  },

  message: {
    width: '90%',
    padding: 20,
    // borderRadius: 20,
    // height: '80%',
    // backgroundColor: 'red',
    // borderWidth: 0.3,
  },

  send: {
    // resizeMode: 'contain',
    height: 30,
    width: 30,
    tintColor: '#22577E',
    // padding: 10,
    // alignSelf: 'flex-end',
  },

  body: {},
});

export default NewMessage;
