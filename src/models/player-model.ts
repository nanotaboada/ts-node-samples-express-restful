import sequelize from '../data/sequelize';
import { Model, DataTypes } from 'sequelize';

/**
 * Sequelize model representing a football Player.
 * @extends Model
 *
 * @property {number} id - The unique identifier for the Player (Primary Key).
 * @property {string} firstName - The first name of the Player.
 * @property {string} [middleName] - The middle name of the Player. (Optional)
 * @property {string} lastName - The last name of the Player.
 * @property {Date} [dateOfBirth] - The date of birth of the Player. (Optional)
 * @property {number} squadNumber - The unique squad number assigned to the Player.
 * @property {string} position - The playing position of the Player.
 * @property {string} [abbrPosition] - The abbreviated form of the Player's position. (Optional)
 * @property {string} [team] - The team to which the Player belongs. (Optional)
 * @property {string} [league] - The league where the team plays. (Optional)
 * @property {boolean} [starting11] - Indicates if the Player is in the starting 11. (Optional)
 */
export default class Player extends Model {
    declare id: number;
    declare firstName: string;
    declare middleName?: string;
    declare lastName: string;
    declare dateOfBirth?: Date;
    declare squadNumber: number;
    declare position: string;
    declare abbrPosition?: string;
    declare team?: string;
    declare league?: string;
    declare starting11?: boolean;
}

Player.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        firstName: { type: DataTypes.STRING, allowNull: false },
        middleName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: false },
        dateOfBirth: { type: DataTypes.DATE, allowNull: true },
        squadNumber: { type: DataTypes.INTEGER, allowNull: false, unique: true },
        position: { type: DataTypes.STRING, allowNull: false },
        abbrPosition: { type: DataTypes.STRING, allowNull: true },
        team: { type: DataTypes.STRING, allowNull: true },
        league: { type: DataTypes.STRING, allowNull: true },
        starting11: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
        sequelize,
        modelName: 'Player',
        tableName: 'players',
        timestamps: false,
    },
);
