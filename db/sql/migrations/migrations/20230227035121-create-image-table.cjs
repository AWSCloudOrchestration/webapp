'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('images', {
      'image_id': {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      'file_name': {
        type: Sequelize.STRING,
        allowNull: false,
      },
      's3_bucket_path': {
        type: Sequelize.STRING,
        allowNull: false,
      },
      'date_created': {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      'product_id': {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('images');
  },
};
