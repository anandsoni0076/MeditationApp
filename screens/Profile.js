import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image,SafeAreaView,StatusBar,TextInput,ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore,collection,query,where,getDocs,updateDoc} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../assets/colors1';
import useAuth from './auth/logout';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {bgImg, cover1Photo} from '../assets/imageFile';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userid, setUserid] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');

  const storage = getStorage();
  const defaultProfilePic = require('../assets/img/dfltPhoto.jpeg');
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // Additional actions after sign-out if needed
  };

  const handleEditProfile = async () => {
    try {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');

      const q = query(usersCollection, where('userid', '==', userid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`No document found for userid: ${userid}`);
        return;
      }

      const userDocRef = querySnapshot.docs[0].ref;

      await updateDoc(userDocRef, {
        name: newName,
        mobile: newMobile,
        // Add other fields to update as needed
      });

      setEditing(false);
      fetchedUserData(userid); // Refresh user data after editing
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCameraIconPress = async () => {
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Permission to access the camera roll is required!');
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (pickerResult.cancelled === true) {
        return;
      }

      const selectedImage = pickerResult.uri;

      // Update the profile picture in the database
      const storageRef = ref(storage, `profile_pics/${userid}`);
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Get the updated profile picture URL
      const imageUrl = await getDownloadURL(storageRef);

      // Update the state to reflect the new image
      setImageUrls([{ url: imageUrl }]);
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  useEffect(() => {
    const getUserid = async () => {
      try {
        const storedUserid = await AsyncStorage.getItem('userToken');

        if (storedUserid) {
          setUserid(storedUserid);
          fetchedUserData(storedUserid);
        }
      } catch (error) {
        console.error('Error retrieving userid:', error);
      }
    };

    getUserid();
  }, []);

  const fetchedUserData = async (userId) => {
    const db = getFirestore();
    const usersCollection = collection(db, 'users');

    try {
      const q = query(usersCollection, where('userid', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserData(userData);
        setNewName(userData.name); // Initialize newName with the current name
        setNewMobile(userData.mobile);

        // Fetch the profile picture
        if (userData.profilePic) {
          const storageRef = ref(storage, userData.profilePic);
          const imageUrl = await getDownloadURL(storageRef);
          setImageUrls([{ url: imageUrl }]);
        } else {
          setImageUrls([]); // Set to an empty array if no profile picture
        }

        console.log(userData);
      }
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bgColor} />
      <ImageBackground source={bgImg} style={{flex:1}}>
      <View style={styles.coverPhotoContainer}>
        <Image source={cover1Photo} resizeMode='cover' style={styles.coverPhoto} />
      </View>
      
      <View style={styles.profileContainer}>
        {imageUrls.length > 0 ? (
          <Image
            source={{ uri: imageUrls[0].url }}
            resizeMode='contain'
            style={styles.profilePic}
          />
        ) : (
          <Image
            source={defaultProfilePic}
            resizeMode='contain'
            style={styles.profilePic}
          />
        )}

        {userData && (
          <View>
            {editing ? (
              <View>
                <TextInput
                  style={styles.editNameInput}
                  value={newName}
                  onChangeText={setNewName}
                />
                <TextInput
                  style={styles.editNameInput}
                  value={newMobile}
                  onChangeText={setNewMobile}
                />
              </View>
            ) : (
              <>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.email}>{userData.email}</Text>
                <Text style={styles.email}>{userData.mobile}</Text>
              </>
            )}
          </View>
        )}
        {!editing && (
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleCameraIconPress}>
              <MaterialCommunityIcons name="camera" color={colors.secondary1} size={26} />
            </TouchableOpacity>
          </View>
        )}
        {editing ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Text style={styles.editButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverPhotoContainer: {
    width: '100%',
  },
  coverPhoto: {
    width: '100%',
    height: 228,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: -120,
    
  },
  editNameInput: {
    width: 300,
    height: 40,
    borderBottomWidth: 1, // Optional: Add a borderBottom to visually separate the input
    borderBottomColor: colors.bgColor,
    marginBottom: 10,
    fontSize: 18,
    textAlign:'center',
    color: colors.violet,
    paddingHorizontal: 10,
  },
  imageCard: {
    marginVertical: 10,
  },
  profilePic: {
    height: 155,
    width: 155,
    borderRadius: 999,
    borderColor: colors.bgColor,
    borderWidth: 8,
  },
  userName: {
    fontSize: 36,
    color: colors.violet,
    marginVertical: 8,
    textAlign:'center'
  },
  email: {
    color: colors.violet,
    fontSize: 15,
    textAlign:'center'
  },
  iconContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: "column",
    marginTop: 20,
  },
  editButton: {
    width: 300,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentColor,
    borderWidth:4,
    borderColor:colors.violet,
    borderRadius: 50,
    marginVertical: 10,
  },
  logoutButton: {
    width: 300,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentColor,
    borderWidth:4,
    borderColor:colors.violet,
    borderRadius: 50,
    marginVertical: 10,
  },
  editButtonText: {
    fontSize: 20,
    fontWeight:"600",
    color: colors.violet,
  },
});

export default Profile;
