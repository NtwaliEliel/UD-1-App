import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

export const addCourse = async (course: any) => {
  const courseRef = await addDoc(collection(db, 'courses'), course);
  return courseRef.id;
};

export const updateCourse = async (id: string, course: any) => {
  const courseRef = doc(db, 'courses', id);
  await updateDoc(courseRef, course);
};

export const deleteCourse = async (id: string) => {
  const courseRef = doc(db, 'courses', id);
  await deleteDoc(courseRef);
};

export const getCourses = async () => {
  const coursesSnapshot = await getDocs(collection(db, 'courses'));
  return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};