export default (sequelize, DataTypes) => {
  const Services = sequelize.define('services', {
    category: DataTypes.STRING,
    subcategory: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    days: DataTypes.INTEGER,
    media: DataTypes.STRING,
    location: DataTypes.STRING,
    packageoptions: DataTypes.STRING
  }, {});
  Services.associate = (models) => {
    Services.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user'
    });
    Services.hasMany(models.bookmarks, {
      foreignKey: 'serviceId',
      onDelete: 'CASCADE',
      as: 'bookmarks'
    });
  };
  return Services;
};
