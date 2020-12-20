const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
    healthCheck, 
    getOneImage, 
    getAllImages, 
    uploadImage, 
    deleteImage, 
    resizeImage
} = require('./../handlers/imageHandler');

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.get('/v1/ping', async (req, res) => {

    const healthCheckPing = await healthCheck();

    if (healthCheckPing == true) {
        res.status(200);
        res.send('All is well');
    } 

    // Future update: Add error checking/responses if healthCheck fails.
});

app.get('/v1/images', async (req, res) => {

    const images = await getAllImages();

    res.status(200);
    res.send(images);
});

app.get('/v1/images/:name', async (req, res) => {

    let fileName = req.params.name;

    const image = await getOneImage(fileName);

    if (image) {
        res.status(200);
        res.send(image);
    } else {
        res.status(404);
        res.send('Image object not found')
    }
    
});

app.delete('/v1/images/:name', async (req, res) => {

    let fileName = req.params.name;

    const deleteStatus = await deleteImage(fileName);

    if (deleteStatus.deletedCount == 1) {
        res.status(200);
        res.send('Image object deleted');
    } else {
        res.status(404);
        res.send('Image object not found');
    }

    // Future update: Adding Authentication when deleting an image
});

app.post('/v1/upload', async (req, res) => {

    let fileName = req.body.fileName ? req.body.fileName : undefined;
    let fileData = req.body.fileData ? req.body.fileData : undefined;
    
    if (fileName == undefined || fileData == undefined) {
        res.status(400);
        res.send('Some parameters are missing or invalid')
    } else {
        await uploadImage(fileName, fileData);

        const fetchImage = await getOneImage(fileName);
    
        res.status(201);
        res.send(fetchImage);
    }

    // Future update: Adding Authentication when uploading an image

});

app.get('/v1/resize/:name', async (req, res) => {
    let fileName = req.params.name;
    let width = req.query.width ? req.query.width : undefined;
    let height = req.query.height ? req.query.height : undefined;

    if (width == undefined || height == undefined) {
        res.status(400);
        res.send('Some parameters are missing or invalid');

    } else {

        const resizedImage = await resizeImage(fileName, height, width);

        if (resizedImage) {
            res.status(200);
            res.send(resizedImage);
        } else {
            res.status(404)
            res.send('Image object not found');
        }
    }

})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});

// the following line is only used for testing purposes
module.exports = app;