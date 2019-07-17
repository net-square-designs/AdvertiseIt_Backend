export default (sequelize, DataTypes) => {
  const Profiles = sequelize.define('profiles', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    bio: DataTypes.TEXT,
    phone: DataTypes.STRING,
    image: DataTypes.STRING,
    location: DataTypes.STRING,
    storeName: DataTypes.STRING,
    bank: DataTypes.STRING,
    website: DataTypes.STRING
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
