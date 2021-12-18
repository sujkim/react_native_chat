import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationHelpersContext} from '@react-navigation/native';

export default function Chats({navigation: {navigate}}) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  const chatsCollection = firestore().collection('chats');

  //   chatsCollection.get().then(querySnapshot => {
  //     console.log('Total chats: ', querySnapshot.size);

  //     querySnapshot.forEach(documentSnapshot => {
  //       console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
  //     });
  //   });
  useEffect(() => {
    const chat = chatsCollection
      .where('fromTo', 'array-contains', 'bob')

      // .limit(1)
      .onSnapshot(querySnapshot => {
        const chats = [];

        querySnapshot.forEach(documentSnapshot => {
          console.log(chats);
          chats.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setChats(chats);
        setLoading(false);
      });

    // console.log(chats);

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
          <Pressable onPress={() => navigate('ChatDetail', {user: item.from})}>
            <View style={styles.tile}>
              <View style={{flexDirection: 'row'}}>
                <Image source={{uri: item.imageURL}} style={styles.image} />
                <View style={styles.main}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text>{item.message}</Text>
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.date}>
                  {item.time.toDate().toDateString()}
                </Text>
              </View>
              {/* <Text>Image: {item.imageURL}</Text> */}
              {/* <Text>Time: {item.time}</Text> */}
            </View>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
