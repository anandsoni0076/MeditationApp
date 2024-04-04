import React from 'react';
import { NavigationContainer, useRoute ,getFocusedRouteNameFromRoute} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './screens/HomeScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import WelcomeScreen from './screens/WelcomeScreen';
import Meditate from './screens/Meditate';
import Profile from './screens/Profile';
import Music from './screens/Music';
import { colors } from './assets/colors1';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  const route = useRoute();

  const isRouteFocused = (routeName) => {
    const focusedRoute = getFocusedRouteNameFromRoute(route) || 'Welcome';
    return routeName === focusedRoute;
  };

  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: colors.violet }}
      shifting={true}
      sceneAnimationEnabled={true}
    >
      <Tab.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="home"
              color={isRouteFocused('Welcome') ? colors.violet : 'white'}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Meditate"
        component={Meditate}
        options={{
          tabBarLabel: 'Meditate',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="meditation"
              color={isRouteFocused('Meditate') ? colors.violet : 'white'}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Music"
        component={Music}
        options={{
          tabBarLabel: 'Music',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="music"
              color={isRouteFocused('Music') ? colors.violet : 'white'}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="account"
              color={isRouteFocused('Profile') ? colors.violet : 'white'}
              size={26}
            />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home Screen' ,headerShown:false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login Screen' }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: 'SignUp Screen' }}
        />
        <Stack.Screen
          name="Tabs"
          component={HomeTabs}
          options={{ headerShown: false}}
          
        />
        <Stack.Screen
        name = 'Welcome'
        component={WelcomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
