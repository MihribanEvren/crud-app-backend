import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport';
import mongoose from 'mongoose';
import './strategies/local-strategy.mjs';

const PORT = process.env.PORT || 3000;

const app = express();

mongoose
  .connect('mongodb://localhost/express-tut')
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser('Helloworld'));
app.use(
  session({
    secret: 'mihi the dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

// Authantication with passport.js library
// Session'dan sonra, Route'lardan önce yapılır
app.use(passport.initialize());
app.use(passport.session());

// Set Global Routes
app.use(routes);

// 'local' is strategy name. you can use names like google, facebook, github
app.post('/api/auth', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

app.get('/api/auth/status', (req, res) => {
  console.log(`inside /auth/status endpoint`);
  console.log(req.user);
  console.log(req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});

app.get('/', (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.cookie('hello', 'world', { maxAge: 30000, signed: true });
  res.status(200).send({ msg: 'Hello' });
});

app.post('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;

  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
