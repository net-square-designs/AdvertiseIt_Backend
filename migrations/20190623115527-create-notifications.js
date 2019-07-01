/* eslint-disable no-unused-vars */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    senderusername: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      },
    },
    receiverusername: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'username'
      },
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    typeofnotification: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    typeofnotificationid: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isread: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('notifications');
}
