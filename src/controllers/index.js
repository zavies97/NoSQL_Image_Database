const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const ads = [
    {title: 'Hello World'}
];

const ads2 = [
    {title: 'Hello World for a second time'}
];

const ads3 = [
    {title: 'Hello World for a third time'}
];

const ads4 = [
    {title: 'Hello World for a fourth time'}
];

const ads5 = [
    {title: 'Hello World for a fifth time'}
];

const ads6 = [
    {title: 'Hello World for a sixth time'}
];

app.use(bodyParser.json());

app.use(cors());

app.get('/v1/ping', (req, res) => {
    res.send(ads);
    // response 200 - All is well
});

app.get('/v1/images', (req, res) => {
    res.send(ads2);
    // response 200 - List of Image objects
});

app.get('/v1/images/:id', (req, res) => {
    res.send(ads3);
    // response 200 - Image object
    // response 404 - Image object not found
});

app.delete('/v1/images/:id', (req, res) => {
    res.send(ads4);
    // response 200 - Image object deleted
    // response 401 - Authentication information is missing or invalid
    // response 404 - Image object not found
});

app.post('/v1/upload', (req, res) => {
    res.send(ads5);
    // parameters - fileName + fileData
    // response 201 - Image object
    // response 400 - Some parameters are missing or invalid
    // response 401 - Authentication information is missing or invalid
});

app.get('/v1/resize/:id', (req, res) => {
    res.send(ads6);
    // parameters - id (in path) + width + height
    // response 200 - Image object
    // response 400 - Some parameters are missing or invalid
    // response 404 - Image object not found
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});