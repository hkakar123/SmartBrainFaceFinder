import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import fetch from 'node-fetch';
import knex from 'knex';

import { handleProfileGet } from './controllers/profile.js';
import { handleApiCall, handleImage } from './controllers/image.js';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});


const app = express();

//app.use(bodyParser.json());
app.use(express.json());

app.use(cors()); // allow all origins (remove this before production)

app.get('/', (req, res) => {
  res.send('success');
});

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

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  console.log('Registering:', req.body);

  if (!email || !name || !password) {
    console.log('❌ Missing field:', { email, name, password });
    return res.status(400).json('Incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('*')
    .then(loginRows => {
      const loginEmail = loginRows[0].email;
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail,
          name: name,
          joined: new Date()
        })
        .then(user => {
          console.log('✅ Registered user:', user[0]);
          res.json(user[0]);
        });
    })
    .then(trx.commit)
    .catch(err => {
      console.log('❌ Error inserting user:', err);
      trx.rollback();
    });
  })
  .catch(err => {
    console.log('❌ Transaction error:', err);
    res.status(400).json('Unable to register');
  });
});



app.get('/profile/:id', (req, res) => {
  handleProfileGet(req, res, db);
});

app.post('/imageurl', (req, res) => {
  handleApiCall(req, res);
});

app.put('/image', (req, res) => {
  handleImage(req, res, db);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
