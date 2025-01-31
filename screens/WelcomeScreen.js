import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, FlatList, TouchableOpacity, Image, Modal, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import axios from 'axios';
import { bgImg, bgImg1, m } from '../assets/imageFile';
import fetchUserData from './auth/Userdata';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const WelcomeScreen = () => {
  const [userName, setUserName] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  //------------------for Basic category-----------------------------------------------------
  const [basicVideos, setBasicVideos] = useState([]);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedBasicVideoId, setSelectedBasicVideoId] = useState('');
  const [selectedBasicVideoTitle, setSelectedBasicVideoTitle] = useState('');

  const [relaxationVideos, setRelaxationVideos] = useState([]);
  const [relaxationVideoModalVisible, setRelaxationVideoModalVisible] = useState(false);
  const [selectedRelaxationVideoId, setSelectedRelaxationVideoId] = useState('');
  const [selectedRelaxationVideoTitle, setSelectedRelaxationVideoTitle] = useState('');
  const [relaxationModalVisible, setRelaxationModalVisible] = useState(false);

  const [dailyVideos, setDailyVideos] = useState([]);
  const [dailyVideoModalVisible, setDailyVideoModalVisible] = useState(false);
  const [selectedDailyVideoId, setSelectedDailyVideoId] = useState('');
  const [selectedDailyVideoTitle, setSelectedDailyVideoTitle] = useState('');
  const [dailyModalVisible, setDailyModalVisible] = useState(false);

  //-----------------------------------------Fetching User Data---------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userToken');
        if (userId) {
          // Call the fetchedUserData function to get user data
          const userData = await fetchUserData(userId);

          // Access the user's name from the retrieved data
          if (userData) {
            setUserName(userData.name);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //-----------------------------------------Fetching Videos---------------------------------------------------
  useEffect(() => {
    const recommendedfetchVideos = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            maxResults: 20,
            q: 'meditation',
            type: 'video',
            key: 'AIzaSyChPeTM-ZNgZNEE03LoOoC3H89p3z4-0Fc',
          },
        });
        setVideos(response.data.items);
      } catch (error) {
        setError('Error fetching videos');
      } finally {
        setLoading(false);
      }
    };

    recommendedfetchVideos();
  }, []);

  useEffect(() => {
    fetchBasicVideos();
  }, []);

  const fetchBasicVideos = async () => {
    try {
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          maxResults: 10,
          playlistId: 'PLaeZNCn-A_-ZqZDhlWH6IXupHY1TJ4Ayb',
          key: 'AIzaSyChPeTM-ZNgZNEE03LoOoC3H89p3z4-0Fc',
        },
      });
      console.log('Basic Videos:', response.data.items); // Log the fetched videos
      setBasicVideos(response.data.items);
    } catch (error) {
      setError('Error fetching basic videos');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchRelaxationVideos();
  }, []);

  const fetchRelaxationVideos = async () => {
    try {
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          maxResults: 10,
          playlistId: 'PLyj1IM1Q2PxqLIW1jf7dbGHLhtnoUHUhN',
          key: 'AIzaSyChPeTM-ZNgZNEE03LoOoC3H89p3z4-0Fc',
        },
      });
      console.log('Relaxation Videos:', response.data.items); // Log the fetched videos
      setRelaxationVideos(response.data.items);
    } catch (error) {
      setError('Error fetching Relaxation videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyVideos();
  }, []);
  const fetchDailyVideos = async () => {
    try {
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          maxResults: 20,
          playlistId: 'PL7by6RYPG3HDCxgQONtFHC8-Oe3UrC00a',
          key: 'AIzaSyChPeTM-ZNgZNEE03LoOoC3H89p3z4-0Fc',
        },
      });
      console.log('Daily Videos:', response.data.items); // Log the fetched videos
      setDailyVideos(response.data.items);
    } catch (error) {
      setError('Error fetching Daily videos');
    } finally {
      setLoading(false);
    }
  };

  //----------------------------------------------Render videos---------------------------------------------------------
  const renderVideoItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedVideoId(item.id.videoId);
          setModalVisible(true);
        }}
        style={styles.recommendedTile}
      >
        <Image
          source={{ uri: item.snippet.thumbnails.default.url }}
          style={styles.recommendedTileBackground}
        />
        <Text style={styles.recommendedTileText}>{item.snippet.title}</Text>
      </TouchableOpacity>
    );
  };

  // Render function for basic videos
const renderBasicVideoItem = ({ item }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => openVideoModal(item.snippet.resourceId.videoId, item.snippet.title)}
        style={styles.videoItemContainer}
      >
        <Image
          source={{ uri: item.snippet.thumbnails.default.url }}
          style={styles.videoThumbnail}
        />
        <Text style={styles.videoTitle}>{item.snippet.title}</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );
};

// Render function for relaxation videos
const renderRelaxationVideoItem = ({ item }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => openRelaxationVideoModal(item.snippet.resourceId.videoId, item.snippet.title)}
        style={styles.videoItemContainer}
      >
        <Image
          source={{ uri: item.snippet.thumbnails.default.url }}
          style={styles.videoThumbnail}
        />
        <Text style={styles.videoTitle}>{item.snippet.title}</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );
};

// Render function for daily videos
const renderDailyVideoItem = ({ item }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => openDailyVideoModal(item.snippet.resourceId.videoId, item.snippet.title)}
        style={styles.videoItemContainer}
      >
        <Image
          source={{ uri: item.snippet.thumbnails.default.url }}
          style={styles.videoThumbnail}
        />
        <Text style={styles.videoTitle}>{item.snippet.title}</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );
};

  //--------------------------------------------MODAL-----------------------------------------------------------

  const closeModal = () => {
    setSelectedVideoId('');
    setModalVisible(false);
  };

  const closeBasicPlaylistVideoModal = () => {
    setSelectedBasicVideoId('');
    setSelectedBasicVideoTitle('');
    setVideoModalVisible(false);
  };

  const openVideoModal = (videoId, videoTitle) => {
    setSelectedBasicVideoId(videoId);
    setSelectedBasicVideoTitle(videoTitle);
    setVideoModalVisible(true);
  };

  const openRelaxationVideoModal = (videoId, videoTitle) => {
    setSelectedRelaxationVideoId(videoId);
    setSelectedRelaxationVideoTitle(videoTitle);
    setRelaxationVideoModalVisible(true);
  };

  const closeRelaxationPlaylistVideoModal = () => {
    setSelectedRelaxationVideoId('');
    setSelectedRelaxationVideoTitle('');
    setRelaxationVideoModalVisible(false);
  };

  const openDailyVideoModal = (videoId, videoTitle) => {
    setSelectedDailyVideoId(videoId);
    setSelectedDailyVideoTitle(videoTitle);
    setDailyVideoModalVisible(true);
  };

  const closeDailyPlaylistVideoModal = () => {
    setSelectedDailyVideoId('');
    setSelectedDailyVideoTitle('');
    setDailyVideoModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ImageBackground source={bgImg} style={styles.backgroundImage}>
      <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        {selectedVideoId ? (
          <YoutubePlayer
            height={320}
            play={true}
            videoId={selectedVideoId}
          />
        ) : null}
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView>
      <Text style={styles.username}>Hello, {userName}</Text>
        <View style={styles.tileContainer}>
          {/* -------------------------Basic Tile Content-------------------------- */}
          <TouchableOpacity
            style={styles.tile}
            onPress={() => setVideoModalVisible(true)}
          >
            <ImageBackground source={bgImg1} style={styles.tileBackground}>
              <Text style={styles.tileText}>Basic</Text>
            </ImageBackground>
          </TouchableOpacity>
          {/* -------------------------Relaxation Tile Content-------------------------- */}
          <TouchableOpacity
            style={styles.tile}
            onPress={() => setRelaxationModalVisible(true)}
          >
            <ImageBackground source={bgImg1} style={styles.tileBackground}>
              <Text style={styles.tileText}>Relaxation</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        {/* Large width tile for Daily Thought */}
        <View style={styles.dailyThoughtContainer}>
          {/* Daily Thought Content */}
          <ImageBackground
            source={bgImg1}
            style={styles.dailyThoughtContainer}
          >
            <Text style={styles.dailyThoughtHeading}>Daily Thought</Text>
            <Text style={styles.dailyThoughtText}>Meditation</Text>
            <TouchableOpacity
              onPress={() => setDailyModalVisible(true)}
              style={styles.playButton}
            >
              <MaterialIcons name="play-circle-filled" size={30} color="black" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <Text style={styles.recommendedHeading}>Recommended for you</Text>
        <View style={styles.recommendedContainer}>
          <FlatList
            data={videos}
            keyExtractor={(item) => item.id.videoId}
            renderItem={renderVideoItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Basic Category Videos Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={videoModalVisible}
        onRequestClose={closeBasicPlaylistVideoModal}
      >
        
        {selectedBasicVideoId ? (
          <View>
            <YoutubePlayer
              height={320}
              play={true}
              videoId={selectedBasicVideoId}
            />
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeBasicPlaylistVideoModal}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={basicVideos}
              keyExtractor={(item, index) => index.toString()} // Use index as the key
              renderItem={renderBasicVideoItem}

              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeBasicPlaylistVideoModal}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity></View>
          </View>

        )}
      </Modal>


      {/* Relaxation Videos Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={relaxationModalVisible}
        onRequestClose={closeRelaxationPlaylistVideoModal}
      >
        {selectedRelaxationVideoId ? (
          <View>
            <YoutubePlayer
              height={320}
              play={true}
              videoId={selectedRelaxationVideoId}
            />
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeRelaxationPlaylistVideoModal}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity></View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={relaxationVideos}
              keyExtractor={(item, index) => index.toString()} // Use index as the key
              renderItem={renderRelaxationVideoItem}

              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setRelaxationModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity></View>
          </View>

        )}
      </Modal>

      {/* Daily Videos Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={dailyModalVisible}
        onRequestClose={closeDailyPlaylistVideoModal}
      >
        {selectedDailyVideoId ? (
          <View>
            <YoutubePlayer
              height={320}
              play={true}
              videoId={selectedDailyVideoId}
            />
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeDailyPlaylistVideoModal}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity></View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={dailyVideos}
              keyExtractor={(item, index) => index.toString()} // Use index as the key
              renderItem={renderDailyVideoItem}

              showsHorizontalScrollIndicator={false}
            />
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setDailyModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity></View>
          </View>

        )}
      </Modal>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Cover the entire screen
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  username: {
    paddingTop:50,
    fontWeight:'600',
    fontSize: 18,
    marginTop: 10,
  },
  tileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10
  },
  tileBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  dailyThoughtContainer: {
    marginTop: 20,
    width: '100%',
    height: 200,
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dailyThoughtBackground: {
    width: '100%',
    height: 150, // Set the height of the background image
    resizeMode: 'cover', // Cover the entire space with the image
  },

  dailyThoughtHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 20,
    padding: 10,
  },
  dailyThoughtText: {
    fontSize: 18,
    marginTop: 10,
  },
  playButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  playButtonIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  minuteRange: {
    marginTop: 10,
    fontSize: 16,
  },
  recommendedContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  recommendedHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  recommendedTile: {
    marginRight: 10,
    width: 120,
    borderRadius: 8,
    overflow: 'hidden', // Clip the child components to the borderRadius
  },
  recommendedTileBackground: {
    ...StyleSheet.absoluteFillObject, // Cover the entire tile
    resizeMode: 'cover', // Ensure the background image covers the tile
  },
  recommendedTileLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
  recommendedTileText: {
    marginTop: 5,
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  
  videoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginHorizontal: 10, // Adjust the margin as needed
  },
  
  videoThumbnail: {
    width: 100,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 10,
  },
  videoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',}
});
export default WelcomeScreen;