/* eslint-disable no-unused-vars */
export default {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('services', [{
    category: 'Phones',
    subcategory: 'iphone',
    title: 'Repair your iphone screens',
    description: 'I can repair your iphone screens',
    price: 2000,
    days: 1,
    media: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
    packageoptions: JSON.stringify(
      [{
        serviceA: 'add music to the phone',
        quantity: 1,
        type: 'basic',
        price: 200
      }]
    ),
    location: 'Lagos',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    category: 'Design',
    subcategory: 'Graphic Design',
    title: 'Do graphic designs',
    description: 'I can create beautiful graphic designs for you',
    price: 1200,
    days: 1,
    media: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
    packageoptions: JSON.stringify([{
      serviceA: 'add gradient to the design',
      quantity: 1,
      type: 'basic',
      price: 4500
    },
    {
      serviceA: 'add as much color combinations as you want',
      quantity: 1,
      type: 'basic',
      price: 450
    }]),
    location: 'Abuja',
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    category: 'Software',
    subcategory: 'Web Development',
    title: 'Develop web app',
    description: 'I can create a web app for you',
    price: 955000,
    days: 90,
    media: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
    packageoptions: JSON.stringify([{
      serviceA: 'add map to the web app',
      quantity: 1,
      type: 'basic',
      price: 3500
    }]),
    location: 'Port Harcourt',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('services', null, {})
};
