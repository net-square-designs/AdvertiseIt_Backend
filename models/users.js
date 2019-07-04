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
  };
  return Users;
};
