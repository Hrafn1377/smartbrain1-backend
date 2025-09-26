const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT || 3001;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));
app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/clarifai', (req, res) => image.handleClarifai(req, res));

// Add this after your other routes, before app.listen()
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!', status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});