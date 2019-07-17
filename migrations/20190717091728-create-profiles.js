/* eslint-disable no-unused-vars */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('profiles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.TEXT
    },
    phone: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    storeName: {
      type: Sequelize.STRING
    },
    bank: {
      type: Sequelize.STRING
    },
    website: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
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
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('profiles'); }
