export default (sequelize, DataTypes) => {
  const Profiles = sequelize.define('profiles', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.TEXT,
    location: DataTypes.STRING
  }, {});
  Profiles.associate = (models) => {
    Profiles.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user'
    });
  };
  return Profiles;
};
