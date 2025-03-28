import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
}

export function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicant, setApplicant] = useState({ name: '', email: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const storage = getStorage();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const jobsData = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }

    fetchJobs();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit button clicked');
    if (!selectedJob || !user) {
      console.error('No job selected or user not logged in');
      return;
    }

    try {
      let resumeUrl = '';
      if (resumeFile) {
        console.log('Uploading resume file...');
        const storageRef = ref(storage, `resumes/${user.uid}/${resumeFile.name}`);
        await uploadBytes(storageRef, resumeFile);
        resumeUrl = await getDownloadURL(storageRef);
        console.log('Resume uploaded successfully:', resumeUrl);
      }

      console.log('Saving application to Firestore...');
      await addDoc(collection(db, 'applications'), {
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        resumeUrl,
        userId: user.uid,
        submittedAt: new Date().toISOString(),
        status: 'Pending',
      });

      alert('Application submitted successfully!');
      setSelectedJob(null);
      setApplicant({ name: '', email: '' });
      setResumeFile(null);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Opportunities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600">{job.description}</p>
            <p className="text-gray-600 font-bold">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
            <button
              onClick={() => setSelectedJob(job)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Apply for {selectedJob.title}</h2>
            <form onSubmit={handleApply}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={applicant.name}
                onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                required
                className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={applicant.email}
                onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                required
                className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="mb-4">
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                  Upload Your Resume
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-sm text-gray-500">Accepted formats: .pdf, .doc, .docx</p>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}