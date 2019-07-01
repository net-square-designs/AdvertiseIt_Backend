/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';

const genSalt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(process.env.PASSWORD, genSalt);

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [{
    role: 'admin',
    password: hashedPassword,
    email: 'admin1@advertiseit.com',
    username: 'admin1',
    productsofinterest: ['customer-merchant', 'influencer'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'customer-merchant',
    password: hashedPassword,
    email: 'merchant1@advertiseit.com',
    username: 'merchant1',
    productsofinterest: ['phones', 'software'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'customer-merchant',
    password: hashedPassword,
    email: 'customer1@advertiseit.com',
    username: 'customer1',
    productsofinterest: ['sports', 'music'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'influencer',
    password: hashedPassword,
    email: 'influencer1@advertiseit.com',
    username: 'influencer1',
    productsofinterest: ['sports', 'tech', 'music'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'customer-merchant',
    password: hashedPassword,
    email: 'customer2@advertiseit.com',
    username: 'customer2',
    productsofinterest: ['apple', 'clothings'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
