import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

interface CourseProgress {
  id: string;
  course_id: string;
  progress: number;
  completed: boolean;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  submittedAt: string;
  status: string; // Optional: Add a status field (e.g., "Pending", "Accepted", "Rejected")
}

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;

      try {
        // Load profile
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as Profile);
        }

        // Load course progress
        const progressQuery = query(
          collection(db, 'courses_progress'),
          where('user_id', '==', user.uid)
        );
        const progressSnapshot = await getDocs(progressQuery);
        const progressData = progressSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CourseProgress[];
        
        setCourseProgress(progressData);

        // Load applications
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('userId', '==', user.uid) // Fetch applications for the logged-in user
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applicationsData = applicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Application[];
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, { status: newStatus });
      alert('Application status updated successfully!');
      // Optionally, refetch applications to update the UI
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {profile?.full_name || user?.email}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Courses in Progress</h3>
            <p className="text-3xl font-bold text-green-600">
              {courseProgress.filter(c => !c.completed).length}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Completed Courses</h3>
            <p className="text-3xl font-bold text-green-600">
              {courseProgress.filter(c => c.completed).length}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Overall Progress</h3>
            <p className="text-3xl font-bold text-green-600">
              {Math.round((courseProgress.reduce((acc, curr) => acc + curr.progress, 0) / (courseProgress.length * 100)) * 100)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Courses</h3>
        {courseProgress.length === 0 ? (
          <p className="text-gray-600">No courses started yet. Check out our available courses!</p>
        ) : (
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-900">Course {course.course_id}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    course.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{course.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Job Applications</h1>
        {applications.length === 0 ? (
          <p>You have not applied for any jobs yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((application) => (
              <li key={application.id} className="p-4 border rounded-md shadow">
                <h2 className="text-xl font-semibold">{application.jobTitle}</h2>
                <p>
                  <strong>Submitted At:</strong>{' '}
                  {new Date(application.submittedAt).toLocaleString()}
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}