import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ChatDetail({navigation, route}) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  const chatsCollection = firestore().collection('chats');

  useEffect(() => {
    console.log(route.params.user);
    const chat = chatsCollection
      .where('from', '==', route.params.user)
      .onSnapshot(querySnapshot => {
        const chats = [];

        querySnapshot.forEach(documentSnapshot => {
          chats.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setChats(chats);
        setLoading(false);
      });

    return () => chat;
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={chats}
      renderItem={({item}) => (
        <View style={styles.container}>
          <View style={styles.tile}>
            <Text style={styles.main}>Name: {item.name}</Text>
            <Text>Message: {item.message}</Text>
            <Text>Image: {item.imageURL}</Text>
            {/* <Text>Time: {item.time}</Text> */}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
  },

  tile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    padding: 10,
    // backgroundColor: 'red',
    color: 'red',
    borderBottomWidth: 0.2,
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
    // resizeMode: 'contain',
    borderRadius: 20,
    overflow: 'hidden',
  },

  date: {
    fontSize: 10,
  },
});
