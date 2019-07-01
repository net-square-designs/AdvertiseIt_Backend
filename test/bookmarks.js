import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newBookmark = {
  title: 'Develop your web app',
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.tYs-XsFksexcgSjke1dXoInEi_ZrgU6OKuQD_0tI-ew';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.qVzoEX0d1YVTokAnpylou8gtbE7a5aPWl-NEUkNO7sE';
const noToken = '';
const customerWithNoBookmarkToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVyMkBlcnJuZC5jb20iLCJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsInVzZXJuYW1lIjoiY3VzdG9tZXIyIiwiaWF0IjoxNTYwNjg1Mjc4LCJleHAiOjY5OTk5OTk5OTh9.EV9N2PSOp8OY2-LaKHZUCdsNDz4UQQWEhjuUUrCuPeI';

describe('Errnd Bookmarks Test Suite', () => {
  // ==== Create a new bookmark ==== //
  describe(' POST bookmarks/create - Create a new bookmark', () => {
    it('should return status code 201 on creating a new bookmark', async () => {
      const res = await chai.request(app)
        .post('/api/v1/bookmarks/create/1')
        .set('authorization', token)
        .send(newBookmark);
      res.status.should.equal(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Services bookmarked successfully');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/bookmarks/create/1')
        .set('authorization', invalidToken)
        .send(newBookmark);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/bookmarks/create/1')
        .set('authorization', noToken)
        .send(newBookmark);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 404 if service to be bookmarked does not exists', async () => {
      const res = await chai.request(app)
        .post('/api/v1/bookmarks/create/0')
        .set('authorization', token)
        .send(newBookmark);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Service not found');
    });
  });

  // ==== Retrieve all bookmarks by a user ==== //
  describe(' GET bookmarks/ - Retrieve all bookmarks by a user', () => {
    it('should return status code 200 it can retrieve all bookmarks by a user', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Bookmarked services returned successfully');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 404 on bookmark not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks')
        .set('authorization', customerWithNoBookmarkToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No bookmarked services found');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });
  });

  // ==== Search for bookmarks ==== //
  describe(' GET bookmarks/search?query=Develop your web app - Retrieve all bookmarks matching specified search params', () => {
    it('should return status code 200 on retrieving all bookmarks matching specified search params', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks/search?query=Develop your web app')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Bookmarked services returned successfully');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks/search?query=Develop your web app')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 404 on bookmark not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks/search?query=xvvvvvvvzzzzzzzzqqqqqqqqq')
        .set('authorization', token);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No bookmarked services found');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks/search?query=Develop your web app')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 400 if invalid url is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/bookmarks/search?queryyyyyyyeyeyehsb=Develop your web app')
        .set('authorization', token);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Invalid url, url should be like /search?query=');
    });
  });

  // ==== Delete an existing bookmark ==== //
  describe(' DELETE bookmarks/remove/1 - Delete an existing bookmark', () => {
    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/bookmarks/remove/1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/bookmarks/remove/1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 404 on bookmark not found', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/bookmarks/remove/0')
        .set('authorization', token);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No bookmarked services found');
    });

    it('should return status code 200 on deleting an existing bookmark', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/bookmarks/remove/1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Bookmarked services deleted successfully');
    });
  });
});
