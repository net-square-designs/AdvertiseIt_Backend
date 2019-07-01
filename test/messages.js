import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newMessage = {
  message: 'Hello Buddy, hiw us everything going',
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.tYs-XsFksexcgSjke1dXoInEi_ZrgU6OKuQD_0tI-ew';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.qVzoEX0d1YVTokAnpylou8gtbE7a5aPWl-NEUkNO7sE';
const noToken = '';
const userWithNoMessagesToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVyMkBlcnJuZC5jb20iLCJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsInVzZXJuYW1lIjoiY3VzdG9tZXIyIiwiaWF0IjoxNTYwNjg1Mjc4LCJleHAiOjY5OTk5OTk5OTh9.EV9N2PSOp8OY2-LaKHZUCdsNDz4UQQWEhjuUUrCuPeI';

describe('Errnd Messages Test Suite', () => {
  // ==== Send a message ==== //
  describe(' POST messages/send/:username - Send a user a message', () => {
    it('should return status code 201 on Send a user a message', async () => {
      const res = await chai.request(app)
        .post('/api/v1/messages/send/testrunner2')
        .set('authorization', token)
        .send(newMessage);
      res.status.should.equal(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Message sent successfully');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/messages/send/testrunner2')
        .set('authorization', invalidToken)
        .send(newMessage);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/messages/send/testrunner2')
        .set('authorization', noToken)
        .send(newMessage);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 400 if message field is left empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/messages/send/testrunner2')
        .set('authorization', token)
        .send({ nomessage: '' });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.message.should.equal('message field cannot be left blank');
    });
  });

  // ==== Retrieve all user's messages ==== //
  describe(" GET messages/ - Retrieve all user's messages", () => {
    it("should return status code 200 on retrieving all user's messages", async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("All user's messages returned successfully");
    });

    it('should return status code 404 if a user has no messages', async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages')
        .set('authorization', userWithNoMessagesToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('User have not received any messages yet');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });
  });

  // ==== Retrieve all a user's conversation with one other person ==== //
  describe(" GET messages/ - Retrieve all user's messages", () => {
    it("should return status code 200 on retrieving a user's conversation with one other person", async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages/testrunner2')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's conversation with this person returned successfully");
    });

    it("should return status code 404 on trying to retrieve a user's conversation with a person a user has not conversed with", async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages/customer1')
        .set('authorization', token);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('User have no conversation with this person');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages/testrunner2')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/messages/testrunner2')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });
  });

  // ==== Delete a user's conversation with another person ==== //
  describe(" DELETE messages/remove/:username - Delete a user's conversation with another person", () => {
    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove/testrunner1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove/testrunner1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it("should return status code 404 on user's conversation with another person not found", async () => {
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove/customer2')
        .set('authorization', userWithNoMessagesToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No conversation found');
    });

    it("should return status code 200 on deleting user's conversation with another person", async () => {
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove/testrunner2')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Conversation deleted successfully');
    });
  });

  // ==== Delete all user's conversation ==== //
  describe(" DELETE messages/remove - Delete all user's conversation", () => {
    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it("should return status code 404 on user's conversation with every person not found", async () => {
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove')
        .set('authorization', userWithNoMessagesToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No conversation found');
    });

    it("should return status code 200 on deleting user's conversation with another person", async () => {
      await chai.request(app)
        .post('/api/v1/messages/send/testrunner2')
        .set('authorization', token)
        .send(newMessage);
      const res = await chai.request(app)
        .delete('/api/v1/messages/remove')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('All Conversation deleted successfully');
    });
  });
});
