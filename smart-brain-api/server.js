const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');  
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const knex = require('knex');

const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1', 
    user: 'postgres',
    password: 'test',
    database: 'smart-brain'
  }
});



app.use(bodyParser.json());
app.use(cors());  // Make sure cors is before routes

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

// REGISTER route
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) return res.status(400).json('Incorrect form submission');

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        });
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(() => res.status(400).json('Unable to register'));
});


app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

app.put('/image', (req, res) => image.handleImage(req, res, db));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
