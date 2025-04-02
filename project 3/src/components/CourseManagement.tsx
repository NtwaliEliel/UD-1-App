import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

interface Lesson {
  title: string;
  content: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  id?: string; // Optional for new courses
  title: string;
  description: string;
  level: string;
  modules: Module[];
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Course>({
    title: '',
    description: '',
    level: '',
    modules: [],
  });
  const [newModule, setNewModule] = useState<Module>({ title: '', lessons: [] });
  const [newLesson, setNewLesson] = useState<Lesson>({ title: '', content: '' });

  useEffect(() => {
    async function fetchCourses() {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    }

    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    try {
      await addDoc(collection(db, 'courses'), newCourse);
      alert('Course added successfully!');
      setNewCourse({ title: '', description: '', level: '', modules: [] });

      // Refresh the course list
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      const courseRef = doc(db, 'courses', editingCourse.id!);
      await updateDoc(courseRef, {
        title: editingCourse.title,
        description: editingCourse.description,
        level: editingCourse.level,
        modules: editingCourse.modules,
      });

      alert('Course updated successfully!');
      setEditingCourse(null);

      // Refresh the course list
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleAddModule = () => {
    if (editingCourse) {
      setEditingCourse({
        ...editingCourse,
        modules: [...editingCourse.modules, newModule],
      });
    } else {
      setNewCourse({
        ...newCourse,
        modules: [...newCourse.modules, newModule],
      });
    }
    setNewModule({ title: '', lessons: [] });
  };

  const handleAddLesson = (moduleIndex: number) => {
    if (editingCourse) {
      const updatedModules = [...editingCourse.modules];
      updatedModules[moduleIndex].lessons.push(newLesson);

      setEditingCourse({
        ...editingCourse,
        modules: updatedModules,
      });
    } else {
      const updatedModules = [...newCourse.modules];
      updatedModules[moduleIndex].lessons.push(newLesson);

      setNewCourse({
        ...newCourse,
        modules: updatedModules,
      });
    }
    setNewLesson({ title: '', content: '' });
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      alert('Course deleted successfully!');

      // Refresh the course list
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id} className="mb-4 p-4 border rounded-md shadow">
            <h3 className="font-bold">{course.title}</h3>
            <p>{course.description}</p>
            <p>Level: {course.level}</p>
            <button
              onClick={() => handleEditCourse(course)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteCourse(course.id!)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {editingCourse ? (
        <div className="mt-8 p-4 border rounded-md shadow">
          <h3 className="text-lg font-bold mb-4">Edit Course</h3>
          <input
            type="text"
            value={editingCourse.title}
            onChange={(e) =>
              setEditingCourse({ ...editingCourse, title: e.target.value })
            }
            placeholder="Course Title"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            value={editingCourse.description}
            onChange={(e) =>
              setEditingCourse({ ...editingCourse, description: e.target.value })
            }
            placeholder="Course Description"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={editingCourse.level}
            onChange={(e) =>
              setEditingCourse({ ...editingCourse, level: e.target.value })
            }
            placeholder="Course Level"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />

          <h4 className="text-md font-semibold mb-2">Modules</h4>
          {editingCourse.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-4">
              <input
                type="text"
                value={module.title}
                onChange={(e) => {
                  const updatedModules = [...editingCourse.modules];
                  updatedModules[moduleIndex].title = e.target.value;
                  setEditingCourse({ ...editingCourse, modules: updatedModules });
                }}
                placeholder="Module Title"
                className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <h5 className="text-sm font-semibold mb-2">Lessons</h5>
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="mb-2">
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => {
                      const updatedModules = [...editingCourse.modules];
                      updatedModules[moduleIndex].lessons[lessonIndex].title =
                        e.target.value;
                      setEditingCourse({ ...editingCourse, modules: updatedModules });
                    }}
                    placeholder="Lesson Title"
                    className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    value={lesson.content}
                    onChange={(e) => {
                      const updatedModules = [...editingCourse.modules];
                      updatedModules[moduleIndex].lessons[lessonIndex].content =
                        e.target.value;
                      setEditingCourse({ ...editingCourse, modules: updatedModules });
                    }}
                    placeholder="Lesson Content"
                    className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="New Lesson Title"
                className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                value={newLesson.content}
                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                placeholder="New Lesson Content"
                className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleAddLesson(moduleIndex)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Lesson
              </button>
            </div>
          ))}
          <input
            type="text"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            placeholder="New Module Title"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddModule}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Module
          </button>
          <button
            onClick={handleUpdateCourse}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="mt-8 p-4 border rounded-md shadow">
          <h3 className="text-lg font-bold mb-4">Add New Course</h3>
          <input
            type="text"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
            placeholder="Course Title"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
            placeholder="Course Description"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={newCourse.level}
            onChange={(e) =>
              setNewCourse({ ...newCourse, level: e.target.value })
            }
            placeholder="Course Level"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />

          <h4 className="text-md font-semibold mb-2">Modules</h4>
          {newCourse.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-4">
              <input
                type="text"
                value={module.title}
                onChange={(e) => {
                  const updatedModules = [...newCourse.modules];
                  updatedModules[moduleIndex].title = e.target.value;
                  setNewCourse({ ...newCourse, modules: updatedModules });
                }}
                placeholder="Module Title"
                className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <h5 className="text-sm font-semibold mb-2">Lessons</h5>
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="mb-2">
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => {
                      const updatedModules = [...newCourse.modules];
                      updatedModules[moduleIndex].lessons[lessonIndex].title =
                        e.target.value;
                      setNewCourse({ ...newCourse, modules: updatedModules });
                    }}
                    placeholder="Lesson Title"
                    className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    value={lesson.content}
                    onChange={(e) => {
                      const updatedModules = [...newCourse.modules];
                      updatedModules[moduleIndex].lessons[lessonIndex].content =
                        e.target.value;
                      setNewCourse({ ...newCourse, modules: updatedModules });
                    }}
                    placeholder="Lesson Content"
                    className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="New Lesson Title"
                className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                value={newLesson.content}
                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                placeholder="New Lesson Content"
                className="block w-full mb-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleAddLesson(moduleIndex)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Lesson
              </button>
            </div>
          ))}
          <input
            type="text"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            placeholder="New Module Title"
            className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddModule}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Module
          </button>
          <button
            onClick={handleAddCourse}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;