/* eslint-disable no-unused-vars */
export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('profiles', [{
    firstName: 'Johnny',
    lastName: 'Doewwy',
    image: '',
    location: 'Lagos',
    bio: 'I am a sofware engineer and AI enthusiast',
    phone: '09099933444',
    storeName: 'JohnDoeStores',
    bank: JSON.stringify({
      name: 'UBA',
      accountNumber: 209393933855656,
      accountName: 'John DoeMerchant2'
    }),
    website: '',
    userId: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('profiles', null, {})
};
