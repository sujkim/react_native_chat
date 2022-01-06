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
import {Header} from 'react-native/Libraries/NewAppScreen';

export default function ChatDetail({navigation, route}) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState(['']);
  const [message, onChangeMessage] = useState(null);
  const user = auth().currentUser;
  const email = route.params.email;
  const name = route.params.details.displayName;
  const photoURL = route.params.details.photoURL;
  const headerHeight = useHeaderHeight();

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
      // fromToArray: [user.uid, uid],
      name: user.displayName,
      message: message,
      photoURL: user.photoURL,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    onChangeMessage('');
  };

  useEffect(() => {
    let isMounted = true;
    const chat = chatsCollection.orderBy('createdAt', 'desc').onSnapshot(
      querySnapshot => {
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
      },
      error => {
        console.log(error);
      },
    );

    return () => {
      chat;
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator style={{flex: 2}} />
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}></View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      behavior="padding"
      style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#F6F6F6'}}>
        <FlatList
          inverted
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
                      : [
                          styles.messageBackground,
                          {
                            backgroundColor: 'white',
                          },
                        ]
                  }>
                  <Text
                    style={
                      item.fromToArray[0] == user.email
                        ? {color: 'white'}
                        : {color: 'black'}
                    }>
                    {item.message}
                  </Text>
                </View>

                <Text style={{alignSelf: 'center'}}>
                  {/* {item.createdAt.toDate().toLocaleTimeString()} */}
                </Text>
              </View>
            </View>
          )}
        />
        {/* <KeyboardAvoidingView
        behavior="padding"
        style={{}}
        keyboardVerticalOffset={useHeaderHeight()}> */}
        <View style={styles.messageContainer}>
          <TextInput
            style={styles.message}
            onChangeText={onChangeMessage}
            value={message}
            autoCapitalize="none"
            multiline={true}
            textAlignVertical="bottom"
          />
          <TouchableOpacity onPress={() => sendMessage()}>
            <Image source={require('../assets/send.png')} style={styles.send} />
          </TouchableOpacity>
        </View>
        {/* </KeyboardAvoidingView> */}
      </View>
    </KeyboardAvoidingView>
  );
}

const primaryColor = '#4268AE';
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  container: {
    flex: 1,
  },

  tile: {
    flexDirection: 'row',
    borderColor: primaryColor,
    padding: 10,
    marginRight: 60,
  },

  user: {
    flexDirection: 'row-reverse',
    marginRight: 60,
    padding: 10,
  },

  main: {
    marginLeft: 30,
  },

  messageBackground: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: primaryColor,
    borderRadius: 10,
    // shadowOpacity: 0.2,
  },

  messageText: {
    color: 'white',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  image: {
    width: 40,
    height: 40,
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },

  date: {
    fontSize: 10,
  },

  messageContainer: {
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderWidth: 0.3,
    borderRadius: 20,
    alignSelf: 'center',
  },

  message: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    paddingStart: 20,
    paddingEnd: 20,
  },

  send: {
    height: 30,
    width: 30,
    tintColor: primaryColor,
  },
});
