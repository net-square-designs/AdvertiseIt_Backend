/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';

const genSalt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('errndPassword1234567890@@@@@@###!!!', genSalt);

export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [{
    role: 'runner',
    password: hashedPassword,
    email: 'testrunner1@errnd.com',
    username: 'testrunner1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'runner',
    password: hashedPassword,
    email: 'testrunner2@errnd.com',
    username: 'testrunner2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'customer',
    password: hashedPassword,
    email: 'customer1@errnd.com',
    username: 'customer1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'customer',
    password: hashedPassword,
    email: 'customer2@errnd.com',
    username: 'customer2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    role: 'runner',
    password: hashedPassword,
    email: 'testrunner3@errnd.com',
    username: 'testrunner3',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
