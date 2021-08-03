// code base: https://github.com/EQWorks/ws-product-nodejs
require('dotenv').config();
const Redis = require('ioredis');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const redis = new Redis(
  `redis://redis:${process.env.REDISPASSWORD}@${process.env.REDISHOST}:${process.env.REDISPORT}/0`
);

app.use(cors());

const convertToBpm = x => 0.05 * x + 65;

// endpoints

app.get('/bpm/current', async (req, res, next) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/1445035/feeds.json?api_key=${process.env.THINGSPEAK_API}`
  );

  const { feeds } = response.data;

  return res.json({
    data: parseInt(convertToBpm(feeds[feeds.length - 1].field1)),
  });
});

app.get('/bpm/day', async (req, res, next) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/1445035/feeds.json?api_key=${process.env.THINGSPEAK_API}`
  );

  const { feeds } = response.data;

  return res.json(
    feeds.map(feed => ({
      x: '',
      y: parseInt(convertToBpm(feed.field1)),
    }))
  );
});

app.get('/bpm/week', (req, res, next) => {
  return res.json([
    { x: '0am', y: 50 },
    { x: '1am', y: 50 },
    { x: '2am', y: 50 },
    { x: '3am', y: 50 },
    { x: '4am', y: 50 },
    { x: '5am', y: 50 },
    { x: '6am', y: 50 },
    { x: '7am', y: 50 },
    { x: '8am', y: 50 },
    { x: '9am', y: 50 },
    { x: '10am', y: 50 },
    { x: '11am', y: 50 },
    { x: '0pm', y: 50 },
    { x: '1pm', y: 50 },
    { x: '2pm', y: 50 },
    { x: '3pm', y: 50 },
    { x: '4pm', y: 50 },
    { x: '5pm', y: 50 },
    { x: '6pm', y: 50 },
    { x: '7pm', y: 50 },
    { x: '8pm', y: 50 },
    { x: '9pm', y: 50 },
    { x: '10pm', y: 50 },
    { x: '11pm', y: 50 },
  ]);
});

app.get('/bpm/month', (req, res, next) => {
  return res.json([
    { x: '0am', y: 50 },
    { x: '1am', y: 50 },
    { x: '2am', y: 50 },
    { x: '3am', y: 50 },
    { x: '4am', y: 50 },
    { x: '5am', y: 50 },
    { x: '6am', y: 50 },
    { x: '7am', y: 50 },
    { x: '8am', y: 50 },
    { x: '9am', y: 50 },
    { x: '10am', y: 50 },
    { x: '11am', y: 50 },
    { x: '0pm', y: 50 },
    { x: '1pm', y: 50 },
    { x: '2pm', y: 50 },
    { x: '3pm', y: 50 },
    { x: '4pm', y: 50 },
    { x: '5pm', y: 50 },
    { x: '6pm', y: 50 },
    { x: '7pm', y: 50 },
    { x: '8pm', y: 50 },
    { x: '9pm', y: 50 },
    { x: '10pm', y: 50 },
    { x: '11pm', y: 50 },
  ]);
});

app.listen(process.env.PORT || 5656, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5656}`);
  }
});

process.on('uncaughtException', err => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  process.exit(1);
});
