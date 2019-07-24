import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newUserRole = {
  role: 'customer-merchant'
};

const newInvalidUserRole = {
  role: 'invalidcustomer'
};

const noToken = '';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZmx1ZW5jZXIxQGFkdmVydGlzZWl0LmNvbSIsInVzZXJJZCI6Mywicm9sZSI6ImluZmx1ZW5jZXIiLCJ1c2VybmFtZSI6ImluZmx1ZW5jZXIxIiwiaWF0IjoxNTU5MjQ5MDg5LCJleHAiOjE5OTk5OTk5OTl9.meHA1DviWgMc2EPk1kjTK6z-26mwy-nhMYu8RWMRFBM';

describe('AdvertiseIt Role Test Suite', () => {
  // ==== Switch user role ==== //
  describe(' PUT role/:username - Switch user role', () => {
    it('should return status code 200 on a user who has switched his role successfully', async () => {
      const res = await chai.request(app)
        .put('/api/v1/roles/influencer1')
        .set('authorization', token)
        .send(newUserRole);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's role switched successfully");
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/roles/influencer1')
        .set('authorization', noToken)
        .send(newUserRole);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 400 if role is not customer-merchant', async () => {
      const res = await chai.request(app)
        .put('/api/v1/roles/influencer1')
        .set('authorization', token)
        .send(newInvalidUserRole);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('role must be customer-merchant');
    });

    it('should return status code 401 if a user want to switch another person role', async () => {
      const res = await chai.request(app)
        .put('/api/v1/roles/customer2')
        .set('authorization', token)
        .send(newUserRole);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal("Unauthorized, you cannot switch another person's role");
    });
  });
});
