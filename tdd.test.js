const faker = require('faker');
const axios = require('axios');
const API_URL = 'http://localhost:3000';


const instance = axios.create({
    baseURL: API_URL,
    timeout: 1000,
});

const sortedArrayByAlph = (arr = []) => ([...arr, 'timeOfResponse'].sort());

const OPERATION_NAME = {
  MULTIPLICATION: 'MULTIPLICATION',
  SUMMATION: 'SUMMATION',
};

const firstSumOperand = faker.random.number();
const secondSumOperand = faker.random.number();

const firstMultOperand = faker.random.number();
const secondMultOperand = faker.random.number();

test('get server informatom', async () => {
  const response = await instance.get('/operation/information').catch(e => e);

  expect(response.status).toBe(200);

  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(['version', 'uptime']));

  expect(response.data.version).toBe('0.0.1');
  expect(typeof response.data.uptime).toBe('number');

  expect(typeof response.data.timeOfResponse).toBe('number');
});

test('sum', async () => {


  const response = await instance
    .get(`/${OPERATION_NAME.SUMMATION.toLowerCase()}?firstOperand=${firstSumOperand}&secondOperand=${secondSumOperand}`)
    .catch(e => e);

  expect(response.status).toBe(200);
  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(['firstOperand', 'secondOperand', 'total']));

  expect(response.data.firstOperand).toBe(firstOperand);
  expect(response.data.secondOperand).toBe(secondOperand);
  expect(response.data.sum).toBe(firstOperand + secondOperand);

  expect(typeof response.data.timeOfResponse).toBe('number');
});

test('get last operation', async () => {
  const response = await instance.get(`/operation/last`).catch(e => e);

  expect(response.status).toBe(200);
  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(['lastOperationName']));

  expect(response.data.lastOperationName).toBe(OPERATION_NAME.SUMMATION);

});

test('multiplication', async () => {

  const response = await instance
    .get(`/operation/${OPERATION_NAME.MULTIPLICATION.toLowerCase()}?firstOperand=${firstMultOperand}&secondOperand=${secondMultOperand}`)
    .catch(e => e);

  expect(response.status).toBe(200);
  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(['firstOperand', 'secondOperand', 'total']));

  expect(response.data.firstOperand).toBe(firstOperand);
  expect(response.data.secondOperand).toBe(secondOperand);
  expect(response.data.mult).toBe(firstOperand * secondOperand);

  expect(typeof response.data.timeOfResponse).toBe('number');
});

test('get last operation', async () => {
  const response = await instance.get(`/operation/last`).catch(e => e);

  expect(response.status).toBe(200);
  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(['lastOperationName']));

  expect(response.data.lastOperationName).toBe(OPERATION_NAME.MULTIPLICATION.toLowerCase());

});

test('total operation information', async () => {
  const response = await instance.get(`/operation/information`).catch(e => e);

  expect(response.status).toBe(200);
  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(
    [
      'totalAmountOfOperation', 
      OPERATION_NAME.MULTIPLICATION.toLowerCase(),
      OPERATION_NAME.SUMMATION.toLowerCase(),
    ]
  ));

  expect(response.data.totalAmountOfOperation).toBe(2);
  expect(response.data[OPERATION_NAME.MULTIPLICATION.toLowerCase()]).toBe(1);
  expect(response.data[OPERATION_NAME.SUMMATION.toLowerCase()]).toBe(1);

});

test('total operation information DESC', async () => {
  const response = await instance.get(`/operation/history?sort=DESC`).catch(e => e);

  expect(response.status).toBe(200);
  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(['history']));

  expect(Array.isArray(response.data.history)).toBeTruthy();


  expect(response.data.history).toHaveLength(2);

  const [firstOperation, secondOperation] = response.data.history;

  expect(Object.keys(firstOperation).sort()).toEqual(sortedArrayByAlph(['operationName', 'firstOperand', 'secondOperand', 'total']));
  expect(Object.keys(secondOperation).sort()).toEqual(sortedArrayByAlph(['operationName', 'firstOperand', 'secondOperand', 'total']));

  expect(firstOperation.operationName).toBe(OPERATION_NAME.MULTIPLICATION);
  expect(firstOperation.firstOperand).toBe(firstMultOperand);
  expect(firstOperation.firstOpesecondOperandrand).toBe(secondMultOperand);

  expect(firstOperation.total).toBe(secondMultOperand * firstMultOperand);

  expect(secondOperation.operationName).toBe(OPERATION_NAME.SUMMATION);
  expect(secondOperation.firstOperand).toBe(firstSumOperand);
  expect(secondOperation.firstOpesecondOperandrand).toBe(secondSumOperand);

  expect(secondOperation.total).toBe(secondSumOperand + firstSumOperand);

});

test('total operation information ASC', async () => {
  const response = await instance.get(`/operation/history?sort=ASC`).catch(e => e);

  expect(response.status).toBe(200);
  expect(Object.keys(response.data).sort()).toEqual(sortedArrayByAlph(['history']));

  expect(Array.isArray(response.data.history)).toBeTruthy();


  expect(response.data.history).toHaveLength(2);

  const [firstOperation, secondOperation] = response.data.history;

  expect(Object.keys(firstOperation).sort()).toEqual(sortedArrayByAlph(['operationName', 'firstOperand', 'secondOperand', 'total']));
  expect(Object.keys(secondOperation).sort()).toEqual(sortedArrayByAlph(['operationName', 'firstOperand', 'secondOperand', 'total']));

  expect(secondOperation.operationName).toBe(OPERATION_NAME.MULTIPLICATION);
  expect(secondOperation.firstOperand).toBe(firstMultOperand);
  expect(secondOperation.firstOpesecondOperandrand).toBe(secondMultOperand);

  expect(secondOperation.total).toBe(secondMultOperand * firstMultOperand);

  expect(firstOperation.operationName).toBe(OPERATION_NAME.SUMMATION);
  expect(firstOperation.firstOperand).toBe(firstSumOperand);
  expect(firstOperation.firstOpesecondOperandrand).toBe(secondSumOperand);

  expect(firstOperation.total).toBe(secondSumOperand + firstSumOperand);

});