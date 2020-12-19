const sizeOf = require('image-size');
const image = './test/resources/imageExample.jpeg';
const image2 = './test/resources/imageExample2.jpg';
const {
    dropDatabase, 
    uploadImage, 
    getOneImage, 
    getAllImages, 
    resizeImage, 
    deleteImage, 
    healthCheck
} = require('../../src/handlers/imageHandler');

const expect = require('chai').expect;

describe('Image database calls', () => {

    before(async () => {
        dropDatabase();
    })

    after(async () => {
        dropDatabase();
    })

    it('should insert a new image', async () => {
        await uploadImage('testImage', image);

        const dimensions = sizeOf(image);

        const retrievedImage = await getOneImage('testImage');

        expect(retrievedImage.name).to.equal('testImage');
        expect(dimensions.height).to.equal(retrievedImage.height);
        expect(dimensions.width).to.equal(retrievedImage.width);
    })

    it('should get a pre existing image', async () => {
        const dimensions = sizeOf(image);

        const retrievedImage = await getOneImage('testImage');

        expect(retrievedImage.name).to.equal('testImage');
        expect(dimensions.height).to.equal(retrievedImage.height);
        expect(dimensions.width).to.equal(retrievedImage.width);
    })

    it('should get all images from the database', async () => {
        await uploadImage('testImage2', image2);

        const retrievedImages = await getAllImages();

        expect(retrievedImages).to.have.length(2);
        
    })

    it('should be able to resize a retrieved image (this does not update the database data)', async() => {
        const retrievedImage = await resizeImage('testImage', 500, 624);

        expect(retrievedImage.width).to.equal(624);
        expect(retrievedImage.height).to.equal(500);
    })

    it("should delete an image and throw 'Image object not found' error when trying to retrieve deleted image", async() => {
        const deleted = await deleteImage('testImage2');

        const retrievedImages = await getOneImage('testImage2');

        expect(deleted.deletedCount).to.equal(1);
        expect(retrievedImages).to.equal(null);
    })

    it("should not delete an image if image doesnt exist", async() => {
        const deleted = await deleteImage('testImage3');

        expect(deleted.deletedCount).to.equal(0);
    })


    it('should check the db status', async() => {
        const status = await healthCheck();

        expect(status).to.equal(true);
    })
})