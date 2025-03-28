import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, auth } from './firebaseAdmin.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'RwR+2fLGgPTGfUXTUFesV965qFiZax9hKrZoLs8qBnM=';

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = await auth.createUser({
      email,
      password: hashedPassword,
    });
    await db.collection('users').doc(userRecord.uid).set({
      email,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: userRecord.uid }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login user' });
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/jobs', async (req, res) => {
  try {
    const jobsSnapshot = await db.collection('jobs').get();
    const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.post('/jobs', authenticate, async (req, res) => {
  try {
    const job = req.body;
    const jobRef = await db.collection('jobs').add(job);
    res.status(201).json({ id: jobRef.id, ...job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});