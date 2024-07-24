/* -----------------------------------------------------------------------------
 * Model
 * -------------------------------------------------------------------------- */

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

export interface Player {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string; // ISO 8601
    squadNumber: number;
    position: string;
    abbrPosition: string;
    team: string;
    league: string;
    starting11: string;
}
