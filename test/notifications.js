import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.tYs-XsFksexcgSjke1dXoInEi_ZrgU6OKuQD_0tI-ew';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.qVzoEX0d1YVTokAnpylou8gtbE7a5aPWl-NEUkNO7sE';
const noToken = '';
const userWithNoNotificationsToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVyMkBlcnJuZC5jb20iLCJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsInVzZXJuYW1lIjoiY3VzdG9tZXIyIiwiaWF0IjoxNTYwNjg1Mjc4LCJleHAiOjY5OTk5OTk5OTh9.EV9N2PSOp8OY2-LaKHZUCdsNDz4UQQWEhjuUUrCuPeI';

describe('Errnd Notifications Test Suite', () => {
  // ==== Retrieve all user's notifications ==== //
  describe(" GET notifications/ - Retrieve all user's notifications", () => {
    it("should return status code 200 on retrieving all user's notifications", async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Notifications returned successfully');
    });

    it('should return status code 404 if a user has no notifications', async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications')
        .set('authorization', userWithNoNotificationsToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("You don't have any notifications yet");
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });
  });

  // ==== Retrieve one of user's notifications ==== //
  describe(" GET notifications/:notificationId - Retrieve one of user's notifications", () => {
    it("should return status code 200 on retrieving all user's notifications", async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications/1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Notification returned successfully');
    });

    it('should return status code 404 if a user has no notifications', async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications/1')
        .set('authorization', userWithNoNotificationsToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("You don't have any notifications yet");
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications/1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/notifications/1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });
  });

  // ==== Update user's notifications isread status ==== //
  describe(" PUT notifications/update -  Update user's notifications isread status", () => {
    it("should return status code 200 on updating user's notifications isread status", async () => {
      const res = await chai.request(app)
        .put('/api/v1/notifications/update')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("User's read status for these notifications updated successfully");
    });

    it('should return status code 404 if a user has no notifications', async () => {
      const res = await chai.request(app)
        .put('/api/v1/notifications/update')
        .set('authorization', userWithNoNotificationsToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('User have no notifications yet');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .put('/api/v1/notifications/update')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/notifications/update')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });
  });

  // ==== Delete a user's notification ==== //
  describe(" DELETE notifications/remove/notificationId -  Delete a user's notification", () => {
    it('should return status code 404 if a user has no notifications', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/notifications/remove/1')
        .set('authorization', userWithNoNotificationsToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Notification not found');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/notifications/remove/1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/notifications/remove/1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it("should return status code 200 on deleting a user's notification", async () => {
      const res = await chai.request(app)
        .delete('/api/v1/notifications/remove/1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Notification deleted successfully');
    });
  });
});
