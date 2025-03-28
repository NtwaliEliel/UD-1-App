import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import axios from 'axios';

export const fetchAndStoreJobs = async () => {
  const response = await axios.get('https://jobs.googleapis.com/v1/jobs', {
    params: {
      key: process.env.VITE_REACT_APP_GOOGLE_JOBS_API_KEY,
    },
  });
  const jobs = response.data.jobs;
  for (const job of jobs) {
    await addDoc(collection(db, 'jobs'), job);
  }
};

export const addJob = async (job: any) => {
  const jobRef = await addDoc(collection(db, 'jobs'), job);
  return jobRef.id;
};

export const updateJob = async (id: string, job: any) => {
  const jobRef = doc(db, 'jobs', id);
  await updateDoc(jobRef, job);
};

export const deleteJob = async (id: string) => {
  const jobRef = doc(db, 'jobs', id);
  await deleteDoc(jobRef);
};

export const getJobs = async () => {
  const jobsSnapshot = await getDocs(collection(db, 'jobs'));
  return jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};