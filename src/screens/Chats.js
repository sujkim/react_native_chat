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
import auth from '@react-native-firebase/auth';

const Chats = ({navigation: {navigate}}) => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const chatsCollection = firestore().collection('chats');
  const user = auth().currentUser;

  const isToday = date => {
    let today = new Date();
    return (
      date.getFullYear() == today.getFullYear() &&
      date.getMonth() == today.getMonth() &&
      date.getDate() == today.getDate()
    );
  };

  const isYesterday = date => {
    let today = new Date();
    return (
      date.getFullYear() == today.getFullYear() &&
      date.getMonth() == today.getMonth() &&
      date.getDate() == today.getDate() - 1
    );
  };

  useEffect(() => {
    let isMounted = false;

    const chat = chatsCollection.orderBy('createdAt', 'desc').onSnapshot(
      {includeMetadataChanges: true},
      querySnapshot => {
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

              const contact = from == user.email ? to : from;

              // group conversations
              if (!users.includes(contact)) {
                users.push(contact);
                conversations.push(item);
              }
            });
          });

        if (!isMounted) {
          setConversations(conversations);
          setLoading(false);
        }
      },
      error => {
        console.log(error);
      },
    );

    return () => {
      // getUserDetails;
      chat;
      isMounted = true;
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
      <View style={styles.header}>
        <Text style={{fontSize: 30}}>Messages</Text>
        <View style={{padding: 10}}>
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
          data={conversations}
          renderItem={({item}) => (
            <View>
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
                      <Text numberOfLines={1} style={{color: 'grey'}}>
                        {item.message}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.date}>
                      {isToday(item.createdAt.toDate())
                        ? item.createdAt.toDate().toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: 'numeric',
                          })
                        : isYesterday(item.createdAt.toDate())
                        ? 'Yesterday'
                        : item.createdAt.toDate().toLocaleDateString('en-US')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },

  button: {
    width: 30,
    height: 30,
  },

  tile: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10,
    padding: 10,
    borderBottomWidth: 0.3,
    borderColor: 'grey',
  },

  image: {
    backgroundColor: '#70a1c4',
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  main: {
    marginLeft: 20,
    justifyContent: 'center',
    width: '65%',
  },

  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  date: {
    fontSize: 13,
    padding: 5,
    color: 'grey',
  },
});

export default Chats;
