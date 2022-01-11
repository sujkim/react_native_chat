import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {useHeaderHeight} from '@react-navigation/elements';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
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
  const flatlist = useRef(null);
  const user = auth().currentUser;
  const email = route.params.email;
  const name = route.params.details.displayName;
  const photoURL = route.params.details.photoURL;
  const headerHeight = useHeaderHeight();

  const chatsCollection = firestore().collection('chats');

  // set header to contact's name
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerTitleStyle: {fontSize: 20},
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
      message: message,
      photoURL: user.photoURL,
      uid: user.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    onChangeMessage('');
  };

  useEffect(() => {
    let isMounted = true;
    const chat = chatsCollection.orderBy('createdAt').onSnapshot(
      querySnapshot => {
        const chats = [];
        querySnapshot.forEach(documentSnapshot => {
          if (
            (documentSnapshot.get('fromToArray')[0] == user.email &&
              documentSnapshot.get('fromToArray')[1] == email) ||
            (documentSnapshot.get('fromToArray')[0] == email &&
              documentSnapshot.get('fromToArray')[1] == user.email)
          ) {
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
        <ActivityIndicator style={{flex: 1}} />
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
          ref={flatlist}
          onContentSizeChange={() =>
            flatlist.current.scrollToEnd({animated: false})
          }
          onLayout={() => flatlist.current.scrollToEnd()}
          // inverted
          data={chats}
          renderItem={({item}) => (
            <View style={{flex: 1}}>
              <View
                style={[
                  styles.tile,
                  item.uid == user.uid && {flexDirection: 'row-reverse'},
                ]}>
                <Image source={{uri: item.photoURL}} style={styles.image} />
                <View
                  style={[
                    styles.messageBackground,
                    item.uid != user.uid && {backgroundColor: '#E8E8E8'},
                  ]}>
                  <Text
                    style={[
                      styles.messageText,
                      item.uid == user.uid && {color: 'white'},
                    ]}>
                    {item.message}
                  </Text>
                </View>

                <Text style={styles.time}>
                  {item.createdAt &&
                    item.createdAt.toDate().toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                </Text>
              </View>
            </View>
          )}
        />

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

  tile: {
    flexDirection: 'row',
    borderColor: primaryColor,
    padding: 10,
    marginRight: 60,
  },

  messageBackground: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: primaryColor,
    borderRadius: 10,
  },

  messageText: {
    fontSize: 16,
  },

  image: {
    width: 40,
    height: 40,
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },

  time: {
    fontSize: 10,
    color: 'grey',
    alignSelf: 'flex-end',
  },

  messageContainer: {
    marginBottom: 30,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderWidth: 0.3,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
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
