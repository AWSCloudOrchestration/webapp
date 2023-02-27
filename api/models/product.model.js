import { DataTypes } from 'sequelize';

export const productModel = (sequelize) => {
  const ProductModel = sequelize.define('products', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    owner_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
      },
    },
    date_added: {
      type: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    date_last_updated: {
      type: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
  });
  return ProductModel;
};

