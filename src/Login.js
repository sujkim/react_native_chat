import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {startDetecting} from 'react-native/Libraries/Utilities/PixelRatio';

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

const signOut = () => {
  auth()
    .signOut()
    .then(() => console.log('Signed Out!'));
};

const signIn = () => {
  console.log('sign in');
};

const signUp = () => {
  console.log('sign up');
};

function SignIn({navigation}) {
  // Check for user
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (user) console.log(user.photoURL);

  if (!user) {
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
              placeholder="name@address.com"
              autoCapitalize={false}
            />

            <Text style={styles.text}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
              placeholder="Password"
              keyboardType="email-address"
              secureTextEntry={true}
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={signUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
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
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Image source={{uri: user.photoURL}} style={styles.image} />

      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '0%',
    backgroundColor: '#95D1CC',
  },

  body: {
    flex: 1,
    // backgroundColor: 'white',
    justifyContent: 'center',
    // alignItems: 'center',
    // justifyContent: 'space-around',
  },

  main: {
    flex: 1,
    // backgroundColor: 'blue',
    height: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  email: {
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // width: '100%',
    width: '60%',
  },

  input: {
    width: '100%',
    borderWidth: 0.2,
    padding: 10,
    // borderWidth: 1,
    // padding: 10,
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
    // backgroundColor: 'blue',
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    backgroundColor: '#22577E',
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
