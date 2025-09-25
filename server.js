const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: 'process.env.postgresql://myndgreiningdb_user:Gt8viEG6WOu6zABVMCbsLknFMhZBTgKE@dpg-d3ap731gv73c739dpilg-a/myndgreiningdb',
    port: 5432,
    host: 'process.env.myndgreiningdb.virgina.onrender.com',
    user: 'process.env.myndgreiningdb_user',
    password: 'Gt8viEG6WOu6zABVMCbsLknFMhZBTgKE',
    database: 'myndgreiningdb'
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

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});