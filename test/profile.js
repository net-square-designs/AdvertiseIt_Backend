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
  phone: '09099933444',
  storeName: 'JohnDoeStores',
  bank: {
    name: 'UBA',
    accountNumber: 2093939338,
    accountName: 'John DoeMerchant1'
  },
  website: ''
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcmNoYW50MUBhZHZlcnRpc2VpdC5jb20iLCJ1c2VySWQiOjMsInJvbGUiOiJjdXN0b21lci1tZXJjaGFudCIsInVzZXJuYW1lIjoibWVyY2hhbnQxIiwicHJvZHVjdHNvZmludGVyZXN0IjpbInBob25lcyIsInNvZnR3YXJlIl0sImlhdCI6MTU2MzM5MzAwNywiZXhwIjo1MDAwMDAwMDAwfQ.3tn5cyh_z5qSqnbpG1gzLy3KL-10laeA--wnycNTGYU';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcmNoYW50MUBhZHZlcnRpc2VpdC5jb20iLCJ1c2VySWQiOjMsInJvbGUiOiJjdXN0b21lci1tZXJjaGFudCIsInVzZXJuYW1lIjoibWVyY2hhbnQxIiwicHJvZHVjdHNvZmludGVyZXN0IjpbInBob25lcyIsInNvZnR3YXJlIl0sImlhdCI6MTU2MzM5MzAwNywiZXhwIjo1MDAwMDAwMDAwfQ.nm7f1-QCtBqqhewJTQpOO6HKCi4pv5iJKt4OZd74Xbo';
const noToken = '';

describe('Errnd Profile Test Suite', () => {
  // ==== Create a user profile ==== //
  describe(' POST profile/:username - Create a user profile', () => {
    it('should return status code 201 on creating a new user profile', async () => {
      const res = await chai.request(app)
        .post('/api/v1/profile/merchant1')
        .set('authorization', token)
        .send(newUserProfile);
      res.status.should.equal(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's profile created successfully");
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/profile/merchant1')
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
        .post('/api/v1/profile/merchant0')
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
        .post('/api/v1/profile/merchant1')
        .set('authorization', invalidToken)
        .send(newUserProfile);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if bank is not an object', async () => {
      const res = await chai.request(app)
        .post('/api/v1/profile/merchant1')
        .set('authorization', token)
        .send({
          firstName: 'Johnny',
          lastName: 'Doe',
          image: '',
          location: 'Lagos',
          bio: 'I am a sofware engineer and AI enthusiast',
          phone: '09099933444',
          storeName: 'JohnDoeStores',
          bank: 20,
          website: ''
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Bank details must be an object');
    });
  });

  // ==== View a user ==== //
  describe(' POST profile/:username - View a user', () => {
    it('should return status code 200 on returning a user', async () => {
      const res = await chai.request(app)
        .get('/api/v1/profile/customer2');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's profile returned succesfully");
    });

    it('should return status code 404 if user is not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/profile/merchant0');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('User not found');
    });

    it('should return status code 206 on a user who has not updated their profile', async () => {
      const res = await chai.request(app)
        .get('/api/v1/profile/influencer1');
      res.status.should.equal(206);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's profile returned successfully partially");
    });
  });
});
