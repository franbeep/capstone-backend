// code base: https://github.com/EQWorks/ws-product-nodejs
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const cors = require('cors');

const app = express();
const pool = new pg.Pool();

const queryHandler = (req, res, next) => {
  pool
    .query(req.sqlQuery)
    .then(r => {
      return res.json(r.rows || []);
    })
    .catch(next);
};

app.use(cors());

// endpoints

app.get(
  '/bpm/current',
  (req, res, next) => {
    return res.json({data: Math.floor(Math.random() * 120)});
  }
);

app.get(
  '/bpm/day',
  (req, res, next) => {
    return res.json([
      {x: "0am", y: 50},
      {x: "1am", y: 50},
      {x: "2am", y: 50},
      {x: "3am", y: 50},
      {x: "4am", y: 50},
      {x: "5am", y: 50},
      {x: "6am", y: 50},
      {x: "7am", y: 50},
      {x: "8am", y: 50},
      {x: "9am", y: 50},
      {x: "10am", y: 50},
      {x: "11am", y: 50},
      {x: "0pm", y: 50},
      {x: "1pm", y: 50},
      {x: "2pm", y: 50},
      {x: "3pm", y: 50},
      {x: "4pm", y: 50},
      {x: "5pm", y: 50},
      {x: "6pm", y: 50},
      {x: "7pm", y: 50},
      {x: "8pm", y: 50},
      {x: "9pm", y: 50},
      {x: "10pm", y: 50},
      {x: "11pm", y: 50}
    ]);
  }
);

app.get(
  '/bpm/week',
  (req, res, next) => {
    return res.json([
      {x: "0am", y: 50},
      {x: "1am", y: 50},
      {x: "2am", y: 50},
      {x: "3am", y: 50},
      {x: "4am", y: 50},
      {x: "5am", y: 50},
      {x: "6am", y: 50},
      {x: "7am", y: 50},
      {x: "8am", y: 50},
      {x: "9am", y: 50},
      {x: "10am", y: 50},
      {x: "11am", y: 50},
      {x: "0pm", y: 50},
      {x: "1pm", y: 50},
      {x: "2pm", y: 50},
      {x: "3pm", y: 50},
      {x: "4pm", y: 50},
      {x: "5pm", y: 50},
      {x: "6pm", y: 50},
      {x: "7pm", y: 50},
      {x: "8pm", y: 50},
      {x: "9pm", y: 50},
      {x: "10pm", y: 50},
      {x: "11pm", y: 50}
    ]);
  }
);

app.get(
  '/bpm/month',
  (req, res, next) => {
    return res.json([
      {x: "0am", y: 50},
      {x: "1am", y: 50},
      {x: "2am", y: 50},
      {x: "3am", y: 50},
      {x: "4am", y: 50},
      {x: "5am", y: 50},
      {x: "6am", y: 50},
      {x: "7am", y: 50},
      {x: "8am", y: 50},
      {x: "9am", y: 50},
      {x: "10am", y: 50},
      {x: "11am", y: 50},
      {x: "0pm", y: 50},
      {x: "1pm", y: 50},
      {x: "2pm", y: 50},
      {x: "3pm", y: 50},
      {x: "4pm", y: 50},
      {x: "5pm", y: 50},
      {x: "6pm", y: 50},
      {x: "7pm", y: 50},
      {x: "8pm", y: 50},
      {x: "9pm", y: 50},
      {x: "10pm", y: 50},
      {x: "11pm", y: 50}
    ]);
  }
);

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