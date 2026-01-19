/**
 * Interface representing a Player domain entity.
 * Decouples business logic from ORM implementation.
 *
 * @interface IPlayer
 * @property {number} id - The unique identifier for the Player.
 * @property {string} firstName - The first name of the Player.
 * @property {string} [middleName] - The middle name of the Player. (Optional)
 * @property {string} lastName - The last name of the Player.
 * @property {string} [dateOfBirth] - The date of birth of the Player in ISO 8601 format. (Optional)
 * @property {number} squadNumber - The unique squad number assigned to the Player.
 * @property {string} position - The playing position of the Player.
 * @property {string} [abbrPosition] - The abbreviated form of the Player's position. (Optional)
 * @property {string} [team] - The team to which the Player belongs. (Optional)
 * @property {string} [league] - The league where the team plays. (Optional)
 * @property {boolean} [starting11] - Indicates if the Player is in the starting 11. (Optional)
 */
export interface IPlayer {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth?: string;
    squadNumber: number;
    position: string;
    abbrPosition?: string;
    team?: string;
    league?: string;
    starting11?: boolean;
}
