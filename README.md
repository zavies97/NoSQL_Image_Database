# NoSQL_Image_Database

Application to upload images, get a list of all images, delete images and resize images.

All images are stored in a MongoDB database stored in a docker container.

* Linter - ESLint (Installed from the Visual Studio extensions list)
* BackEnd - NodeJs
* Database - Docker containerized MongoDb
* Testing framework - Mocha and Chai

Application data and endpoints were created in line with the provided swagger.yml file.

## Running the application

### Installation

To install everything necessary for the code to run, run the following command in the application root

```
npm install
```

### Starting the database

To intialise the database, navigate into the 'mongoDb Instance' folder and run the following command.

```
docker-compose up
```

NB: After running this command, the created database will contain no data

### Starting the backend application

To start the REST api, run the following command in the application root

```
npm run start
```

NB: This is an initial draft of how the application will run. Future updates ill include creating a docker container to host and run the REST api

## Endpoints

The following describes how to call each endpoint, the necessary data required and the expected responses

As a pre requisitee, as stated in the 'Running the application' section, the database and server must be initialised before making any of the following calls.

### Health check

This endpoint tests whether the database is up and running.

Path: 'localhost:8080/v1/ping'
Type: GET

Expected response: 
* Status code: 200
* Response text: 'All is well'

### Retrieve a list of all images

This endpoint retrieves a list of all images in the database and their necessary data.

Path: 'localhost:8080//v1/images'
Type: GET

Expected response
* Status code: 200
* Example of response object: 
```
    {
        [
            {
                "_id": "example id",
                "name": "example name",
                "height": 0,
                "width": 0,
                "url": "example url here"
            }
        ]
    }
```

### Retrieve one image (by name)

This endpoint retrieves one image that has been added to the database. The image is found using a name variable parsed as a path parameter. It is assumed that the image name would be unique.

Path: 'localhost:8080//v1/images/:name', where :name is replaced with the image name
Type: GET

Expected success response:
* Response status: 200
* Example of response object: 
```
    {
        "_id": "example id",
        "name": "example name",
        "height": 0,
        "width": 0,
        "url": "example url here"
    } 
```

Expected fail response if image not found:
* Response status: 404
* Response text: 'Image object not found'

### Delete one image (by name)

This endpoint deletes a specified image if it can find it in the database. The image is found using a name variable parsed as a path parameter. It is assumed that the image name would be unique.

Path: 'localhost:8080//v1/images/:name', where :name is replaced with the image name
Type: DELETE

Expected success response:
* Response status: 200
* Response text: 'Image object deleted'

Expected fail response if image not found:
* Response status: 404
* Response text: 'Image object not found'

### Upload an image to the database

This endpoint adds an image to the database given an image file and a file name. Some examples of accepted image file types include JPEG, JPG and PNG files.

Path: 'localhost:8080//v1/upload'
Type: POST
Example body: 
```
    {
        fileName: 'Example image name',
        fileData: 'Example image file to be added'
    }
```

Expected success response:
* Response status: 200
* Example response object:
```
    {
        "_id": "example id",
        "name": "example name",
        "height": 0,
        "width": 0,
        "url": "example url here"
    } 
```

Expected failure response if parameters are missing or invalid:
* Response status: 400
* Response text: 'Some parameters are missing or invalid'

### Resize an image

This endpoint retrieves and image and resizes it with the height and width specified by the user. The image is found using a name variable parsed as a path parameter. It is assumed that the image name would be unique.

NB: The image is only retrieved from the database and resized for the user. The resized image is not saved in the database.

Path: 'localhost:8080//v1/resize/:name?height=0&width=0', where :name is replaced with the image name, height is replaced with the desired height and width is replaced with the desired width
Type: GET

Expected success response:
* Response status: 200
* Example response object:
```
    {
        "_id": "example id",
        "name": "example name",
        "height": 0,
        "width": 0,
        "url": "example url here"
    }
```

Expected fail response if parameters missing or invalid:
* Response status: 400
* Response text: 'Some parameters are missing or invalid'

Expected fail response if image not found:
* Response status: 404
* Response text: 'Image object not found'

## Running the tests

To run the unit tests, run the following command in the application root

```
npm run test
```

NB: The database MUST be intiialised before these tests begin, however the REST api does not have to be initialised

## Assumptions

There are some assumptions associated with this project.

* It is assumed that this application would deploy alongside a real mongoDb instance. Local instance is created in the test environment in order to mimic production conditions
* It is assumed that the name of an image will be unique.

## Caviats

* As the program currently uses a test docker database, the database data is cleared after the unit tests are run.

## Future updates

* Adding a front end application to connect to the database
* Authorization levels for running certain api endpoints, such as deleting an image from the database 
* Adding a docker container for the main application
* More image details stored (such as greyscaling, rotation etc)
* Updating an image in the database when resizing. This could also be stored as a new image in the database, with the users requested sizes
* Auto incrementing id. This would allow for searching by ids that are easy to read as opposed to the mongoDb default ids instead of assuming that names would be unique
* Accomodating for a failing health check (if the database cannot be reached, an error should occur)