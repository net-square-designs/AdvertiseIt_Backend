import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newUserProfile = {
  firstName: 'Johnny',
  lastName: 'Doe',
  image: '',
  location: 'Lagos',
  bio: 'I am a sofware engineer and AI enthusiast',
  phone: '09099933444'
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.tYs-XsFksexcgSjke1dXoInEi_ZrgU6OKuQD_0tI-ew';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.qVzoEX0d1YVTokAnpylou8gtbE7a5aPWl-NEUkNO7sE';
const noToken = '';

describe('Errnd Profile Test Suite', () => {
  // ==== Create a user profile ==== //
  describe(' POST profile/:username - Create a user profile', () => {
    it('should return status code 200 on creating a new user profile', async () => {
      const res = await chai.request(app)
        .post('/api/v1/profile/testrunner1')
        .set('authorization', token)
        .send(newUserProfile);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Users profile created successfully');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/profile/testrunner1')
        .set('authorization', noToken)
        .send(newUserProfile);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if a user want to edit another person profile', async () => {
      const res = await chai.request(app)
        .post('/api/v1/profile/testrunner1990000')
        .set('authorization', token)
        .send(newUserProfile);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal("Unauthorized, you cannot edit another person's profile");
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/profile/testrunner1')
        .set('authorization', invalidToken)
        .send(newUserProfile);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });
  });

  // ==== View a user ==== //
  describe(' POST profile/:username - View a user', () => {
    it('should return status code 200 on returning a user', async () => {
      const res = await chai.request(app)
        .get('/api/v1/profile/testrunner1');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Users profile returned succesfully');
    });

    it('should return status code 404 if user is not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/profile/testrunner1zxbxbsnshshehrjrhrhjrhrjr7r757585848484383843847557');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's profile not found");
    });

    it('should return status code 200 on a user who has not updated their profile', async () => {
      const res = await chai.request(app)
        .get('/api/v1/profile/testrunner2');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Users profile returned successfully partially');
    });
  });
});
