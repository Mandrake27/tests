const axios = require('axios');
const API_URL = 'http://localhost:3000';

const instance = axios.create({
    baseURL: API_URL,
    timeout: 1000,
});

(async () => {
    const responce = await instance.get('/information');
    console.log(responce);
})();

