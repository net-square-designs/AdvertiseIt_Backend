import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const newProduct = {
  category: 'Clothing',
  subCategory: 'mens wear',
  title: 'Classy nike sneakers',
  description: 'This sneakers are the latest from nike',
  price: 50000,
  media: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
  tags: ['nike', 'sneakers']
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcmNoYW50MUBhZHZlcnRpc2VpdC5jb20iLCJ1c2VySWQiOjMsInJvbGUiOiJjdXN0b21lci1tZXJjaGFudCIsInVzZXJuYW1lIjoibWVyY2hhbnQxIiwicHJvZHVjdHNvZmludGVyZXN0IjpbInBob25lcyIsInNvZnR3YXJlIl0sImlhdCI6MTU2MzM5MzAwNywiZXhwIjo1MDAwMDAwMDAwfQ.3tn5cyh_z5qSqnbpG1gzLy3KL-10laeA--wnycNTGYU';
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lcmNoYW50MUBhZHZlcnRpc2VpdC5jb20iLCJ1c2VySWQiOjMsInJvbGUiOiJjdXN0b21lci1tZXJjaGFudCIsInVzZXJuYW1lIjoibWVyY2hhbnQxIiwicHJvZHVjdHNvZmludGVyZXN0IjpbInBob25lcyIsInNvZnR3YXJlIl0sImlhdCI6MTU2MzM5MzAwNywiZXhwIjo1MDAwMDAwMDAwfQ.s7rEr0txF-YnXKFrEC8b4kbukxJSR1ivhO6FESLBI1g';
const noToken = '';

describe('AdvertiseIt Test Suite', () => {
  // ==== Create a new product ==== //
  describe(' POST products/:username - Create a new product', () => {
    it('should return status code 201 on creating a new product', async () => {
      const res = await chai.request(app)
        .post('/api/v1/products/merchant1')
        .set('authorization', token)
        .send(newProduct);
      res.status.should.equal(201);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Product created successfully');
    });

    it('should return status code 401 if a user want to create a product on behalf of another user', async () => {
      const res = await chai.request(app)
        .post('/api/v1/products/customer2')
        .set('authorization', token)
        .send(newProduct);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, you cannot create a product on behalf of another user');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/products/merchant1')
        .set('authorization', invalidToken)
        .send(newProduct);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .post('/api/v1/products/merchant1')
        .set('authorization', noToken)
        .send(newProduct);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 400 if category field is left empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/products/merchant1')
        .set('authorization', token)
        .send(Object.assign(newProduct, {
          category: '',
        }));
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.category.should.equal('category must be filled');
    });
  });

  // ==== Archive an existing product ==== //
  describe(' PUT products/:username/archive/:productId - Archive an existing product', () => {
    it('should return status code 200 on archiving an existing product', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/archive/1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Product archived successfully');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/archive/1')
        .set('authorization', noToken)
        .send(newProduct);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 404 if no product is found', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/archive/0')
        .set('authorization', token);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No product found');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/archive/1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });
  });

  // ==== Update an existing product ==== //
  describe(' PUT products/:username/update/:productId - Update an existing product', () => {
    it('should return status code 200 on updating an existing product', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/update/1')
        .set('authorization', token)
        .send({ subCategory: 'Wears' });
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Product updated successfully');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/update/1')
        .set('authorization', noToken)
        .send(newProduct);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if a user want to update a product on behalf of another user', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/customer2/update/1')
        .set('authorization', token)
        .send(newProduct);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, you cannot update a product on behalf of another user');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/update/1')
        .set('authorization', invalidToken)
        .send(newProduct);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });
  });

  // ==== Retrieve all user's archived products ==== //
  describe(" GET products/:username/archived - Retrieve all user's archived products", () => {
    it("should return status code 401 if a user tries to access another user's archive products", async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/merchant2/archived')
        .set('authorization', token);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal("Unauthorized, you cannot access another user's archived products");
    });

    it("should return status code 200 on retrieving all user's archived products", async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/merchant1/archived')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("All user's archived products returned successfully");
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/merchant1/archived')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/merchant1/archived')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });
  });

  // ==== Unarchive an existing product ==== //
  describe(' PUT products/:username/unarchive/:productId - Unarchive an existing product', () => {
    it('should return status code 200 on unarchiving an existing product', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/unarchive/1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Product unarchived successfully');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/unarchive/1')
        .set('authorization', noToken)
        .send(newProduct);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 404 if no product is found', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/unarchive/0')
        .set('authorization', token);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No product found');
    });

    it('should return status code 401 if token is invalid', async () => {
      const res = await chai.request(app)
        .put('/api/v1/products/merchant1/unarchive/1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });
  });

  // ==== Retrieve all products ==== //
  describe(' GET products/ - Retrieve all products', () => {
    it('should return status code 200 on retrieving all products', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('All products returned successfully');
    });
  });

  // ==== Retrieve specific product of a user ==== //
  describe(' GET products/:username/:productId - Retrieve a specific product of a user', () => {
    it('should return status code 200 on retrieving a specific runner services', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/merchant1/specific/1');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Specific product of a user returned successfully');
    });

    it('should return status code 404 on user not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/customer0/specific/1');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('User not found');
    });
  });

  // ==== Retrieve all products of a user ==== //
  describe(' GET products/:username - Retrieve all products of a user', () => {
    it('should return status code 200 on retrieving all products of a user', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/all/merchant1');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal("All user's products returned successfully");
    });

    it('should return status code 404 on user not found', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/all/merchant0');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('User not found');
    });
  });

  // ==== Search for products ==== //
  describe(' GET products/search?query=Clothing - Retrieve all products matching specified search params', () => {
    it('should return status code 200 on retrieving all products matching specified search params', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?query=Clothing');
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Searched products returned successfully');
    });

    it('should return status code 404 on no products matching specified search params', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?query=nmmmdmkrkproductsrkrkememekekmemeedsksksmdjfjkftjkf394944848848usnsndsnn');
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No products found matching the searched parameter');
    });

    it('should return status code 400 if invalid url is provided', async () => {
      const res = await chai.request(app)
        .get('/api/v1/products/search?queryyyyyyyeyeyehsb=Clothing');
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Invalid url, url should be like /search?query=');
    });
  });

  // ==== Delete a product ==== //
  describe(' DELETE products/:username/remove/:productId - Delete a product', () => {
    it('should return status code 404 on no products found', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/products/merchant1/remove/0')
        .set('authorization', token);
      res.status.should.equal(404);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('No product found');
    });

    it('should return status code 400 if no token is provided', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/products/merchant1/remove/1')
        .set('authorization', noToken);
      res.status.should.equal(400);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.token.should.equal('No token provided, please provide one');
    });

    it('should return status code 401 if a user is not authenticated', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/products/merchant1/remove/1')
        .set('authorization', invalidToken);
      res.status.should.equal(401);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.error.should.equal('Unauthorized, user not authenticated');
    });

    it('should return status code 200 on deleting a product', async () => {
      const res = await chai.request(app)
        .delete('/api/v1/products/merchant1/remove/1')
        .set('authorization', token);
      res.status.should.equal(200);
      res.body.should.be.a('object');
      res.body.should.have.property('data');
      res.body.should.have.property('status');
      res.body.data.message.should.equal('Product deleted successfully');
    });
  });
});
