import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react'
import {hill} from '../assets/imageFile'

const HomeScreen = ({ navigation }) => {
    const navigateToLogin = () => {
      navigation.navigate('Login');
    };
  
    const navigateToSignup = () => {
      navigation.navigate('Signup');
    };
  
    return (
      <ImageBackground source={hill} style={styles.backgroundImage}>
        <View style={styles.container}>
        <View style={styles.bottomPart}>
          <Text style={styles.heading}>We are what we do</Text>
          <Text style={styles.subheading}>Thousand of people are using silent moon</Text>
          <Text style={styles.subheading}>for smalls meditation</Text>
  
          <View style={styles.buttonContainer}>
            <Pressable onPress={navigateToSignup}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </Pressable>
          </View>
  
          <View style={styles.actionContainer}>
            <Text style={styles.actionTitle}>ALREADY HAVE AN ACCOUNT? </Text>
            <Text style={[styles.actionTitle, styles.actionText]} onPress={navigateToLogin}>
              LOG IN
            </Text>
          </View>
        </View>
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
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // Cover the entire screen
    },
    bottomPart: {
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    heading: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    subheading: {
      fontSize: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    buttonContainer: {
      marginTop: 20,
      backgroundColor: '#3498db', // Add your preferred button color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    actionContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    actionTitle: {
      fontSize: 14,
    },
    actionText: {
      fontWeight: 'bold',
      marginLeft: 5,
      color: 'blue',
    },
  });
  
export default HomeScreen
