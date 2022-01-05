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
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import {useHeaderHeight} from '@react-navigation/elements';
import {clear} from 'react-native/Libraries/LogBox/Data/LogBoxData';

const NewMessage = ({navigation}) => {
  const [to, onChangeTo] = useState(null);
  const [message, onChangeMessage] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [selected, setSelected] = useState(false);
  const user = auth().currentUser;

  const selectedText = '#0f7d7d';

  const searchUser = async () => {
    await firestore()
      .collection('users')
      .where('email', '==', to.toLowerCase())
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setReceiver({
            photoURL: null,
            displayName: 'User not found',
            email: null,
          });
        }
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.exists) {
            setReceiver(documentSnapshot.data());
          } else {
            console.log('dont exist');
          }
        });
      });
  };

  const sendMessage = () => {
    if (receiver && message) {
      firestore()
        .collection('chats')
        .add({
          fromTo: {
            from: {displayName: user.displayName, photoURL: user.photoURL},
            to: {
              displayName: receiver.displayName,
              photoURL: receiver.photoURL,
            },
          },
          fromToArray: [user.email, receiver.email],
          name: user.displayName,
          message: message,
          photoURL: user.photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          navigation.navigate('Chats');
        });
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
        <View>
          <View style={styles.toInput}>
            <Text>To: </Text>
            {selected ? (
              <TextInput
                defaultValue={receiver.displayName}
                style={[styles.input, {color: selectedText}]}
                selectTextOnFocus={true}
                onPressIn={() => {
                  setSelected(false);
                }}
                onChangeText={onChangeTo}
                value={to}
                placeholder="name@email.com"
                autoCapitalize="none"
                autoFocus={true}
                onSubmitEditing={() => searchUser()}
                returnKeyType="search"
              />
            ) : (
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
            )}
          </View>
        </View>
        {receiver && !selected && (
          <View>
            <Pressable
              onPress={() => {
                if (receiver.email) setSelected(true);
              }}>
              <View style={styles.tile}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: receiver.photoURL,
                    }}
                  />
                  <View>
                    <Text style={{color: selectedText, fontWeight: 'bold'}}>
                      {receiver.displayName}
                    </Text>
                    <Text style={{color: selectedText}}>{receiver.email}</Text>
                  </View>
                </View>
                <View>
                  {receiver.email && (
                    <Text style={{color: selectedText}}>Select</Text>
                  )}
                </View>
              </View>
            </Pressable>
          </View>
        )}
      </View>
      <View style={styles.messageContainer}>
        <TextInput
          style={styles.message}
          onChangeText={onChangeMessage}
          value={message}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => sendMessage()}>
          <Image source={require('../assets/send.png')} style={styles.send} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },

  toInput: {
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 0.2,
    borderColor: 'grey',
    marginHorizontal: 10,
  },

  input: {
    paddingStart: 10,
  },

  messageContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    borderWidth: 0.3,
    borderRadius: 20,
    alignSelf: 'center',
  },

  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 0.3,
  },

  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 20,
    backgroundColor: '#AEE1E1',
  },

  message: {
    width: '90%',
    padding: 20,
  },

  send: {
    height: 30,
    width: 30,
    tintColor: '#22577E',
  },
});

export default NewMessage;
