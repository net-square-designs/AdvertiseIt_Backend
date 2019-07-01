import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newOrder = {
  category: 'Phones',
  title: 'Repair Phone',
  description: 'I want you to repair my iphone screen',
  budget: 2500,
  duedate: '2019-07-04',
  deliverylocation: 'Lagos',
  quantity: 1
};
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVyMUBlcnJuZC5jb20iLCJ1c2VySWQiOjMsInJvbGUiOiJjdXN0b21lciIsInVzZXJuYW1lIjoiY3VzdG9tZXIxIiwiaWF0IjoxNTU5MjQ5MDg5LCJleHAiOjE5OTk5OTk5OTl9.TCK2kEfVcIKIHUWK4SI1DTBA1CuXhUcVD3IR3K78KJk';
const runnerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.tYs-XsFksexcgSjke1dXoInEi_ZrgU6OKuQD_0tI-ew';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoiY3VzdG9tZXIxIiwiaWF0IjoxNTU5MjQ5MDg5LCJleHAiOjE5OTk5OTk5OTl9.clNMIzxEouITpLnH1imIzy4Z9gukVpDHlH-j0lFgE7o';
const invalidTokenRunner = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIxQGVycm5kLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjEiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.LiXmZ1LDlqMzjTaZ8JLictGv6B7FfTYskzfa2Qgr_rk';
const invalidTokenCustomer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVyMUBlcnJuZC5jb20iLCJ1c2VySWQiOjEsInJvbGUiOiJjdXN0b21lciIsInVzZXJuYW1lIjoiY3VzdG9tZXIxIiwiaWF0IjoxNTU5MjQ5MDg5LCJleHAiOjE5OTk5OTk5OTl9.c7ldzvZvwoy8zcPK2pqNhvdc7xmV7SPYjlJnO04RMls';
const noToken = '';
const runnerWithNoTaskToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RydW5uZXIzQGVycm5kLmNvbSIsInVzZXJJZCI6NSwicm9sZSI6InJ1bm5lciIsInVzZXJuYW1lIjoidGVzdHJ1bm5lcjMiLCJpYXQiOjE1NTkyNDkwODksImV4cCI6MTk5OTk5OTk5OX0.kAZO4cmQWRDWSB5Qq5vGX2OICUFzZpRTOfTD7aCt9YM';
const customerWithNoOrderToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVyMkBlcnJuZC5jb20iLCJ1c2VySWQiOjQsInJvbGUiOiJjdXN0b21lciIsInVzZXJuYW1lIjoiY3VzdG9tZXIyIiwiaWF0IjoxNTU5MjQ5MDg5LCJleHAiOjE5OTk5OTk5OTl9.qHLYwilpIpSRrjrmb5cSm8zMV2fiCAS_3_AZt93PnfM';

describe('Errnd Orders Test Suite', () => {
  // ==== Create an order ==== //
  describe(' POST orders/customer/:username - Create an order', () => {
    it('should return status code 201 on creating an order', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer1')
        .set('authorization', token)
        .send(newOrder);
      res.status.should.equal(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Order created successfully');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer1')
        .set('authorization', invalidTokenCustomer)
        .send(newOrder);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer1')
        .set('authorization', noToken)
        .send(newOrder);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 400 if title field is left empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer1')
        .set('authorization', token)
        .send({
          category: 'Phones',
          title: '',
          description: 'I want you to repair my iphone screen',
          budget: 2500,
          duedate: '2019-07-04',
          deliverylocation: 'Lagos',
          quantity: 1
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.title.should.equal('title must be filled');
    });

    it('should return status code 400 if quantity is not a number', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer1')
        .set('authorization', token)
        .send({
          category: 'Phones',
          title: 'Repair Phone',
          description: 'I want you to repair my iphone screen',
          budget: 2500,
          duedate: '2019-07-04',
          deliverylocation: 'Lagos',
          quantity: 'notanumber'
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.quantity.should.equal('quantity must be a number');
    });

    it('should return status code 400 if due date is not a date', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer1')
        .set('authorization', token)
        .send({
          category: 'Phones',
          title: 'Repair Phone',
          description: 'I want you to repair my iphone screen',
          budget: 2500,
          duedate: 'notadate',
          deliverylocation: 'Lagos',
          quantity: 1
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.duedate.should.equal('due date must be a date and should follow the format YY-MM-DD');
    });

    it('should return status code 401 if a user wants to create an order on behalf of another user ', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer2')
        .set('authorization', token)
        .send(newOrder);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, you cannot create an order on behalf of another user');
    });

    it('should return status code 403 if a runner wants to make an order', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/testrunner1')
        .set('authorization', runnerToken)
        .send(newOrder);
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Forbidden, only a customer can make an order, please consider switching to customer mode');
    });

    it('should return status code 404 if no runners were found close to the customer location', async () => {
      const res = await chai.request(app)
        .post('/api/v1/orders/customer/customer1')
        .set('authorization', token)
        .send({
          category: 'Phones',
          title: 'Repair Phone',
          description: 'I want you to repair my iphone screen',
          budget: 2500,
          duedate: '2019-07-04',
          deliverylocation: 'Calabar',
          quantity: 1
        });
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No runners found close to your location or that can handle the service you are requesting, please choose another location or service');
    });
  });

  // ==== Retrieve all runner's tasks ==== //
  describe(" GET orders/runner/:username - Retrieve all runner's tasks", () => {
    it("should return status code 200 on retrieving all runner's tasks", async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner1')
        .set('authorization', runnerToken);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("All runner's tasks returned successfully");
    });

    it('should return status code 404 if a runner has not been assigned a task yet', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner3')
        .set('authorization', runnerWithNoTaskToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Runner have no assigned task yet');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner1')
        .set('authorization', invalidTokenRunner);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it("should return status code 401 if a runner tries to retrieve another runner's task", async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner2')
        .set('authorization', runnerToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal("Unauthorized, you cannot retrieve another runner's tasks");
    });

    it('should return status code 403 if a customer wants to retrieve tasks', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/customer2')
        .set('authorization', token);
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Forbidden, only a runner can retrieve tasks, please consider switching to runner mode');
    });

    it('should return status code 404 if a runner is not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner0')
        .set('authorization', runnerToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Runner not found');
    });
  });

  // ==== Retrieve a specific runner's task ==== //
  describe(" GET orders/runner/:username/:taskId - Retrieve a specific runner's task", () => {
    it("should return status code 200 on retrieving a specific runner's task", async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner1/1')
        .set('authorization', runnerToken);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("Specific runner's task returned successfully");
    });

    it('should return status code 404 if a runner has not been assigned a task yet', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner3/1')
        .set('authorization', runnerWithNoTaskToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Runner have no assigned task yet');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner1/1')
        .set('authorization', invalidTokenRunner);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner1/1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it("should return status code 401 if a runner tries to retrieve another runner's task", async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner2/1')
        .set('authorization', runnerToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal("Unauthorized, you cannot retrieve another runner's task");
    });

    it('should return status code 403 if a customer wants to retrieve tasks', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/customer2/1')
        .set('authorization', token);
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Forbidden, only a runner can retrieve tasks, please consider switching to runner mode');
    });

    it('should return status code 404 if a runner is not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/runner/testrunner0/1')
        .set('authorization', runnerToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Runner not found');
    });
  });

  // ==== Retrieve customer's orders history ==== //
  describe(" GET orders/customer/:username - Retrieve customer's orders history", () => {
    it("should return status code 200 on retrieving customer's orders history", async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/customer/customer1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("All customer's orders returned successfully");
    });

    it('should return status code 404 if a customer have not made an order yet', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/customer/customer2')
        .set('authorization', customerWithNoOrderToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Customer have not made an order yet');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/customer/customer1')
        .set('authorization', invalidTokenCustomer);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/customer/customer1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it("should return status code 401 if a customer tries to retrieve another customer's orders", async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/customer/customer2')
        .set('authorization', token);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal("Unauthorized, you cannot retrieve another customer's orders");
    });

    it('should return status code 403 if a runner wants to retrieve orders', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/customer/testrunner1')
        .set('authorization', runnerToken);
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Forbidden, only a customer can retrieve orders, please consider switching to customer mode');
    });

    it('should return status code 404 if a customer is not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/orders/customer/customer0')
        .set('authorization', token);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Customer not found');
    });
  });

  // ==== Update the status of a runner's task ==== //
  describe(" PUT orders/runner/:username/update/:taskId - Update the status of a runner's task", () => {
    it("should return status code 200 on updating the status of a runner's task ", async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/testrunner1/update/1')
        .set('authorization', runnerToken)
        .send({
          status: 'accept'
        });
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('The status of this task updated successfully');
    });

    it('should return status code 404 if a runner have not been assigned a ask yet', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/testrunner3/update/1')
        .set('authorization', runnerWithNoTaskToken)
        .send({
          status: 'accept'
        });
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Runner have no assigned task yet');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/testrunner1/update/1')
        .set('authorization', invalidTokenRunner)
        .send({
          status: 'accept'
        });
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/testrunner1/update/1')
        .set('authorization', noToken)
        .send({
          status: 'accept'
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if a runner tries to update tasks status of another runner', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/testrunner1/update/1')
        .set('authorization', runnerWithNoTaskToken)
        .send({
          status: 'accept'
        });
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, you cannot update the status of a task on behalf of another runner');
    });

    it('should return status code 403 if a customer wants to update the status of tasks', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/customer1/update/1')
        .set('authorization', token)
        .send({
          status: 'accept'
        });
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Forbidden, only a runner can update the status of a task, please consider switching to runner mode');
    });

    it('should return status code 400 if status is not filled', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/testrunner1/update/1')
        .set('authorization', token)
        .send({
          nostatus: 'nostatus'
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.status.should.equal('status must be filled');
    });

    it('should return status code 400 if status is not accept, reject or finish', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/runner/testrunner1/update/1')
        .set('authorization', token)
        .send({
          status: 'invalidstatus'
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('status must be accept, reject or finish');
    });
  });

  // ==== Update the status of a customer's order ==== //
  describe(" PUT orders/customer/:username/update/:orderId - Update the status of a customer's order", () => {
    it("should return status code 200 on updating the status of a customer's order", async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/customer1/update/1')
        .set('authorization', token)
        .send({
          status: 'complete'
        });
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('The status of this order updated successfully');
    });

    it('should return status code 404 if a customer has not made an order yet', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/customer2/update/1')
        .set('authorization', customerWithNoOrderToken)
        .send({
          status: 'complete'
        });
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Customer have not made an order yet');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/customer1/update/1')
        .set('authorization', invalidTokenCustomer)
        .send({
          status: 'complete'
        });
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/customer1/update/1')
        .set('authorization', noToken)
        .send({
          status: 'complete'
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if a customer tries to update order status of another customer', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/customer2/update/1')
        .set('authorization', token)
        .send({
          status: 'complete'
        });
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, you cannot update the status of an order on behalf of another customer');
    });

    it('should return status code 403 if a runner wants to update the status of orders', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/testrunner1/update/1')
        .set('authorization', runnerToken)
        .send({
          status: 'complete'
        });
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Forbidden, only a customer can update the status of an order, please consider switching to customer mode');
    });

    it('should return status code 400 if status is not filled', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/customer1/update/1')
        .set('authorization', token)
        .send({
          nostatus: 'nostatus'
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.status.should.equal('status must be filled');
    });

    it('should return status code 400 if status is not complete or incomplete', async () => {
      const res = await chai.request(app)
        .put('/api/v1/orders/customer/customer1/update/1')
        .set('authorization', token)
        .send({
          status: 'invalidstatus'
        });
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('status must be complete or incomplete');
    });
  });

  // ==== Delete a customer order ==== //
  describe(' DELETE orders/customer/remove/:orderId -  Delete a customer order', () => {
    it('should return status code 404 if an order is not found', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/orders/customer/remove/1')
        .set('authorization', customerWithNoOrderToken);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Order not found');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/orders/customer/remove/1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/orders/customer/remove/1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 403 if role is not customer', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/orders/customer/remove/1')
        .set('authorization', runnerToken);
      res.status.should.equal(403);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Forbidden, only a customer can delete orders');
    });

    it("should return status code 200 on deleting a customer's order", async () => {
      const res = await chai.request(app)
        .delete('/api/v1/orders/customer/remove/1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Order deleted successfully');
    });
  });
});
