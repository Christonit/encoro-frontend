'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     */
    await queryInterface.createTable('events', {
      id: { type: Sequelize.DataTypes.STRING, primaryKey: true },
      direction: Sequelize.DataTypes.STRING,
      city: Sequelize.DataTypes.STRING,
      place_id: Sequelize.DataTypes.STRING,
      category: Sequelize.DataTypes.STRING,
      secondary_category: Sequelize.DataTypes.STRING,
      title: Sequelize.DataTypes.STRING,
      date: Sequelize.DataTypes.DATE,
      time: Sequelize.DataTypes.TIME,
      description: Sequelize.DataTypes.TEXT('long'),
      hashtags: Sequelize.DataTypes.JSON,
      media: Sequelize.DataTypes.JSON,
      entrance_format: Sequelize.DataTypes.STRING,
      fee: Sequelize.DataTypes.BIGINT,
      creator: Sequelize.DataTypes.STRING,
      social_networks: Sequelize.DataTypes.STRING,
      published_in_ig: Sequelize.DataTypes.BOOLEAN
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
