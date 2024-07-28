/* -----------------------------------------------------------------------------
 * Model
 * -------------------------------------------------------------------------- */

import { Model, DataTypes } from 'sequelize';
import sequelize from '../data/sequelize';

/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - squadNumber
 *         - position
 *         - abbrPosition
 *         - team
 *         - league
 *         - starting11
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the Player
 *         firstName:
 *           type: string
 *           description: The first name of the Player
 *         middleName:
 *           type: string
 *           nullable: true
 *           description: The middle name of the Player, if any
 *         lastName:
 *           type: string
 *           description: The last name of the Player
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The date of birth of the Player (ISO 8601)
 *         squadNumber:
 *           type: integer
 *           description: The unique squad number assigned to the Player
 *         position:
 *           type: string
 *           description: The playing position of the Player
 *         abbrPosition:
 *           type: string
 *           description: The abbreviated form of the Player's position
 *         team:
 *           type: string
 *           description: The team to which the Player belongs
 *         league:
 *           type: string
 *           description: The league where the team plays
 *         starting11:
 *           type: string
 *           description: Indicates if the Player is in the starting 11
 *       example:
 *         id: 10
 *         firstName: Lionel
 *         middleName: Andrés
 *         lastName: Messi
 *         dateOfBirth: 1987-06-24
 *         squadNumber: 10
 *         position: Right Winger
 *         abbrPosition: RW
 *         team: Inter Miami CF
 *         league: Major League Soccer
 *         starting11: TRUE
 */
export class Player extends Model {
    declare id: number;
    declare firstName: string;
    declare middleName: string;
    declare lastName: string;
    declare dateOfBirth: Date;
    declare squadNumber: number;
    declare position: string;
    declare abbrPosition: string;
    declare team: string;
    declare league: string;
    declare starting11: boolean;
}

Player.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        firstName: { type: DataTypes.STRING, allowNull: false },
        middleName: { type: DataTypes.STRING, allowNull: true },
        lastName: { type: DataTypes.STRING, allowNull: false },
        dateOfBirth: { type: DataTypes.DATE, allowNull: false },
        squadNumber: { type: DataTypes.INTEGER, allowNull: false },
        position: { type: DataTypes.STRING, allowNull: false },
        abbrPosition: { type: DataTypes.STRING, allowNull: false },
        team: { type: DataTypes.STRING, allowNull: false },
        league: { type: DataTypes.STRING, allowNull: false },
        starting11: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
        sequelize,
        modelName: 'Player',
        tableName: 'players',
        timestamps: false,
    },
);

export default Player;
