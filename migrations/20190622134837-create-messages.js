/* eslint-disable no-unused-vars */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('messages', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    senderusername: {
      type: Sequelize.STRING,
      allowNull: false
    },
    receiverusername: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isread: {
      type: Sequelize.BOOLEAN,
      allowNull: false
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
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('messages'); }
