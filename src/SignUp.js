import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import auth, {updateProfile} from '@react-native-firebase/auth';

import {launchImageLibrary} from 'react-native-image-picker';
import Chats from './Chats';

function SignUp() {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [name, onChangeName] = useState('');
  const [image, setImage] = useState(null);

  async function chooseImage() {
    response = await launchImageLibrary();
    setImage(response.assets[0].uri);
  }

  const signUp = async () => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
        return;
      }
      if (e.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
        return;
      }
      if (e.code == 'auth/weak-password') {
        Alert.alert('Password is too weak!');
        return;
      }
      console.error(error);
    } finally {
      await auth().currentUser.updateProfile({
        displayName: name,
        photoURL: image,
      });
      await auth().currentUser.reload();
      return <Chats user={auth().currentUser} />;
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.header}></View>

      <View style={styles.main}>
        <View style={styles.avatar}>
          <Image source={{uri: image}} style={styles.image} />
          <Pressable onPress={() => chooseImage()}>
            <Image
              source={require('./assets/add.png')}
              style={styles.addButton}
            />
          </Pressable>
        </View>
        <View style={styles.inputs}>
          <Text style={styles.text}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={name}
          />
          <Text style={styles.text}>Email Address</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            keyboardType="email-address"
            placeholder="name@address.com"
            autoCapitalize="none"
          />

          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
          />
        </View>

        <View style={styles.spacer}></View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => signUp()}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '0%',
    backgroundColor: '#95D1CC',
  },

  avatar: {
    padding: 40,
  },

  addButton: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 5,
    bottom: 0,
  },

  body: {
    flex: 1,
    justifyContent: 'center',
  },

  main: {
    flex: 1,
    height: '80%',
    alignItems: 'center',
  },

  inputs: {
    width: '60%',
  },

  input: {
    width: '100%',
    borderWidth: 0.3,
    padding: 10,
  },

  spacer: {
    height: '20%',
  },

  image: {
    backgroundColor: '#70a1c4',
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },

  text: {
    fontWeight: 'bold',
    paddingVertical: 10,
  },

  buttonContainer: {
    width: '60%',
    // justifyContent: 'space-around',
    alignItems: 'center',
  },

  button: {
    width: '80%',
    backgroundColor: '#22577E',
    padding: 15,
    borderRadius: 10,
    // justifyContent: 'center',
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
});