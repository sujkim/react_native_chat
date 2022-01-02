import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  RefreshControlBase,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import SignIn from './SignIn';
import ChatDetail from './ChatDetail';

const Chats = ({navigation: {navigate}}) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const user = auth().currentUser;
  const chatsCollection = firestore().collection('chats');

  useEffect(() => {
    let isMounted = true;

    const chat = chatsCollection
      .orderBy('createdAt', 'desc')
      .onSnapshot({includeMetadataChanges: true}, querySnapshot => {
        const chats = [];
        const users = [];
        const conversations = [];
        if (!querySnapshot.metadata.hasPendingWrites)
          querySnapshot.forEach(documentSnapshot => {
            if (
              documentSnapshot.get('fromToArray')[0] == user.email ||
              documentSnapshot.get('fromToArray')[1] == user.email
            ) {
              chats.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
            chats.map(item => {
              const from = item['fromToArray'][0];
              const to = item['fromToArray'][1];

              const other = from == user.email ? to : from;

              // group conversations
              if (!users.includes(other)) {
                users.push(other);
                conversations.push(item);
              }
            });
          });

        if (isMounted) {
          setConversations(conversations);
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
    <View style={{flex: 1, backgroundColor: '#F6F6F6'}}>
      {/* <SafeAreaView> */}

      {/* </SafeAreaView> */}
      <View
        style={{
          alignItems: 'center',
          padding: 20,
        }}>
        <Image
          source={{
            uri: user.photoURL,
          }}
          style={styles.userImage}
        />
        <Text>{user.displayName}</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => navigate('New Message')}>
            <View style={styles.button}>
              <Image
                source={require('../assets/new-message.png')}
                style={styles.button}
              />
            </View>
          </Pressable>
        </View>
      </View>
      <View style={{height: '70%'}}>
        <FlatList
          style={styles.messages}
          data={conversations}
          renderItem={({item}) => (
            <View style={styles.container}>
              <Pressable
                onPress={() =>
                  navigate('Chat Detail', {
                    email:
                      item.fromToArray[0] == user.email
                        ? item.fromToArray[1]
                        : item.fromToArray[0],
                    details:
                      item.fromToArray[0] == user.email
                        ? item.fromTo.to
                        : item.fromTo.from,
                  })
                }>
                <View style={styles.tile}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={{
                        uri:
                          item.fromToArray[0] == user.email
                            ? item.fromTo.to.photoURL
                            : item.fromTo.from.photoURL,
                      }}
                      style={styles.image}
                    />
                    <View style={styles.main}>
                      <Text style={styles.name}>
                        {item.fromToArray[0] == user.email
                          ? item.fromTo.to.displayName
                          : item.fromTo.from.displayName}
                      </Text>
                      <Text>{item.message}</Text>
                    </View>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.date}>
                      {/* {item.createdAt
                        ? item.createdAt.toDate().toDateString()
                        : ''} */}
                      {
                        // item.createdAt.toDate().toLocaleTimeString()
                        // .toDateString()
                      }
                    </Text>
                  </View>
                  {/* <Text>Image: {item.imageURL}</Text> */}
                  {/* <Text>Time: {item.time}</Text> */}
                </View>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const primaryFontColor = '#8785A2';
const styles = StyleSheet.create({
  buttonContainer: {
    // backgroundColor: 'blue',
    // marginRight: 10,
    // height: '30%',
    // flexDirection: 'row',
    padding: 10,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-end',
  },

  button: {
    // padding: 10,
    width: 30,
    height: 30,
    // tintColor: '#8785A2',
    // backgroundColor: '#22577E',
    // borderRadius: 10,
  },

  header: {
    // backgroundColor: 'red',
    // marginTop: 10,
    marginLeft: 20,
    // height: '30%',
    // justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    // backgroundColor: 'white',
    fontSize: 30,
    // fontWeight: 'bold',
    // color: primaryFontColor,
    // justifyContent: 'center',
  },

  tile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    // backgroundColor: 'red',
    color: 'red',
    borderBottomWidth: 0.2,
    borderColor: 'grey',
    // heigsht: '80%',
  },

  main: {
    marginLeft: 10,
    justifyContent: 'center',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  userImage: {
    backgroundColor: '#70a1c4',
    width: 80,
    height: 80,
    marginBottom: 10,
    // resizeMode: 'contain',
    borderRadius: 40,
    // overflow: 'hidden',
  },

  image: {
    backgroundColor: '#70a1c4',
    width: 40,
    height: 40,
    // resizeMode: 'contain',
    borderRadius: 20,
    // overflow: 'hidden',
  },

  date: {
    fontSize: 10,
    // alignSelf: 'center',
  },
});

export default Chats;
