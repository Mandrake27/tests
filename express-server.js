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

const replaceFirstToEnd = (arr) => {
  const clonnedArr = [...arr];
  const shiftedElem = clonnedArr.shift();
  clonnedArr.push(shiftedElem);
  return clonnedArr;
}

const startorShutDownServer = (turnOff = false) => {
  console.log(turnOff);
  const server = app.listen(port);
  if (turnOff) {
    server.close();
  }
};

const wait = (delay = 200) =>
  new Promise(res => {
    setTimeout(() => {
      res();
    }, delay);
  });

const getTimeOfResponse = async() => {
  const start = new Date();
  await wait();
  return new Date - start;
};

app.get('/information', async (req, res) => {
  const timeOfResponse = await getTimeOfResponse();
  const information = {
    version,
    uptime: Math.floor(process.uptime()),
    timeOfResponse,
  };
  res.status(200).send(information);
});

app.get(`/operation/${OPERATION_NAME.SUMMATION}`, async (req, res) => {
  const { firstOperand, secondOperand } = req.query;
  const timeOfResponse = await getTimeOfResponse();
  const sumResults = {
    firstOperand: Number(firstOperand),
    secondOperand: Number(secondOperand),
    total: Number(firstOperand) + Number(secondOperand),
    timeOfResponse,
  };
  addToHistory(sumResults, OPERATION_NAME.SUMMATION);
  lastOperationName = OPERATION_NAME.SUMMATION;
  totalMathOperations.summation += 1;
  totalMathOperations.total += 1;
  res.status(200).send(sumResults);
});

app.get(`/operation/last`, async (req, res) => {
  const timeOfResponse = await getTimeOfResponse();
  const lastOperations = {
    lastOperationName,
    timeOfResponse,
  };
  res.status(200).send(lastOperations);
});

app.get(`/operation/${OPERATION_NAME.MULTIPLICATION}`, async (req, res) => {
  const { firstOperand, secondOperand } = req.query;
  const timeOfResponse = await getTimeOfResponse();
  const multiplyResults = {
    firstOperand: Number(firstOperand),
    secondOperand: Number(secondOperand),
    total: Number(firstOperand) * Number(secondOperand),
    timeOfResponse,
  };
  addToHistory(multiplyResults, OPERATION_NAME.MULTIPLICATION);
  lastOperationName = OPERATION_NAME.MULTIPLICATION;
  totalMathOperations.multiplication += 1;
  totalMathOperations.total += 1;
  res.status(200).send(multiplyResults);
});

app.get(`/operation/last`, async (req, res) => {
  const timeOfResponse = await getTimeOfResponse();
  const lastOperations = {
    lastOperationName,
    timeOfResponse,
  };
  res.status(200).send(lastOperations);
});

app.get(`/operation/information`, async (req, res) => {
  const timeOfResponse = await getTimeOfResponse();
  const { multiplication, summation, total } = totalMathOperations;
  const operationsInfo = {
    totalAmountOfOperation: total,
    multiplication,
    summation,
    timeOfResponse,
  };
  res.status(200).send(operationsInfo);
});

app.get('/operation/history', async(req, res) => {
  const { sort } = req.query;
  const descOrderedArr = replaceFirstToEnd(history);
  const timeOfResponse = await getTimeOfResponse();
  const historyInfo = {
    history: sort === 'DESC' ? descOrderedArr : history,
    timeOfResponse,
  }
  res.status(200).send(historyInfo);
})

// startorShutDownServer();
module.exports = startorShutDownServer;

