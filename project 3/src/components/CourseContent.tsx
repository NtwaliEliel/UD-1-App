import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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

const CourseContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId!));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() } as Course);
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div>Loading course content...</div>;
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="text-gray-600 font-bold mb-8">Level: {course.level}</p>

      {course.modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Module {moduleIndex + 1}: {module.title}</h2>
          {module.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="mb-4">
              <h3 className="text-xl font-medium">Lesson {lessonIndex + 1}: {lesson.title}</h3>
              <p className="text-gray-600">{lesson.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CourseContent;