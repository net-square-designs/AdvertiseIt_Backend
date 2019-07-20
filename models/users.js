/* eslint-disable no-unused-vars */
export default (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    role: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    productsofinterest: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  Users.associate = (models) => {
    Users.hasOne(models.profiles, {
      foreignKey: 'userId',
      as: 'profile'
    });
    Users.hasMany(models.products, {
      foreignKey: 'userId',
      as: 'products'
    });
  };
  return Users;
};
