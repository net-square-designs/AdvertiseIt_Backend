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
    phone: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.TEXT
    },
    location: {
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
