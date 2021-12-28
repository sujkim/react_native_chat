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
import {NavigationHelpersContext} from '@react-navigation/native';

export default function ChatDetail({navigation, route}) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState(['']);
  const [message, onChangeMessage] = useState(null);
  const user = route.params.user;
  const to = route.params.to;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: to,
    });
  });

  const chatsCollection = firestore().collection('chats');

  const sendMessage = () => {
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
        });
    }
  };

  useEffect(() => {
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
            (documentSnapshot.get('fromTo.from') == user.email &&
              documentSnapshot.get('fromTo.to') == to) ||
            (documentSnapshot.get('fromTo.from') == to &&
              documentSnapshot.get('fromTo.to') == user.email)
          )
            // console.log('working?');
            // console.log(chats);
            chats.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
        });
        if (isMounted) setChats(chats);
        setLoading(false);
      });

    return () => {
      chat;
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <ActivityIndicator />;
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
                  item.fromTo.from == user.email ? styles.user : styles.tile
                }>
                {/* <Text style={styles.main}>Name: {item.name}</Text> */}
                <Image source={{uri: item.imageURL}} style={styles.image} />
                <Text style={{padding: 10}}>{item.message}</Text>

                {/* <Text>Time: {item.time}</Text> */}
              </View>
            </View>
          )}
        />
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
            <Image source={require('./assets/send.png')} style={styles.send} />
          </TouchableOpacity>
          {/* </SafeAreaView> */}
        </View>
      </SafeAreaView>
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
    color: 'red',
    // borderBottomWidth: 0.2,
  },

  main: {
    // backgroundColor: 'red',
    marginLeft: 30,
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
    tintColor: '#22577E',
    // padding: 10,
    // alignSelf: 'flex-end',
  },
});
