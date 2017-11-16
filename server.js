const path = require('path');
const express = require('express');

const port = parseInt(process.env.PORT, 10) || 3000;

const APP_ROUTES = [
  '/guide',
  '/demand/create',
  '/travel/create',
  /^\/track/,
];

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});

const app = express();
app.use(express.static(`${__dirname}/dist`));

APP_ROUTES.forEach((route) => {
  app.get(route, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
});

app.listen(port, () => console.log(`> Ready on http://localhost:${port}`));
