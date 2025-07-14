import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import fetch from 'node-fetch';
import knex from 'knex';

import { handleProfileGet } from './controllers/profile.js';
import { handleApiCall, handleImage } from './controllers/image.js';

// ✅ First: initialize express app
const app = express();

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false, require: true }
  },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 10000,
    acquireTimeoutMillis: 10000,
  }
});


// Optional: log DB errors
db.client.pool.on('error', (err) => {
  console.error('Postgres pool error', err);
});

db.on('error', (err) => {
  console.error('Knex DB connection error:', err);
});

// ✅ Test routes
app.get('/env', (req, res) => {
  res.json({ databaseUrl: process.env.DATABASE_URL || 'NOT SET' });
});

app.get('/testdb', async (req, res) => {
  try {
    const result = await db.raw('SELECT NOW()');
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'https://smartbrainfacefinder-qqf8.onrender.com',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

// Root
app.get('/', (req, res) => {
  res.send('success');
});

// Signin
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json('Incorrect form submission');

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length && bcrypt.compareSync(password, data[0].hash)) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            if (user.length) res.json(user[0]);
            else res.status(400).json('Unable to get user');
          })
          .catch(() => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(() => res.status(400).json('Wrong credentials'));
});

// Register
app.post('/register', async (req, res) => {
  console.log('🔥 /register hit with body:', req.body);

  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    console.log('❌ Missing field:', { email, name, password });
    return res.status(400).json('Incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  try {
    const user = await db.transaction(async trx => {
      const loginEmail = await trx('login')
        .insert({ hash: hash, email: email })
        .returning('email');

      if (!loginEmail.length) throw new Error('No email returned');

      const userRows = await trx('users')
        .insert({ email: loginEmail[0], name: name, joined: new Date() })
        .returning('*');

      if (!userRows.length) throw new Error('No user returned');

      return userRows[0];
    });

    console.log('✅ Registered user:', user);
    return res.json(user);
  } catch (err) {
    console.error('❌ Register error:', err);
    return res.status(500).json('Unable to register');
  }
});

// Other routes
app.get('/profile/:id', (req, res) => {
  handleProfileGet(req, res, db);
});

app.post('/imageurl', (req, res) => {
  handleApiCall(req, res);
});

app.put('/image', (req, res) => {
  handleImage(req, res, db);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
