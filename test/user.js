import chai from 'chai';
import dotenv from 'dotenv';
import chaiHttp from 'chai-http';
import app from '../index';

dotenv.config();

chai.use(chaiHttp);
chai.should();

const newUserData = {
  role: 'runner',
  password: 'newTestUserPassword@@@!!!444',
  email: 'newtestuseremail@errnd.com',
  username: 'newtestuser',
};

const userLoginData = {
  email: 'testrunner1@errnd.com',
  username: 'testrunner1',
  password: 'errndPassword1234567890@@@@@@###!!!',
};

describe('Errnd User Test Suite', () => {
  // ==== Sign up a user ==== //
  describe(' POST auth/signup - Sign up a new user', () => {
    it('should return status code 201 on signing up a new user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(newUserData);
      res.status.should.equal(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('User created successfully');
    });

    it('should return status code 409 if user already exists', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(Object.assign(newUserData, {
          email: 'testrunner1@errnd.com',
        }));
      res.status.should.equal(409);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('User already exists, please sign up a new user');
    });

    it('should return status code 400 if email field is left empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(Object.assign(newUserData, {
          email: '',
        }));
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.email.should.equal('email must be filled');
    });

    it('should return status code 400 if email field is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(Object.assign(newUserData, {
          email: 'invalidemailcom',
        }));
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.email.should.equal('Invalid email');
    });

    it('should return status code 400 if role is not runner', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(Object.assign(newUserData, {
          role: 'invalidrole',
        }));
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
    });
  });

  // ==== Log in a user ==== //
  describe(' POST auth/login - Log in a new user', () => {
    it('should return status code 200 on logging in a user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(userLoginData);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Welcome testrunner1');
    });

    it('should return status code 404 if user is not found', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(Object.assign(userLoginData, {
          email: 'invalidusererrnd@errnd.com',
          username: 'invalidusererrndusername',
        }));
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('User not found, please register user onto the platform');
    });

    it('should return status code 400 if email field is left empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(Object.assign(userLoginData, {
          email: '',
          username: '',
        }));
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.emailOrUsername.should.equal('email or username must be filled');
    });

    it('should return status code 400 if email field is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/login')
        .send(Object.assign(userLoginData, {
          email: 'invalidemailcom',
        }));
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.email.should.equal('Invalid email');
    });
  });
});
