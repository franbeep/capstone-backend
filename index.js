// code base: https://github.com/EQWorks/ws-product-nodejs
require('dotenv').config();
const Redis = require('ioredis');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const redis = new Redis(
  `redis://redis:${process.env.REDISPASSWORD}@${process.env.REDISHOST}:${process.env.REDISPORT}/0`
);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const oneHour = 60 * 60 * 1000;
const oneDay = 24 * oneHour;

const convertToBpm = x => 0.05 * x + 65;
const removeTimes = item => ({ x: item.x, y: parseInt(item.y / item.times) });
const convertToAMPM = hour => (hour > 12 ? `${hour - 12}pm` : `${hour}am`);
const convertToAMPMMap = feed => ({
  x: `${convertToAMPM(new Date(feed.created_at).getHours())}`,
  y: parseInt(convertToBpm(feed.field1)),
});
const convertToHourMinute = feed => ({
  x: `${new Date(feed.created_at).getHours()}:${new Date(
    feed.created_at
  ).getMinutes()}`,
  y: parseInt(convertToBpm(feed.field1)),
});

const combineFeedAverageReducer = (accumulator, current) => {
  //
  if (accumulator.some(item => item.x == current.x)) {
    return accumulator.map(item => {
      if (item.x == current.x)
        return {
          ...item,
          y: item.y + current.y,
          times: item.times + 1,
        };
      return item;
    });
  } else {
    return accumulator.concat({ ...current, times: 1 });
  }
};

// endpoints

app.get('/controller/action', async (req, res, next) => {
  //
  const action = await redis.get('current-action');
  return res.json({
    data: `current action: ${action}`,
  });
});

app.post('/controller/action', async (req, res, next) => {
  //
  const action = `${req.body['action']}: ${req.body['theme']}`;
  await redis.set('current-action', action);
  return res.json({
    data: `action '${action}' set`,
  });
});

app.get('/bpm/current', async (req, res, next) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/1445035/feeds.json?api_key=${process.env.THINGSPEAK_API}`
  );

  const { feeds } = response.data;

  return res.json({
    data: parseInt(convertToBpm(feeds[feeds.length - 1].field1)),
  });
});

app.get('/bpm/hour', async (req, res, next) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/1445035/feeds.json?api_key=${process.env.THINGSPEAK_API}`
  );

  const { feeds } = response.data;
  const filteredFeeds = feeds.filter(feed => {
    const date = new Date(feed.created_at);
    const today = new Date();
    return date > today - oneHour;
  });

  return res.json(
    filteredFeeds
      .map(convertToHourMinute)
      .reduce(combineFeedAverageReducer, [])
      .map(removeTimes)
  );
});

app.get('/bpm/day', async (req, res, next) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/1445035/feeds.json?api_key=${process.env.THINGSPEAK_API}`
  );

  const { feeds } = response.data;
  const filteredFeeds = feeds.filter(feed => {
    const date = new Date(feed.created_at);
    const today = new Date();
    return date > today - oneDay;
  });

  return res.json(
    filteredFeeds
      .map(convertToAMPMMap)
      .reduce(combineFeedAverageReducer, [])
      .map(removeTimes)
  );
});

app.get('/bpm/week', async (req, res, next) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/1445035/feeds.json?api_key=${process.env.THINGSPEAK_API}`
  );

  const { feeds } = response.data;
  const filteredFeeds = feeds.filter(feed => {
    const date = new Date(feed.created_at);
    const today = new Date();
    return date > today - oneDay * 7;
  });

  return res.json(
    filteredFeeds
      .map(convertToAMPMMap)
      .reduce(combineFeedAverageReducer, [])
      .map(removeTimes)
  );
});

app.get('/bpm/month', async (req, res, next) => {
  const response = await axios.get(
    `https://api.thingspeak.com/channels/1445035/feeds.json?api_key=${process.env.THINGSPEAK_API}`
  );

  const { feeds } = response.data;
  const filteredFeeds = feeds.filter(feed => {
    const date = new Date(feed.created_at);
    const today = new Date();
    return date > today - oneDay * 30;
  });

  return res.json(
    filteredFeeds
      .map(convertToAMPMMap)
      .reduce(combineFeedAverageReducer, [])
      .map(removeTimes)
  );
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
