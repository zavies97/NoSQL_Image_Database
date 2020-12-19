// Same as imageHandler.test.js, but for restapi (mock endpoint calls)

const chai = require('chai');
const server = require('./../../src/controllers/index');
const { expect } = require('chai');
const chaiHttp = require('chai-http');

// const should = chai.should();

const {dropDatabase} = require('../../src/handlers/imageHandler');
const image = './test/resources/imageExample.jpeg';

chai.use(chaiHttp);
describe('Rest Api tests', () => {
    before(async () => {
         dropDatabase();
    })

    after(async () => {
         dropDatabase();
    })

    it(`Healthcheck should get a 200 response from ping with message 'All is well'`, async () => {
        const res = await chai.request(server).get('/v1/ping');

        expect(res).to.have.status(200);
        expect(res.text).to.equal('All is well');
    })

    describe('Upload image', () => {

        it('should upload an image if the parameter/body is correct', async () => {
            const res = await chai.request(server)
                .post('/v1/upload')
                .send({
                    'fileName': 'testImageRest1',
                    'fileData': image
                });

            expect(res).to.have.status(201);
            expect(res.body.name).to.equal('testImageRest1');
            expect(res.body.height).to.equal(293);
            expect(res.body.width).to.equal(220);
        })

        it(`should throw a status 400 error and message 'Some parameters are missing or invalid' if no image file sent to request`, async () => {
            const res = await chai.request(server)
                .post('/v1/upload')
                .send({
                    'fileName': 'testImageRest1'
                });

            expect(res).to.have.status(400);
            expect(res.text).to.equal('Some parameters are missing or invalid')
        })

        it(`should throw a status 400 error and message 'Some parameters are missing or invalid' if no file name sent to request`, async () => {
            const res = await chai.request(server)
                .post('/v1/upload')
                .send({
                    'fileData': image
                });

            expect(res).to.have.status(400);
            expect(res.text).to.equal('Some parameters are missing or invalid')
        })

    })

    describe('Get a list of all images', () => {
        it('should get a list of all images (1 in db)', async () => {
            const res = await chai.request(server)
                .get('/v1/images');

            expect(res).to.have.status(200);
            expect(res.body).to.have.length(1);
        })

        it('should get a list of all images (more thna 1 in db)', async () => {
            await chai.request(server)
                .post('/v1/upload')
                .send({
                    'fileName': 'testImageRest2',
                    'fileData': image
                });

            const res = await chai.request(server)
                .get('/v1/images');

            expect(res).to.have.status(200);
            expect(res.body).to.have.length(2);
        })
    })

    describe('Get one image', () => {
        it('Should get an image if it is in the database', async () => {
            const res = await chai.request(server)
                .get('/v1/images/testImageRest2');
            
            expect(res).to.have.status(200);
            expect(res.body.name).to.equal('testImageRest2');
            expect(res.body.height).to.equal(293);
            expect(res.body.width).to.equal(220);
        })

        it(`should return a status 404 and error message 'Image object not found' if cant find image`, async() => {

            const res = await chai.request(server)
                .get('/v1/images/testImageRest6');
            
            expect(res).to.have.status(404);
            expect(res.text).to.equal('Image object not found');
        })
    })

    describe('Resize images', () => {
        it('should resize an image if it is found in the database', async () => {
            const res = await chai.request(server)
                .get('/v1/resize/testImageRest2')
                .query({height: 765, width: 567});

            expect(res).to.have.status(200);
            expect(res.body.name).to.equal('testImageRest2');
            expect(res.body.height).to.equal('765');
            expect(res.body.width).to.equal('567');
        })

        it(`should return a status 400 and error message 'Some parameters are missing or invalid' if no width sent`, async () => {
            const res = await chai.request(server)
                .get('/v1/resize/testImageRest2')
                .query({height: 765});

            expect(res).to.have.status(400)
            expect(res.text).to.equal('Some parameters are missing or invalid');
        })

        it(`should return a status 400 and error message 'Some parameters are missing or invalid' if no height sent`, async () => {
            const res = await chai.request(server)
                .get('/v1/resize/testImageRest2')
                .query({width: 765});

            expect(res).to.have.status(400);
            expect(res.text).to.equal('Some parameters are missing or invalid');
        })

        it(`should return a status 404 and error message 'Image object not found' if image not found`, async () => {
            const res = await chai.request(server)
                .get('/v1/resize/testImageRest3')
                .query({width: 765, height: 234});

            expect(res).to.have.status(404)
            expect(res.text).to.equal('Image object not found');
        })
    })

    describe('Delete image', () => {
        it('should delete an image if it is found in the database', async () => {
            const res = await chai.request(server)
                .delete('/v1/images/testImageRest1');

            expect(res).to.have.status(200);
            expect(res.text).to.equal('Image object deleted')
        })

        it('should not delete an image if it is not found in the database', async () => {
            const res = await chai.request(server)
                .delete('/v1/images/testImageRest3');

            expect(res).to.have.status(404);
            expect(res.text).to.equal('Image object not found')
        })
    })
})

