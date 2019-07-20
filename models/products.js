
export default (sequelize, DataTypes) => {
  const Products = sequelize.define('products', {
    category: DataTypes.STRING,
    subCategory: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    media: DataTypes.STRING,
    isArchived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {});
  Products.associate = (models) => {
    Products.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return Products;
};
