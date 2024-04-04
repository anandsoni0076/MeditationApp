// import { getAuth, signOut } from "firebase/auth";

// const auth = getAuth();
// signOut(auth).then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const useAuth = () => {
  const auth = getAuth();
  const navigation = useNavigation();

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log('Sign-out successful.');
      // You can perform additional actions after successful sign-out

      // Navigate to the login page
      navigation.navigate('Login');
    } catch (error) {
      console.error('Sign-out failed', error);
      // Handle the error as needed
    }
  };

  return { signOut };
};

export default useAuth;


