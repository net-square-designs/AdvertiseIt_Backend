/* eslint-disable no-unused-vars */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('orders', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deliverylocation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    budget: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    duedate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    customerusername: {
      type: Sequelize.STRING,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'username'
      },
    },
    runnerusername: {
      type: Sequelize.STRING,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'username'
      },
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'new'
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
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('orders'); }
