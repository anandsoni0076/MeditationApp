import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref, list } from 'firebase/storage';
import { bgImg } from '../assets/imageFile';
import { colors } from '../assets/colors1';
import 'firebase/storage';

const Meditate = () => {
  const [isListVisible, setListVisible] = useState(false);
  const [songList, setSongList] = useState([]);
  const translateY = useRef(new Animated.Value(500)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Cleanup function when component unmounts
    return () => {
      setListVisible(false);
      setSongList([]);
    };
  }, []);

  const handleCardPress = async (category) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `gs://acex-820a5.appspot.com/music/${category}`);
      const songItems = await list(storageRef);
  
      const songInfoList = songItems.items.map((item) => ({
        name: item.name,
        fullPath: item.fullPath, // Add the full path property
        // Add more properties as needed
      }));
      
      setSongList(songInfoList);
  
      setListVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      console.log('Opened category:', category);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleSongPress = (songInfo) => {
    navigation.navigate('Music', { songInfo: songInfo }); // Make sure songInfo is an object with the expected properties
  };
  
  const handleCloseList = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setListVisible(false);
      setSongList([]);
      console.log('Closed category');
    });
  };
  return (
    <ImageBackground source={bgImg} style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress('Focused Meditation')}>
          <Text style={styles.cardText}>Focused</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress('Progressive Relaxation')}>
          <Text style={styles.cardText}>Progressive</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress('Mindfulness Meditation')}>
          <Text style={styles.cardText}>Mindfulness</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress('Spiritual Meditation')}>
          <Text style={styles.cardText}>Spiritual</Text>
        </TouchableOpacity>
      </View>

      {isListVisible && (
        <Animated.View
          style={[
            styles.listContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.listText}>Songs List</Text>
            <TouchableOpacity onPress={handleCloseList} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            {songList.map((songInfo, index) => (
              <TouchableOpacity
                key={index}
                style={styles.songItem}
                onPress={() => handleSongPress(songInfo)}
              >
                <Text style={styles.songItemText}>{songInfo.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  card: {
    width: '45%',
    height: '45%',
    aspectRatio: 1,
    backgroundColor: colors.accentColor,
    borderWidth: 4,
    borderColor: colors.violet,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    color: colors.violet,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  listText: {
    color: colors.violet,
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: colors.violet,
    padding: 10,
    borderRadius: 10,
  },
  songItem: {
    padding: 15,
    backgroundColor: colors.accentColor,
    borderColor: colors.violet,
    borderWidth: 3,
    marginBottom: 10,
    borderRadius: 5,
  },
  songItemText: {
    fontSize: 18,
    color: colors.violet,
  },
});

export default Meditate;
