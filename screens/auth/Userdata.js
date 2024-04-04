import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const fetchUserData = async (userId) => {
  const db = getFirestore();
  const usersCollection = collection(db, 'users');

  try {
    const q = query(usersCollection, where('userid', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      console.log(`No document found for userid: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting user data: ', error);
    throw error;
  }


};

export default fetchUserData;
