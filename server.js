const path = require('path');
const cors = require('cors');
const express = require('express');
const proxy = require('express-http-proxy');
const spamBlocker = require('express-spam-referral-blocker');
const cities = require('all-the-cities');
const uniqby = require('lodash.uniqby');
const sortby = require('lodash.sortby');
const pick = require('pedantic-pick');
const unfetch = require('isomorphic-unfetch');

const port = parseInt(process.env.PORT, 10) || 3000;

const APP_ROUTES = [
  '/guide',
  '/demand/create',
  '/travel/create',
  /^\/track/,
];

const NEO_NODE_HTTPS = true;
const NEO_NODE = 'seed4.switcheo.network:10331';
const NEON_BASE = 'http://testnet-api.wallet.cityofzion.io';
const NEON_URI = 'http://testnet-api.wallet.cityofzion.io/v2/address/balance/';
const NEOSCAN_URI = 'https://neoscan-testnet.io/api/test_net/v1/get_address/';
const CITY_SUGGESTIONS_COUNT = 4;

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});

const app = express();

spamBlocker.setReferrers(['mulechain.com']);
app.use(spamBlocker.send404);

// API routes

const userResHeaderDecorator = (headers) => {
  headers['cache-control'] = 'no-cache, no-store, must-revalidate';
  return headers;
};

app.options('/neo-rpc', cors());
app.use('/neo-rpc', cors(), proxy(NEO_NODE, {
  https: NEO_NODE_HTTPS,
  userResHeaderDecorator,
  proxyReqPathResolver: () => '/',
}));

app.use('/neon-testnet-api', proxy(NEON_BASE, { userResHeaderDecorator }));

app.get('/api/balance/:address', cors(), async (req, res) => {
  const { address } = req.params;
  let results;
  try {
    results = await Promise.all([
      (async () => {
        const resp = await unfetch(`${NEOSCAN_URI}${address}`);
        return resp.json();
      })(),
      (async () => {
        const resp = await unfetch(`${NEON_URI}${address}`);
        return resp.json();
      })(),
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message || err });
    return;
  }
  let neoscanBalance = 0;
  let neonBalance = 0;
  try {
    if (results[0].balance) {
      const neoscanMatches = results[0].balance.filter(b => b.asset === 'GAS');
      neoscanBalance = neoscanMatches.length ? neoscanMatches[0].amount : 0;
    }
  } catch (err) {
    console.warn('Could not get a balance:', err);
  }
  try {
    neonBalance = results[1].GAS.balance;
  } catch (err) {
    console.warn('Could not get a balance:', err);
  }
  let winningBalance;
  if (neoscanBalance > 0) winningBalance = neoscanBalance;
  if (neonBalance >= neoscanBalance) winningBalance = neonBalance;
  res
    .set('cache-control', 'no-cache, no-store, must-revalidate')
    .json({ balance: winningBalance });
});

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
