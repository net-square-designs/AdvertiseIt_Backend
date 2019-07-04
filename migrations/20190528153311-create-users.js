/* eslint-disable no-unused-vars */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    productsofinterest: {
      type: Sequelize.ARRAY(Sequelize.STRING),
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
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('users'); }
