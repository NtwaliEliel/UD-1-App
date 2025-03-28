import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getUsers, deleteUser } from '../lib/userService';
import CourseManagement from './CourseManagement';
import JobManagement from './JobManagement';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  resume: string;
  resumeUrl?: string;
  submittedAt: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const applicationsSnapshot = await getDocs(collection(db, 'applications'));
        const applicationsData = applicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[];
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    }

    async function fetchUsers() {
      const users = await getUsers();
      setUsers(users);
    }

    fetchApplications();
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    const users = await getUsers();
    setUsers(users);
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, { status: newStatus });
      alert(`Application status updated to ${newStatus}`);
      // Update the local state to reflect the change
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
      <ul className="mb-4">
        {users.map(user => (
          <li key={user.id} className="bg-white shadow rounded-lg p-4 mb-4">
            <h3 className="font-semibold">{user.email}</h3>
            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-4">Manage Courses</h2>
      <CourseManagement />
      <h2 className="text-xl font-semibold mb-4">Manage Jobs</h2>
      <JobManagement />
      <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
      <ul>
        {applications.map((application) => (
          <li key={application.id} className="mb-4 p-4 border rounded-md shadow">
            <h3 className="font-bold">{application.jobTitle}</h3>
            <p>
              <strong>Applicant Name:</strong> {application.applicantName}
            </p>
            <p>
              <strong>Applicant Email:</strong> {application.applicantEmail}
            </p>
            <p>
              <strong>Resume:</strong>{' '}
              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              ) : (
                'N/A'
              )}
            </p>
            <p>
              <strong>Submitted At:</strong> {new Date(application.submittedAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`${
                  application.status === 'Accepted'
                    ? 'text-green-600'
                    : application.status === 'Rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                } font-bold`}
              >
                {application.status}
              </span>
            </p>
            <div className="mt-2">
              {application.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(application.id, 'Accepted')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(application.id, 'Rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
              {application.status === 'Accepted' && (
                <button
                  disabled
                  className="px-4 py-2 bg-green-200 text-green-800 rounded-md cursor-not-allowed"
                >
                  Accepted
                </button>
              )}
              {application.status === 'Rejected' && (
                <button
                  disabled
                  className="px-4 py-2 bg-red-200 text-red-800 rounded-md cursor-not-allowed"
                >
                  Rejected
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;