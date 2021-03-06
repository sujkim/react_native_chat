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

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import {useHeaderHeight} from '@react-navigation/elements';

const SignUp = ({navigation: {navigate}}) => {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [name, onChangeName] = useState('');
  const [uri, setUri] = useState(null);
  const [image, setImage] = useState(null);

  // choose photo from album
  async function chooseImage() {
    try {
      let response = await launchImageLibrary({maxWidth: 200, maxHeight: 200});
      setUri(response.assets[0].uri);
      await setProfile(response.assets[0].uri);
    } catch (error) {
      console.log(error);
    }
  }

  // upload image to firebase storage and retrieve download url
  async function setProfile(uri) {
    console.log('uri in upload function', uri);
    let filename = uri.substring(uri.lastIndexOf('/') + 1);
    let imageRef = storage().ref('profile:' + filename);

    try {
      imageRef.putFile(uri.replace('file://', '')).then(async () => {
        const url = await imageRef.getDownloadURL();
        setImage(url);
        console.log('url', url);
        return url;
      });
    } catch (error) {
      console.log('upload error', error);
    }
  }

  const signUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(e => {
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
      })
      .then(() => {
        // add name and photo to profile
        auth()
          .currentUser.updateProfile({
            displayName: name,
            photoURL: image,
          })
          .catch(error => console.log(error))
          .then(() => addUser());
        // addUser();
      });
  };

  // add user to 'users' database
  const addUser = async () => {
    const user = auth().currentUser;
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        email: email.toLowerCase(),
        displayName: name,
        photoURL: image,
      })
      .then(() => {
        console.log('user addded');
      });
  };

  return (
    <KeyboardAvoidingView
      verticalKeyboardOffset={useHeaderHeight() + 40}
      style={{flex: 1}}
      behavior="padding">
      <View style={styles.body}>
        <View>
          <Image source={{uri: uri}} style={styles.image} />
          <Pressable onPress={() => chooseImage()}>
            <Image
              source={require('../assets/add.png')}
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

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => signUp()}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>Already have an account? </Text>
          <Pressable
            onPress={() => {
              navigate('Sign In');
            }}>
            <Text style={{color: '#4268AE'}}>Login</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const primaryColor = '#4268AE';
const styles = StyleSheet.create({
  addButton: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 5,
    bottom: 0,
    tintColor: primaryColor,
  },

  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 80,
  },

  inputs: {
    width: '70%',
  },

  input: {
    borderRadius: 10,
    borderWidth: 0.3,
    padding: 10,
    marginBottom: 3,
  },

  image: {
    backgroundColor: '#DCDCDC',
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
    paddingVertical: 30,
    width: '60%',
    alignItems: 'center',
  },

  button: {
    width: '80%',
    backgroundColor: primaryColor,
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
});
