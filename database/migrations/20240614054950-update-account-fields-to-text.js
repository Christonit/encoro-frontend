'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('accounts', 'access_token', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('accounts', 'refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('accounts', 'id_token', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('accounts', 'access_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('accounts', 'refresh_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('accounts', 'id_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  }
};

