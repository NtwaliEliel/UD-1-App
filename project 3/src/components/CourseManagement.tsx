import React, { useState, useEffect } from 'react';
import { addCourse, updateCourse, deleteCourse, getCourses } from '../lib/courseService';

interface Lesson {
  title: string;
  content: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    level: '',
    modules: [] as Module[], // Array of modules
  });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newModule, setNewModule] = useState<Module>({ title: '', lessons: [] }); // New module state
  const [newLesson, setNewLesson] = useState<Lesson>({ title: '', content: '' }); // New lesson state

  useEffect(() => {
    async function fetchCourses() {
      const courses = await getCourses();
      setCourses(courses);
    }
    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourse(prevCourse => ({ ...prevCourse, [name]: value }));
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewModule(prevModule => ({ ...prevModule, [name]: value }));
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLesson(prevLesson => ({ ...prevLesson, [name]: value }));
  };

  const addLesson = () => {
    setNewModule(prevModule => ({
      ...prevModule,
      lessons: [...prevModule.lessons, newLesson],
    }));
    setNewLesson({ title: '', content: '' });
  };

  const addModule = () => {
    setCourse(prevCourse => ({
      ...prevCourse,
      modules: [...prevCourse.modules, newModule],
    }));
    setNewModule({ title: '', lessons: [] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourseId) {
      await updateCourse(editingCourseId, course);
    } else {
      await addCourse(course);
    }
    setCourse({ title: '', description: '', level: '', modules: [] });
    setEditingCourseId(null);
    const courses = await getCourses();
    setCourses(courses);
  };

  const handleEdit = (course: any) => {
    setCourse(course);
    setEditingCourseId(course.id);
  };

  const handleDelete = async (id: string) => {
    await deleteCourse(id);
    const courses = await getCourses();
    setCourses(courses);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 mb-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={course.description}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="level"
          placeholder="Course Level"
          value={course.level}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <h3 className="text-lg font-semibold mb-2">Add Modules</h3>
        <input
          type="text"
          name="title"
          placeholder="Module Title"
          value={newModule.title}
          onChange={handleModuleChange}
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <h4 className="text-md font-semibold mb-2">Add Lessons to Module</h4>
        <input
          type="text"
          name="title"
          placeholder="Lesson Title"
          value={newLesson.title}
          onChange={handleLessonChange}
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <textarea
          name="content"
          placeholder="Lesson Content (e.g., videos, quizzes)"
          value={newLesson.content}
          onChange={handleLessonChange}
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={addLesson}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Lesson
        </button>
        <ul className="mb-4">
          {newModule.lessons.map((lesson, index) => (
            <li key={index} className="text-gray-700">
              {index + 1}. {lesson.title}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={addModule}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Module
        </button>
        <ul className="mb-4">
          {course.modules.map((module, index) => (
            <li key={index} className="text-gray-700">
              {index + 1}. {module.title}
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {editingCourseId ? 'Update' : 'Add'} Course
        </button>
      </form>
      <ul>
        {courses.map(course => (
          <li key={course.id} className="bg-white shadow rounded-lg p-4 mb-4">
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
            <span className="text-sm bg-green-100 text-green-800 px-2 rounded">
              {course.level}
            </span>
            <div className="mt-2">
              <button onClick={() => handleEdit(course)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(course.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManagement;