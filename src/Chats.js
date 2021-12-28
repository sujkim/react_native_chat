import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';

import auth from '@react-native-firebase/auth';
import SignIn from './SignIn';
import NewMessage from './NewMessage';

// const newMessage = ({navigation: {navigate}}) => {
//   // return <NewMessage />;
//   userID = auth().currentUser.getIdToken();
//   console.log('new message');
//   navigate('NewMessage');
// };

export default function Chats({navigation: {navigate}}) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const user = auth().currentUser;

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Signed Out!');
        return <SignIn />;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const chatsCollection = firestore().collection('chats');

  useEffect(() => {
    let isMounted = true;
    const chat = chatsCollection
      // .where('fromTo.from', '==', 'bob')
      .where('fromToArray', 'array-contains', user.email)

      // .limit(1)
      .onSnapshot({includeMetadataChanges: true}, querySnapshot => {
        // const chats = [];
        const users = [];
        if (!querySnapshot.metadata.hasPendingWrites)
          querySnapshot.forEach(documentSnapshot => {
            chats.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
            chats.map(item => {
              console.log(item['fromToArray'][0]);
              // group conversations from same person, do not include own
              if (
                !users.includes(item['fromToArray'][0]) &&
                item['fromToArray'][0] !== user.email
              ) {
                console.log('add em');
                users.push(item['fromToArray'][0]);
              }
            });
          });

        if (isMounted) {
          setChats(chats);
          setUsers(users);
        }
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

  console.log(users);

  return (
    <View>
      {/* <SafeAreaView> */}
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigate('New Message')}>
          <View style={styles.button}>
            <Text style={{fontSize: 15, color: 'white'}}>New Message</Text>
          </View>
        </Pressable>
        {/* <Pressable onPress={() => signOut()}>
          <View style={styles.button}>
            <Text style={{fontSize: 15, color: 'white'}}>Sign Out</Text>
          </View>
        </Pressable> */}
      </View>
      {/* </SafeAreaView> */}
      <View style={styles.header}>
        <Text style={{fontSize: 30}}>Messages</Text>
      </View>
      <View style={{height: '70%'}}>
        <FlatList
          style={styles.messages}
          data={users}
          renderItem={({item}) => (
            <View style={styles.container}>
              <Pressable
                onPress={() =>
                  navigate('Chat Detail', {
                    user: user,
                    to: item,
                  })
                }>
                <View style={styles.tile}>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={{uri: item.imageURL}} style={styles.image} />
                    <View style={styles.main}>
                      {/* <Text style={styles.name}>
                        {item.fromTo.from == user.email
                          ? item.fromTo.to
                          : item.fromTo.from}
                      </Text> */}
                      <Text style={styles.name}>{item}</Text>
                      {/* <Text>{item.message}</Text> */}
                    </View>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.date}>
                      {item.createdAt
                        ? item.createdAt.toDate().toDateString()
                        : ''}
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
}

const styles = StyleSheet.create({
  buttonContainer: {
    // backgroundColor: 'blue',
    // marginRight: 10,
    // height: '30%',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  button: {
    padding: 10,
    backgroundColor: '#22577E',
    borderRadius: 10,
  },

  header: {
    // backgroundColor: 'red',
    marginLeft: 30,
    // height: '30%',
    justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },

  title: {
    backgroundColor: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },

  container: {
    // flex: 1,
  },

  messages: {
    // height: '50%',
    // flex: 1,
  },

  tile: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    margin: 10,
    padding: 10,
    // backgroundColor: 'red',
    color: 'red',
    // borderBottomWidth: 0.2,
    // heigsht: '80%',
  },

  main: {
    marginLeft: 30,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
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
  },
});
