import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Optional for table formatting


interface Lesson {
  title: string;
  content: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  modules: Module[];
}

export function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]); // Track enrolled courses
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    async function fetchEnrolledCourses() {
      if (!user) return;

      try {
        const progressSnapshot = await getDocs(
          query(collection(db, 'courses_progress'), where('user_id', '==', user.uid))
        );
        const enrolledCourseIds = progressSnapshot.docs.map(doc => doc.data().course_id);
        setEnrolledCourses(enrolledCourseIds);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    }

    fetchCourses();
    fetchEnrolledCourses();
    setLoading(false);
  }, [user]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      // Add enrollment to Firestore
      await addDoc(collection(db, 'courses_progress'), {
        user_id: user.uid,
        course_id: courseId,
        progress: 0,
        completed: false,
      });

      alert('You have successfully enrolled in the course!');

      // Update enrolled courses state
      setEnrolledCourses(prev => [...prev, courseId]);

      // Redirect to the course content page
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleDownloadCourse = (course: Course) => {
    const doc = new jsPDF();

    doc.setFont('OpenSans', 'normal'); // Set the font to OpenSans
    doc.setFontSize(12);
    
    let yOffset = 10; // Initial Y offset for the PDF content

    // Add course title
    doc.setFontSize(18);
    doc.text(course.title, 10, yOffset);
    yOffset += 10;

    // Add course description with word wrapping
    doc.setFontSize(12);
    const descriptionLines = doc.splitTextToSize(`Description: ${course.description}`, 180);
    doc.text(descriptionLines, 10, yOffset);
    yOffset += descriptionLines.length * 6;

    // Add course level
    doc.text(`Level: ${course.level}`, 10, yOffset);
    yOffset += 10;

    // Add modules and lessons
    course.modules.forEach((module, moduleIndex) => {
      // Add module title
      doc.setFontSize(14);
      doc.text(`Module ${moduleIndex + 1}: ${module.title}`, 10, yOffset);
      yOffset += 8;

      module.lessons.forEach((lesson, lessonIndex) => {
        // Add lesson title
        doc.setFontSize(12);
        const lessonTitleLines = doc.splitTextToSize(`  Lesson ${lessonIndex + 1}: ${lesson.title}`, 180);
        doc.text(lessonTitleLines, 10, yOffset);
        yOffset += lessonTitleLines.length * 6;

        // Add lesson content with word wrapping
        const lessonContentLines = doc.splitTextToSize(`    Content: ${lesson.content}`, 180);
        doc.text(lessonContentLines, 10, yOffset);
        yOffset += lessonContentLines.length * 6;

        // Check if the Y offset exceeds the page height, and add a new page if necessary
        if (yOffset > 280) {
          doc.addPage();
          yOffset = 10; // Reset Y offset for the new page
        }
      });

      // Add spacing between modules
      yOffset += 10;

      // Check if the Y offset exceeds the page height, and add a new page if necessary
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 10; // Reset Y offset for the new page
      }
    });

    // Save the PDF
    doc.save(`${course.title}.pdf`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-gray-600 font-bold">Level: {course.level}</p>
            {!enrolledCourses.includes(course.id) ? (
              <button
                onClick={() => handleEnroll(course.id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enroll
              </button>
            ) : (
              <p className="mt-4 text-green-600 font-semibold">You are enrolled in this course</p>
            )}
            <button
              onClick={() => handleDownloadCourse(course)}
              className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}