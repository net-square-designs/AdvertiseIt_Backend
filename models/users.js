/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    role: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING
  }, {});
  Users.associate = (models) => {
    Users.hasOne(models.profiles, {
      foreignKey: 'userId',
      as: 'profile'
    });
    Users.hasMany(models.services, {
      foreignKey: 'userId',
      as: 'services'
    });
    Users.hasMany(models.bookmarks, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'bookmarks'
    });
    Users.hasMany(models.notifications, {
      foreignKey: 'senderusername',
      as: 'notifications'
    });
    Users.hasMany(models.orders, {
      foreignKey: 'customerusername',
      as: 'orders'
    });
  };
  return Users;
};
