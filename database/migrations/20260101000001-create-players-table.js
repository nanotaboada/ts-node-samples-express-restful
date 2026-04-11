'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('players', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            firstName: { type: Sequelize.STRING, allowNull: false },
            middleName: { type: Sequelize.STRING, allowNull: true },
            lastName: { type: Sequelize.STRING, allowNull: false },
            dateOfBirth: { type: Sequelize.DATE, allowNull: true },
            squadNumber: { type: Sequelize.INTEGER, allowNull: false, unique: true },
            position: { type: Sequelize.STRING, allowNull: false },
            abbrPosition: { type: Sequelize.STRING, allowNull: true },
            team: { type: Sequelize.STRING, allowNull: true },
            league: { type: Sequelize.STRING, allowNull: true },
            starting11: { type: Sequelize.BOOLEAN, allowNull: true },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('players');
    },
};
