// filepath: client/src/components/EmployerDashboard.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Job {
  title: string;
  description: string;
  company: string;
  location: string;
}

const EmployerDashboard: React.FC = () => {
  const [job, setJob] = useState<Job>({
    title: '',
    description: '',
    company: '',
    location: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/jobs', job, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Job posted successfully');
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div>
      <h1>Employer Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default EmployerDashboard;