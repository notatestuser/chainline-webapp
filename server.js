const path = require('path');
const cors = require('cors');
const express = require('express');
const proxy = require('express-http-proxy');
const cities = require('all-the-cities');
const uniqby = require('lodash.uniqby');
const sortby = require('lodash.sortby');
const pick = require('pedantic-pick');

const port = parseInt(process.env.PORT, 10) || 3000;

const APP_ROUTES = [
  '/guide',
  '/demand/create',
  '/travel/create',
  /^\/track/,
];

const NEO_NODE = 'seed3.neo.org:20331';
const CITY_SUGGESTIONS_COUNT = 4;

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});

const app = express();

// API routes

app.options('/neo-rpc', cors());
app.use('/neo-rpc', cors(), proxy(NEO_NODE, {
  https: true,
  proxyReqPathResolver: () => '/',
}));

app.get('/api/cities-suggest.json', (req, res) => {
  let matches;
  try {
    const { search } = pick(req.query, '!nes::search');
    const exp = new RegExp(`^${search}`, 'i');
    matches = cities.filter(city => exp.test(city.name))
      .slice(0, CITY_SUGGESTIONS_COUNT);
  } catch (error) {
    res.status(400).json({ error });
    return;
  }
  matches = uniqby(matches, ({ name }) => name);
  matches = sortby(matches, ({ name }) => name.length);
  const out = matches.map(({ name }) => name);
  res.json(out);
});

app.get('/api/city-coords.json', (req, res) => {
  let matches;
  try {
    const { city: search } = pick(req.query, '!nes::city');
    matches = cities.filter(city => city.name === search)
      .slice(0, CITY_SUGGESTIONS_COUNT);
  } catch (error) {
    res.status(400).json({ error });
    return;
  }
  if (!matches.length) {
    res.status(404).json({ error: 'not found' });
  }
  const { lat, lon } = matches[0];
  res.json([lat, lon]);
});

// App routes

app.use(express.static(`${__dirname}/dist`));

APP_ROUTES.forEach((route) => {
  app.get(route, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
});

// Start

app.listen(port, () => console.log(`> Ready on http://localhost:${port}`));
