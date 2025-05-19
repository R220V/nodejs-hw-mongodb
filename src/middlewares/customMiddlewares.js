import express from 'express';

const app = express();

export const middleware404 = app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

export const middleware500 = app.use((err, req, res, next) => {
  res.status(500).json({
    message: `Something went wrong`,
    error: err.message,
  });
});
