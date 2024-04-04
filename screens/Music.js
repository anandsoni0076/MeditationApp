import React, { useEffect, useState, useRef } from 'react';
import { AppState, View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { bg, bgImg, m, medi } from '../assets/imageFile';
import { colors } from '../assets/colors1';

const Music = ({ route }) => {
  const { songInfo } = route?.params || {};
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const appStateSubscription = useRef(null);

  const unloadSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null); // Clear the sound reference
    }
  };

  useEffect(() => {
    const fetchAndPlaySong = async () => {
      try {
        if (!songInfo) {
          console.log('Please choose a song first.');
          return;
        }

        // Unload the current sound before loading the new one
        await unloadSound();

        const storage = getStorage();
        const songStorageRef = ref(storage, songInfo.fullPath);
        const downloadURL = await getDownloadURL(songStorageRef);
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: downloadURL },
          { shouldPlay: true }
        );

        if (sound) {
          setSound(sound);

          sound.setOnPlaybackStatusUpdate((status) => {
            setIsPlaying(status.isPlaying);
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
          });
        } else {
          console.log('Error creating sound object.');
          // Handle error: unload sound or take appropriate action
          await unloadSound();
        }
      } catch (error) {
        console.error('Error fetching and playing song:', error);
        // Handle error: unload sound or take appropriate action
        await unloadSound();
      }
    };

    fetchAndPlaySong();

    return () => {
      // Unsubscribe from app state changes when the component unmounts
      if (appStateSubscription.current) {
        appStateSubscription.current.remove();
      }

      // Unload the sound when the component unmounts
      unloadSound();
    };
  }, [songInfo]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App is going to the background or becoming inactive
        if (sound) {
          sound.pauseAsync();
        }
      }
      appState.current = nextAppState;
    };

    // Subscribe to app state changes
    appStateSubscription.current = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // No need to remove the event listener here
    };
  }, [sound]);

  const handlePlayPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pauseAsync();
      } else {
        sound.playAsync();
      }
    }
  };

  const handlePrev10Sec = () => {
    if (sound) {
      const newPosition = Math.max(position - 10000, 0);
      sound.setPositionAsync(newPosition);
    }
  };

  const handleNext10Sec = () => {
    if (sound) {
      const newPosition = Math.min(position + 10000, duration);
      sound.setPositionAsync(newPosition);
    }
  };

  const handleSliderChange = (value) => {
    if (sound) {
      sound.setPositionAsync(value);
    }
  };

  const navigateToCardList = () => {
    navigation.navigate('Meditate');
  };

  return (
    <ImageBackground source={bgImg} style={{ flex: 1 }}>
      <View style={styles.container}>
        {songInfo ? (
          <>
            <Image source={bg} style={styles.musicDisk} />
            <Text style={styles.songTitle}>{songInfo.name}</Text>
            <Slider
              style={styles.slider}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              onValueChange={handleSliderChange}
              thumbTintColor="red"
            />
            <View style={styles.controls}>
              <TouchableOpacity onPress={handlePrev10Sec}>
                <MaterialIcons name="replay-10" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
                <MaterialIcons
                  name={isPlaying ? 'play-circle-outline' : 'pause-circle-outline'}
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext10Sec}>
                <MaterialIcons name="forward-10" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.chooseSongContainer}>
            <Text style={styles.chooseSongText}>Please choose a song first.</Text>
            <Image source={m} style={styles.logo}></Image>
            <TouchableOpacity onPress={navigateToCardList} style={styles.chooseSongButton}>
              <Text style={styles.chooseSongButtonText}>Choose</Text>
            </TouchableOpacity>
          </View>
        )}
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
  musicDisk: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.violet,
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  playPauseButton: {
    backgroundColor: colors.violet,
    padding: 15,
    borderRadius: 50,
  },
  chooseSongContainer: {
    alignItems: 'center',
  },
  chooseSongText: {
    fontSize: 18,
    color: colors.violet,
    marginBottom: 20,
  },
  chooseSongButton: {
    backgroundColor: colors.accentColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: colors.violet,
    borderWidth: 3,
  },
  chooseSongButtonText: {
    color: colors.violet,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Music;
