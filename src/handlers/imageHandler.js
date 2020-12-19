const {MongoClient} = require('mongodb');
const sizeOf = require('image-size');

let dbName = process.env.MONGO_INITDB_DATABASE ? process.env.MONGO_INITDB_DATABASE : 'testdb';
let dbUser = process.env.MONGO_INITDB_ROOT_USERNAME ? process.env.MONGO_INITDB_ROOT_USERNAME : 'testuser';
let dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD ? process.env.MONGO_INITDB_ROOT_PASSWORD : 'testpassword';

// The following function is primarily used for testing, just so the db tests can run solely based on a fresh database. 
// As there is only one database being used currently, the original database contents is removed upon starting the tests
const dropDatabase = async () => {
    const mongoDbUrl = 'mongodb://' + dbUser + ':' + dbPassword + '@127.0.0.1:27017/';

    let connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true
    });

    let db = await connection.db(dbName);

    db.dropDatabase();

    await connection.close();
}

const uploadImage = async(name, file) => {
    const mongoDbUrl = 'mongodb://' + dbUser + ':' + dbPassword + '@127.0.0.1:27017/';

    let connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true
    });

    let db = await connection.db(dbName);

    const imageFiles = db.collection('imagefiles')

    let dimensions = sizeOf(file);

    const imageUrl = 'http://example.com/' + name + '-' + dimensions.width + 'x' + dimensions.height + '.png';

    const objectToSend = {
        name: name,
        width: dimensions.width,
        height: dimensions.height,
        url: imageUrl
    }

    await imageFiles.insertOne(objectToSend);

    await connection.close();

}

const getOneImage = async(name) => {
    const mongoDbUrl = 'mongodb://' + dbUser + ':' + dbPassword + '@127.0.0.1:27017/';

    let connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true
    });

    let db = await connection.db(dbName);

    const imageFiles = db.collection('imagefiles')

    const foundImage = await imageFiles.findOne({
        name: name
    });

    await connection.close();

    return foundImage;
}

const getAllImages = async() => {
    const mongoDbUrl = 'mongodb://' + dbUser + ':' + dbPassword + '@127.0.0.1:27017/';

    let connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true
    });

    let db = await connection.db(dbName);

    const imageFiles = db.collection('imagefiles')

    const allImages = await imageFiles.find().toArray();

    await connection.close();

    return allImages;
}

const resizeImage = async(name, height, width) => {
    const mongoDbUrl = 'mongodb://' + dbUser + ':' + dbPassword + '@127.0.0.1:27017/';

    let connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true
    });

    let db = await connection.db(dbName);

    const imageFiles = db.collection('imagefiles')

    const foundImage = await imageFiles.findOne({
        name: name
    });

    await connection.close();
    
    if (foundImage) {
        foundImage.width = width;
        foundImage.height = height;
    }

    return foundImage;

}

const deleteImage = async(name) => {
    const mongoDbUrl = 'mongodb://' + dbUser + ':' + dbPassword + '@127.0.0.1:27017/';

    let connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true
    });

    let db = await connection.db(dbName);

    const imageFiles = db.collection('imagefiles');

    const deleted = await imageFiles.deleteOne({name: name});

    await connection.close();

    return deleted;
}

const healthCheck = async() => {
    const mongoDbUrl = 'mongodb://' + dbUser + ':' + dbPassword + '@127.0.0.1:27017/';

    let connection = await MongoClient.connect(mongoDbUrl, {
        useNewUrlParser: true
    });

    let db = await connection.db(dbName);

    const status = db.slaveOk;

    return status;

}

module.exports = {
    dropDatabase,
    uploadImage,
    getOneImage,
    getAllImages,
    resizeImage,
    deleteImage,
    healthCheck
}