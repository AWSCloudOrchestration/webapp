import { DataTypes } from 'sequelize';

export const imageModel = (sequelize) => {
  const ImageModel = sequelize.define('images', {
    'image_id': {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    'file_name': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    's3_bucket_path': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'product_id': {
      type: DataTypes.INTEGER,
      references: {
        model: 'products',
      },
    },
  }, {
    timestamps: true,
    updatedAt: false,
    createdAt: 'date_created',
  });
  return ImageModel;
};

