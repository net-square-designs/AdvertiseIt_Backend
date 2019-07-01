export default (sequelize, DataTypes) => {
  const Bookmarks = sequelize.define('bookmarks', {
    title: DataTypes.STRING
  }, {});
  Bookmarks.associate = (models) => {
    // associations can be defined here
    Bookmarks.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Bookmarks.belongsTo(models.services, {
      foreignKey: 'serviceId',
      onDelete: 'CASCADE',
    });
  };
  return Bookmarks;
};
