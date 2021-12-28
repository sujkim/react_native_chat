import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

async function signInWithGoogle() {
  GoogleSignin.configure({
    webClientId:
      '422039968419-se8re267ivipo673piq55uqmdgdj5foo.apps.googleusercontent.com',
  });

  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  console.log(googleCredential);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

const SignIn = ({navigation: {navigate}}) => {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  const signIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        if (error.code == 'auth/user-not-found') {
          Alert.alert("Account doesn't exist. Please sign up!");
          return;
        }

        if (error.code == 'auth/wrong-password') {
          Alert.alert('Wrong password');
          return;
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
          return;
        }
        console.error(error);
        return;
      });
  };

  return (
    <View style={styles.body}>
      <View style={styles.header}></View>
      <View style={styles.main}>
        <View style={styles.email}>
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

        <View style={styles.buttons}>
          <Pressable
            style={styles.button}
            onPress={() => {
              signIn();
            }}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.signUp]}
            onPress={() => navigate('Sign Up')}>
            <Text style={[styles.buttonText, styles.signUpButtonText]}>
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          title="Sign in with Google"
          className="sign-in"
          onPress={signInWithGoogle}
        /> */}
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '0%',
    backgroundColor: '#95D1CC',
  },

  body: {
    flex: 1,
    justifyContent: 'center',
  },

  main: {
    flex: 1,
    height: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  email: {
    width: '60%',
  },

  input: {
    width: '100%',
    borderWidth: 0.3,
    padding: 10,
  },

  image: {
    width: '10%',
    height: '10%',
  },

  text: {
    fontWeight: 'bold',
    paddingVertical: 10,
  },

  buttons: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    borderColor: '#22577E',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
  },

  signUp: {
    backgroundColor: '#22577E',
  },

  signUpButtonText: {
    color: 'white',
  },

  buttonText: {
    fontSize: 16,
  },
});
