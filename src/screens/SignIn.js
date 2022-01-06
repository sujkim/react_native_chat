import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
  Platform,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import {useHeaderHeight} from '@react-navigation/elements';

// if adding sign in with google function
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

const signInWithEmail = (email, password) => {
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

const SignIn = ({navigation: {navigate}}) => {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={useHeaderHeight()}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <View style={styles.body}>
        <View style={styles.header}></View>
        <View style={styles.main}>
          <View style={styles.inputs}>
            <View style={{marginBottom: 3}}>
              <Text style={styles.text}>Email Address</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                keyboardType="email-address"
                placeholder="name@address.com"
                autoCapitalize="none"
              />
            </View>
            <View>
              <Text style={styles.text}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
              />
            </View>
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={styles.button}
              onPress={() => {
                signInWithEmail(email, password);
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
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const buttonColor = '#4268AE';
const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '0%',
    backgroundColor: '#95D1CC',
  },

  body: {
    flex: 1,
    paddingBottom: 30,
    justifyContent: 'center',
  },

  main: {
    flex: 1,
    height: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  inputs: {
    width: '70%',
  },

  input: {
    width: '100%',
    borderWidth: 0.3,
    borderRadius: 10,
    padding: 15,
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
    borderColor: buttonColor,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
  },

  signUp: {
    backgroundColor: buttonColor,
  },

  signUpButtonText: {
    color: 'white',
  },

  buttonText: {
    fontSize: 16,
  },
});
