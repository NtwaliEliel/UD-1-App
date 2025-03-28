const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/jobs', async (req, res) => {
  try {
    const response = await axios.get('https://jobs.github.com/positions.json', {
      params: {
        description: 'software'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching jobs from GitHub Jobs:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});