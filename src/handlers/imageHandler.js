const {MongoClient} = require('mongodb');

let dbName = process.env.MONGO_INITDB_DATABASE;
let dbUser = process.env.MONGO_INITDB_ROOT_USERNAME;
let dbPassword = process.env.MONGO_INITDB_ROOT_PASSWORD;

// functions will be here

// should be 6 of them:

/* - check db up
   - get all images
   - add an image
   - get one image
   - delete one image
   - get and resize an image (DON'T UPDATE)

*/

// also add drop database here for testing puproses?

module.exports = {
    // functions to export here
}