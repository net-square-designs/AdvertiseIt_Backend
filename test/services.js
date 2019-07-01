import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newUserService = {
  category: 'Computer Science',
  subcategory: 'Web Development',
  title: 'Develop your web app',
  description: 'I can develop your web app using express,react and react native following TDD and Agile',
  price: 2000000,
  days: 3,
  media: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
  location: 'Lagos'
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.tYs-XsFksexcgSjke1dXoInEi_ZrgU6OKuQD_0tI-ew';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.qVzoEX0d1YVTokAnpylou8gtbE7a5aPWl-NEUkNO7sE';
const noToken = '';

describe('Errnd Services Test Suite', () => {
  // ==== Create a new service ==== //
  describe(' POST services/:username - Create a new service', () => {
    it('should return status code 201 on creating a new service', async () => {
      const res = await chai.request(app)
        .post('/api/v1/services/testrunner1')
        .set('authorization', token)
        .send(newUserService);
      res.status.should.equal(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Service created successfully');
    });

    it('should return status code 401 if a user want to create a service on behalf of another user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/services/testrunner1990000')
        .set('authorization', token)
        .send(newUserService);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, you cannot create a service on behalf of another user');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/services/testrunner1')
        .set('authorization', invalidToken)
        .send(newUserService);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/services/testrunner1')
        .set('authorization', noToken)
        .send(newUserService);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 400 if category field is left empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/services/testrunner1')
        .set('authorization', token)
        .send(Object.assign(newUserService, {
          category: '',
        }));
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.category.should.equal('category must be filled');
    });
  });

  // ==== Update an existing service ==== //
  describe(' PUT services/:username/update/:serviceId - Update an existing service', () => {
    it('should return status code 200 on updating an existing service', async () => {
      const res = await chai.request(app)
        .put('/api/v1/services/testrunner1/update/1')
        .set('authorization', token)
        .send(newUserService);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Service updated successfully');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/services/testrunner1/update/1')
        .set('authorization', noToken)
        .send(newUserService);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if a user want to update a service on behalf of another user', async () => {
      const res = await chai.request(app)
        .put('/api/v1/services/testrunner133444/update/1')
        .set('authorization', token)
        .send(newUserService);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, you cannot update a service on behalf of another user');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .put('/api/v1/services/testrunner1/update/1')
        .set('authorization', invalidToken)
        .send(newUserService);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });
  });

  // ==== Retrieve all services ==== //
  describe(' GET services/ - Retrieve all services', () => {
    it('should return status code 200 on retrieving all services', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('All runners services returned successfully');
    });
  });

  // ==== Retrieve a specific runner services ==== //
  describe(' GET services/:username/:serviceId - Retrieve a specific runner services', () => {
    it('should return status code 200 on retrieving a specific runner services', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services/testrunner1/1');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Specific runner services returned successfully');
    });

    it('should return status code 404 on runner not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services/testrunner18388399390011123242349483989434/1');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Runner not found');
    });
  });

  // ==== Retrieve all services by a runner ==== //
  describe(' GET services/:username - Retrieve all services by a runner', () => {
    it('should return status code 200 on retrieving all services by a runner', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services/testrunner1');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('All runner services returned successfully');
    });

    it('should return status code 404 on runner not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services/testrunner1838839939001112324234948398943467');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Runner not found');
    });
  });

  // ==== Search for services ==== //
  describe(' GET services/search?query=Computer Science - Retrieve all services matching specified search params', () => {
    it('should return status code 200 on retrieving all services matching specified search params', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services/search?query=Computer Science');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Searched services returned successfully');
    });

    it('should return status code 404 on no services matching specified search params', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services/search?query=nmmmdmkrkrkrkememekekmemeedsksksmdjfjkftjkf394944848848usnsndsnn');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No services matching the searched parameter');
    });

    it('should return status code 400 if invalid url is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/services/search?queryyyyyyyeyeyehsb=Computer Science');
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Invalid url, url should be like /search?query=');
    });
  });
});
