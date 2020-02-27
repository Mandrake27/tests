const express = require('express');
const app = express();
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
  };
  history.push(newObj);
};

const sortByTime = arr => {
  const clonnedArr = [...arr];
  return clonnedArr.sort((a, b) => b.total - a.total);
};

app.use((req, res, next) => {
  const startTime = process.hrtime();
  res.sendWithHistory = data => {
    const elapsedHours = process.hrtime(startTime);
    const timeOfResponse = elapsedHours[1] / 1e2;
    const result = { ...data, timeOfResponse };
    return result
  }
  next();
})

app.use((req, res, next) => {
  const startTime = process.hrtime();
  res.sendJson = data => {
    const elapsedHours = process.hrtime(startTime);
    const timeOfResponse = elapsedHours[1] / 1e2;
    const finalResult = { ...data, timeOfResponse };
    res.status(200).send(finalResult);
  };
  next();
});


app.get('/information', async (req, res) => {
  const information = {
    version,
    uptime: Math.floor(process.uptime())
  };
  res.sendJson(information);
});

app.get(`/operation/${OPERATION_NAME.SUMMATION}`, async (req, res) => {
  const { firstOperand, secondOperand } = req.query;
  const sumResults = {
    firstOperand: Number(firstOperand),
    secondOperand: Number(secondOperand),
    total: Number(firstOperand) + Number(secondOperand),
  };
  addToHistory(sumResults, OPERATION_NAME.SUMMATION);
  lastOperationName = OPERATION_NAME.SUMMATION;
  totalMathOperations.summation += 1;
  totalMathOperations.total += 1;
  const summationResult = await res.sendWithHistory(sumResults);
  res.sendJson(summationResult);
});

app.get(`/operation/last`, async (req, res) => {
  const lastOperations = {
    lastOperationName,
  };
  res.sendJson(lastOperations);
});

app.get(`/operation/${OPERATION_NAME.MULTIPLICATION}`, async (req, res) => {
  const { firstOperand, secondOperand } = req.query;
  const multiplyResults = {
    firstOperand: Number(firstOperand),
    secondOperand: Number(secondOperand),
    total: Number(firstOperand) * Number(secondOperand),
  };
  addToHistory(multiplyResults, OPERATION_NAME.MULTIPLICATION);
  lastOperationName = OPERATION_NAME.MULTIPLICATION;
  totalMathOperations.multiplication += 1;
  totalMathOperations.total += 1;
  const multiplicationResult = res.sendWithHistory(multiplyResults);
  res.sendJson(multiplicationResult);
});

app.get(`/operation/last`, async (req, res) => {
  const lastOperations = {
    lastOperationName,
  };
  res.sendJson(lastOperations);
});

app.get(`/operation/information`, async (req, res) => {
  const { multiplication, summation, total } = totalMathOperations;
  const operationsInfo = {
    totalAmountOfOperation: total,
    multiplication,
    summation,
  };
  res.sendJson(operationsInfo);
});

app.get('/operation/history', async (req, res) => {
  const { sort } = req.query;
  const timeHistory = [];
  history.forEach(obj => {
    const changedObj = res.sendWithHistory(obj);
    timeHistory.push(changedObj);
  })
  const descOrderedArr = sortByTime(timeHistory);
  const historyInfo = {
    history: sort === 'DESC' ? descOrderedArr : timeHistory,
  };
  res.sendJson(historyInfo);
});


module.exports = app;
