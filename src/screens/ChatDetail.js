import React, {useEffect, useState} from 'react';
import {useHeaderHeight} from '@react-navigation/elements';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ChatDetail({navigation, route}) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState(['']);
  const [message, onChangeMessage] = useState(null);
  const user = auth().currentUser;
  const email = route.params.email;
  const name = route.params.details.displayName;
  const photoURL = route.params.details.photoURL;

  const chatsCollection = firestore().collection('chats');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  });

  const sendMessage = () => {
    chatsCollection.add({
      fromTo: {
        from: {displayName: user.displayName, photoURL: user.photoURL},
        to: {
          displayName: name,
          photoURL: photoURL,
        },
      },
      fromToArray: [user.email, email],
      name: user.displayName,
      message: message,
      photoURL: user.photoURL,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    onChangeMessage('');
  };

  useEffect(() => {
    let isMounted = true;
    const chat = chatsCollection
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const chats = [];
        querySnapshot.forEach(documentSnapshot => {
          if (
            (documentSnapshot.get('fromToArray')[0] == user.email &&
              documentSnapshot.get('fromToArray')[1] == email) ||
            (documentSnapshot.get('fromToArray')[0] == email &&
              documentSnapshot.get('fromToArray')[1] == user.email)
          ) {
            console.log(chats);
            chats.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          }
        });
        if (isMounted) {
          setChats(chats);
          setLoading(false);
        }
      });

    return () => {
      chat;
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator style={{flex: 2}} size="large" color="blue" />
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}></View>
      </View>
    );
  }

  return (
    // <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
    <View style={{flex: 1}}>
      <FlatList
        inverted
        style={styles.chat}
        data={chats}
        renderItem={({item}) => (
          <View style={styles.container}>
            <View
              style={
                item.fromToArray[0] == user.email ? styles.user : styles.tile
              }>
              <Image source={{uri: item.photoURL}} style={styles.image} />
              <View
                style={
                  item.fromToArray[0] == user.email
                    ? styles.messageBackground
                    : {
                        marginLeft: 10,
                        padding: 10,
                        borderWidth: 0.3,
                        borderRadius: 10,
                      }
                }>
                <Text>{item.message}</Text>
              </View>

              <Text style={{alignSelf: 'center'}}>
                {/* {item.createdAt.toDate().toLocaleTimeString()} */}
              </Text>
            </View>
          </View>
        )}
      />
      <KeyboardAvoidingView
        behavior="padding"
        style={{}}
        keyboardVerticalOffset={useHeaderHeight()}>
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
      </KeyboardAvoidingView>
    </View>
    // </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },

  chat: {
    flex: 1,
    // flexDirection: 'column-reverse',
    // marginBottom: 30,
    // paddingBottom: 10,
  },

  tile: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    margin: 10,
    padding: 10,
    // backgroundColor: 'red',
    color: 'red',
    // borderBottomWidth: 0.2,
  },

  user: {
    flexDirection: 'row-reverse',
    // justifyContent: 'space-between',
    margin: 10,
    padding: 10,
    // backgroundColor: 'red',
    // color: 'red',
    // borderBottomWidth: 0.2,
  },

  main: {
    // backgroundColor: 'red',
    marginLeft: 30,
  },

  messageBackground: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#AEE1E1',
    borderRadius: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  image: {
    backgroundColor: 'blue',
    width: 40,
    padding: 20,
    // resizeMode: 'contain',
    borderRadius: 20,
    overflow: 'hidden',
  },

  date: {
    fontSize: 10,
  },

  messageContainer: {
    marginBottom: 30,
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
    tintColor: '#5b8c8c',

    // padding: 10,
    // alignSelf: 'flex-end',
  },
});
