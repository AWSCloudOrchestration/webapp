import { DataTypes } from 'sequelize';

export const userModel = (sequelize) => {
  const UserModel = sequelize.define('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_created: {
      type: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    account_updated: {
      type: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
  });
  return UserModel;
};

