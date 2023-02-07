'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  /**
   * Product model
   */
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  products.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    sku: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    date_added: DataTypes.DATE,
    date_last_updated: DataTypes.DATE,
    owner_user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};
