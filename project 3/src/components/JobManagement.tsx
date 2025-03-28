import React, { useState, useEffect } from 'react';
import { addJob, updateJob, deleteJob, getJobs } from '../lib/jobService';

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [job, setJob] = useState({ title: '', description: '', company: '', location: '', skills: '' });
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      const jobs = await getJobs();
      setJobs(jobs);
    }
    fetchJobs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJob(prevJob => ({ ...prevJob, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = { ...job, skills: job.skills.split(',').map(skill => skill.trim()) };
    if (editingJobId) {
      await updateJob(editingJobId, jobData);
    } else {
      await addJob(jobData);
    }
    setJob({ title: '', description: '', company: '', location: '', skills: '' });
    setEditingJobId(null);
    const jobs = await getJobs();
    setJobs(jobs);
  };

  const handleEdit = (job: any) => {
    setJob({ ...job, skills: job.skills.join(', ') });
    setEditingJobId(job.id);
  };

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    const jobs = await getJobs();
    setJobs(jobs);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 mb-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={job.skills}
          onChange={handleChange}
          required
          className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {editingJobId ? 'Update' : 'Add'} Job
        </button>
      </form>
      <ul>
        {jobs.map(job => (
          <li key={job.id} className="bg-white shadow rounded-lg p-4 mb-4">
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
            <div className="mt-2">
              <strong>Required Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {job.skills.map((skill: string) => (
                  <span 
                    key={skill} 
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <button onClick={() => handleEdit(job)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(job.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobManagement;