/* eslint-disable no-unused-vars */
export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('notifications', [{
    senderusername: 'testrunner2',
    receiverusername: 'testrunner1',
    content: 'I want to you to build a rocket for me',
    typeofnotification: 'message',
    typeofnotificationid: 1,
    isread: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    senderusername: 'testrunner1',
    receiverusername: 'testrunner2',
    content: 'I want to you to build a car for me',
    typeofnotification: 'message',
    typeofnotificationid: 1,
    isread: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    senderusername: 'testrunner2',
    receiverusername: 'testrunner1',
    content: 'I want to you to build a web app for me',
    typeofnotification: 'message',
    typeofnotificationid: 2,
    isread: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    senderusername: 'testrunner1',
    receiverusername: 'testrunner2',
    content: 'I want to you to build a mobile app for me',
    typeofnotification: 'message',
    typeofnotificationid: 2,
    isread: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('notifications', null, {})
};
