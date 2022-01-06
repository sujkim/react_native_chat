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
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
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
            // if (
            //   documentSnapshot.get('fromToArray')[0] == user.email ||
            //   documentSnapshot.get('fromToArray')[1] == user.email
            // ) {
            chats.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
            // }
            chats.map(item => {
              // const from = item['fromToArray'][0];
              // const to = item['fromToArray'][1];

              const other = item.from == user.uid ? item.to : item.from;

              // group conversations
              if (!users.includes(other)) {
                users.push(other);
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
      isMounted = true;
      // getUserDetails;
      chat;
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
                    email: item.from == user.uid ? item.to : item.from,
                    details: item.from == user.uid ? item.to : item.from,
                  })
                }>
                <View style={styles.tile}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={{
                        uri:
                          item.from == user.uid
                            ? item.fromTo.to.photoURL
                            : item.fromTo.from.photoURL,
                      }}
                      style={styles.image}
                    />
                    <View style={styles.main}>
                      <Text style={styles.name}>
                        {item.from == user.uid
                          ? item.fromTo.to.displayName
                          : item.fromTo.from.displayName}
                      </Text>
                      <Text numberOfLines={2} style={{color: 'grey'}}>
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

const primaryFontColor = '#4268AE';
const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
  },

  button: {
    width: 30,
    height: 30,
    tintColor: '#4268AE',
    // overlayColor: '#4268AE',
  },

  header: {
    marginLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },

  title: {
    fontSize: 30,
  },

  tile: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // margin: 10,
    padding: 10,
    borderBottomWidth: 0.3,

    borderColor: 'grey',

    // backgroundColor: 'red',
  },

  main: {
    marginLeft: 20,
    justifyContent: 'center',
    width: '65%',
    // backgroundColor: 'red',
  },

  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  userImage: {
    backgroundColor: '#70a1c4',
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 40,
  },

  image: {
    backgroundColor: '#70a1c4',
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  date: {
    fontSize: 13,
    padding: 5,
    color: 'grey',
  },
});

export default Chats;
