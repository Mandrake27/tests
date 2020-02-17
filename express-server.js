const express = require('express');
const app = express();
const port = 3000;
const { version } = require('./package.json');

const OPERATION_NAME = {
  MULTIPLICATION: 'multiplication',
  SUMMATION: 'summation'
};

let lastOperationName;

const totalMathOperations = {
  total: 0,
  multiplication: 0,
  summation: 0
};

const history = [];

const addToHistory = (obj, operationName) => {
  const newObj = {
    ...obj,
    operationName
  }
  history.push(newObj);
}

const startServer = () => {
  app.listen(port);
};

const wait = (delay = 200) =>
  new Promise(res => {
    setTimeout(() => {
      res();
    }, delay);
  });


app.get('/information', async (req, res) => {
  const start = new Date();
  await wait();
  const data = {
    version,
    uptime: Math.floor(process.uptime()),
    timeOfResponse: new Date() - start
  };
  res.status(200).send(data);
});

app.get(`/operation/${OPERATION_NAME.SUMMATION}`, async (req, res) => {
  const { firstOperand, secondOperand } = req.query;
  const start = new Date();
  await wait();
  const data = {
    firstOperand: Number(firstOperand),
    secondOperand: Number(secondOperand),
    total: Number(firstOperand) + Number(secondOperand),
    timeOfResponse: new Date() - start
  };
  addToHistory(data, OPERATION_NAME.SUMMATION);
  lastOperationName = OPERATION_NAME.SUMMATION;
  totalMathOperations.summation += 1;
  totalMathOperations.total += 1;
  res.status(200).send(data);
});

app.get(`/operation/last`, async (req, res) => {
  const start = new Date();
  await wait();
  const data = {
    lastOperationName,
    timeOfResponse: new Date() - start
  };
  res.status(200).send(data);
});

app.get(`/operation/${OPERATION_NAME.MULTIPLICATION}`, async (req, res) => {
  const { firstOperand, secondOperand } = req.query;
  const start = new Date();
  await wait();
  const data = {
    firstOperand: Number(firstOperand),
    secondOperand: Number(secondOperand),
    total: Number(firstOperand) * Number(secondOperand),
    timeOfResponse: new Date() - start
  };
  addToHistory(data, OPERATION_NAME.MULTIPLICATION);
  lastOperationName = OPERATION_NAME.MULTIPLICATION;
  totalMathOperations.multiplication += 1;
  totalMathOperations.total += 1;
  res.status(200).send(data);
});

app.get(`/operation/last`, async (req, res) => {
  const start = new Date();
  await wait();
  const data = {
    lastOperationName,
    timeOfResponse: new Date() - start
  };
  res.status(200).send(data);
});

app.get(`/operation/information`, async (req, res) => {
  const start = new Date();
  const { multiplication, summation, total } = totalMathOperations;
  await wait();
  const data = {
    totalAmountOfOperation: total,
    multiplication,
    summation,
    timeOfResponse: new Date() - start
  };
  res.status(200).send(data);
});

app.get('/operation/history', async(req, res) => {
  const start = new Date();
  await wait();
  const data = {
    history,
    timeOfResponse: new Date() - start
  }
  console.log(data);
  res.status(200).send(data);
})

startServer();
module.exports = startServer;

