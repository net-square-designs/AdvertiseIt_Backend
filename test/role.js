import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newUserRole = {
  role: 'customer'
};

const newInvalidUserRole = {
  role: 'invalidcustomer'
};

const noToken = '';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.tYs-XsFksexcgSjke1dXoInEi_ZrgU6OKuQD_0tI-ew';

describe('Errnd Role Test Suite', () => {
  // ==== Switch user role ==== //
  describe(' PUT role/:username - Switch user role', () => {
    it('should return status code 200 on a user who has switched his role successfully', async () => {
      const res = await chai.request(app)
        .put('/api/v1/role/testrunner1')
        .set('authorization', token)
        .send(newUserRole);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Users role switched succesfully');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/role/testrunner1')
        .set('authorization', noToken)
        .send(newUserRole);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 400 if role is not runner', async () => {
      const res = await chai.request(app)
        .put('/api/v1/role/testrunner1')
        .set('authorization', token)
        .send(newInvalidUserRole);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('role must be runner or customer');
    });

    it('should return status code 401 if a user want to switch another person role', async () => {
      const res = await chai.request(app)
        .put('/api/v1/role/testrunner2')
        .set('authorization', token)
        .send(newUserRole);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal("Unauthorized, you cannot switch another person's role");
    });

    it('should return status code 404 if user is not found', async () => {
      const res = await chai.request(app)
        .put('/api/v1/role/testrunner1zxbxbsnshshehrjrhrhjrhrjr7r757585848484383843847557');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's profile not found");
    });
  });
});
