import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ChatDetail({navigation, route}) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState(['']);
  const [message, onChangeMessage] = useState(null);
  const other = route.params.to;
  const [user, setUser] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  });

  const chatsCollection = firestore().collection('chats');

  // const sendMessage = () => {
  //   if (to && message) {
  //     firestore()
  //       .collection('chats')
  //       .add({
  //         fromTo: {
  //           from: user.email,
  //           to: to,
  //         },
  //         fromToArray: [user.email, to],
  //         name: user.displayName,
  //         message: message,
  //         imageURL: user.photoURL,
  //         createdAt: firestore.FieldValue.serverTimestamp(),
  //       });
  //   }
  //   onChangeMessage('');
  // };

  const sendMessage = () => {
    console.log('send');
    console.log(user, other, user.displayName, message, user.photoURL);
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
          fromToArray: [user.email, other],
          name: user.displayName,
          message: message,
          photoURL: user.photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          navigation.navigate('Chats');
        });
    }
    onChangeMessage('');
  };

  useEffect(() => {
    const user = auth().currentUser;
    let isMounted = true;
    const chat = chatsCollection
      // .where('fromToArray', 'array-contains-any', [user.email, to])
      .orderBy('createdAt')
      // .where('fromToArray', 'array-contains-any', [user.email, to])

      .onSnapshot(querySnapshot => {
        const chats = [];

        querySnapshot.forEach(documentSnapshot => {
          // console.log(documentSnapshot.get('fromToArray')[0]);
          if (
            (documentSnapshot.get('fromToArray')[0] == user.email &&
              documentSnapshot.get('fromToArray')[1] == other) ||
            (documentSnapshot.get('fromToArray')[0] == other &&
              documentSnapshot.get('fromToArray')[1] == user.email)
          )
            console.log(chats);
          chats.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        if (isMounted) {
          setChats(chats);
          setUser(user);
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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <View style={{height: '90%'}}>
        <FlatList
          data={chats}
          renderItem={({item}) => (
            <View style={styles.container}>
              <View
                style={
                  item.fromTo[0] == user.email ? styles.user : styles.tile
                }>
                {/* <Text style={styles.main}>Name: {item.name}</Text> */}
                <Image source={{uri: item.imageURL}} style={styles.image} />
                <View
                  style={
                    item.fromTo.from == user.email
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

                {/* <Text>Time: {item.time}</Text> */}
              </View>
            </View>
          )}
        />
      </View>
      {/* <SafeAreaView> */}
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
      {/* </SafeAreaView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
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
    tintColor: '#5b8c8c',

    // padding: 10,
    // alignSelf: 'flex-end',
  },
});
