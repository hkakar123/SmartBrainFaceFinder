import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import fetch from 'node-fetch';
import knex from 'knex';

import { handleProfileGet } from './controllers/profile.js';
import { handleApiCall, handleImage } from './controllers/image.js';

// ✅ Log DATABASE_URL at the top for debugging
console.log('📌 DATABASE_URL:', process.env.DATABASE_URL);

// ✅ Set up knex DB connection
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 10000,
    acquireTimeoutMillis: 10000,
  },
});

// Optional: Listen for DB connection errors
db.client.pool.on('error', (err) => {
  console.error('Postgres pool error:', err);
});

// ✅ Express app setup
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://smartbrainfacefinder-qqf8.onrender.com',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

// ✅ Test route: See if env var is present
app.get('/env', (req, res) => {
  res.json({ databaseUrl: process.env.DATABASE_URL || 'NOT SET' });
});

// ✅ Test route: Check DB connection
app.get('/testdb', async (req, res) => {
  try {
    const result = await db.raw('SELECT NOW()');
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// ✅ Basic route
app.get('/', (req, res) => {
  res.send('success');
});

// ✅ Sign in route
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json('Incorrect form submission');

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      console.log('Signin DB data:', data); // <-- log fetched login data

      if (data.length) {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        console.log('Password valid:', isValid); // <-- log bcrypt result

        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              if (user.length) {
                console.log('User found:', user[0]);
                res.json(user[0]);
              } else {
                console.log('User not found');
                res.status(400).json('Unable to get user');
              }
            })
            .catch(err => {
              console.error('User select error:', err);
              res.status(400).json('Unable to get user');
            });
        } else {
          console.log('Password does not match');
          res.status(400).json('Wrong credentials');
        }
      } else {
        console.log('No login data found for email');
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => {
      console.error('Signin DB error:', err);
      res.status(400).json('Wrong credentials');
    });
});


app.post('/register', async (req, res) => {
  console.log('🔥 /register hit with body:', req.body);

  let { email, name, password } = req.body;

  // Fix email if it's wrapped as object
  if (typeof email !== 'string' && email.email) {
    email = email.email;
  }

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


// ✅ Profile route
app.get('/profile/:id', (req, res) => {
  handleProfileGet(req, res, db);
});

// ✅ Image routes
app.post('/imageurl', (req, res) => {
  handleApiCall(req, res);
});

app.put('/image', (req, res) => {
  handleImage(req, res, db);
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
