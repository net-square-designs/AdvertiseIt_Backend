export default (sequelize, DataTypes) => {
  const Orders = sequelize.define('orders', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    deliverylocation: DataTypes.STRING,
    budget: DataTypes.INTEGER,
    duedate: DataTypes.DATE,
    customerusername: DataTypes.STRING,
    runnerusername: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {});
  Orders.associate = (models) => {
    Orders.belongsTo(models.users, {
      foreignKey: 'customerusername',
      onDelete: 'CASCADE',
      as: 'customer'
    });
  };
  return Orders;
};
