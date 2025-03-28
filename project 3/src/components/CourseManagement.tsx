import React, { useState, useEffect } from 'react';
import { addCourse, updateCourse, deleteCourse, getCourses } from '../lib/courseService';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [course, setCourse] = useState({ title: '', description: '', level: '', content: '' });
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourseId) {
      await updateCourse(editingCourseId, course);
    } else {
      await addCourse(course);
    }
    setCourse({ title: '', description: '', level: '', content: '' });
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
        <textarea
          name="content"
          placeholder="Course Content (e.g., modules, lessons)"
          value={course.content}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
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