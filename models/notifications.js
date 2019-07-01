export default (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    senderusername: DataTypes.STRING,
    receiverusername: DataTypes.STRING,
    content: DataTypes.STRING,
    typeofnotification: DataTypes.STRING,
    typeofnotificationid: DataTypes.INTEGER,
    isread: DataTypes.BOOLEAN
  }, {});
  notifications.associate = (models) => {
    notifications.belongsTo(models.users, {
      foreignKey: 'senderusername',
      onDelete: 'CASCADE',
    });
  };
  return notifications;
};
