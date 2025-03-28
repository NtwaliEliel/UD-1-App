import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const getUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteUser = async (id: string) => {
  const userRef = doc(db, 'users', id);
  await deleteDoc(userRef);
};