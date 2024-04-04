import React, { useState} from 'react';
import { View, Text, TextInput,Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { auth } from './auth/firebase';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import MaterialIcons from  '@expo/vector-icons/MaterialIcons'
import { bgImg } from '../assets/imageFile';
import { colors } from '../assets/colors1';

const SignupScreen = ({ navigation }) => {
  const db = getFirestore();
  const storage = getStorage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const selectImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access the camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }
    setSelectedImage(pickerResult.uri);
  };


  const handleSignUp = async () => {
    // Check if any field is empty
    if (!name) {
      alert('Please enter your name.');
      return;}
    if (!email) {
      alert('Please enter your email.');
      return;}
    if (!mobile) {
      alert('Please enter your mobile.');
      return;}  
    if (!password) {
      alert('Please enter your password.');
      return;} 
    if (!selectedImage) {
      alert('Please select a profile picture.');
      return;}
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User registered successfully!');
  
      const storageRef = ref(storage, 'profile_pics/' + user.uid);
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const imageUrl = storageRef.toString();
  
      await AsyncStorage.setItem('userid', user.uid);
      await addDoc(collection(db, 'users'), {
        name,
        email,
        mobile,
        userid: user.uid,
        profilePic: imageUrl,
      });
  
      // You can navigate to another screen after successful signup
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Handle the case where the email is already in use
        alert('Email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        // Handle the case where the email is invalid
        alert('Invalid email address.');
      } else {
        console.error('Error during signup:', error.message);
      }
    }
  };

  return (
    <ImageBackground source={bgImg} style={{ flex: 1 }}>
      <View style={styles.container}>

        <TouchableOpacity onPress={selectImage}>
          <View style={styles.profilePicContainer}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.profilePic} />
            )}
            {!selectedImage && (
              <MaterialIcons name="camera-enhance" size={30} color={colors.violet} />
            )}
          </View>
        </TouchableOpacity>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
          style={styles.input}
          maxLength={10}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.btnContainer} title="Sign Up" onPress={handleSignUp}>
          <Text style={styles.btnTitle}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.violet,
  },
  btnContainer: {
    backgroundColor: colors.accentColor,
    width: 100,
    height: 40,
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.violet,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: colors.violet,
    borderWidth: 3,
    backgroundColor: colors.accentColor,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: colors.violet,
    borderWidth: 4,
  },
});


export default SignupScreen;