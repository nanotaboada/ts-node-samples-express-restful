import { IPlayer } from '../models/player-interface.js';

/**
 * Interface that defines database operations for a Player.
 * Uses IPlayer interface to decouple from ORM implementation.
 */
export interface IPlayerDatabase {
    /**
     * Selects all players from the database.
     * @returns {Promise<IPlayer[]>} A promise that resolves to an array of players.
     */
    selectAllAsync(): Promise<IPlayer[]>;

    /**
     * Selects a Player by their ID.
     * @param {number} id - The ID of the Player to select.
     * @returns {Promise<IPlayer | null>} A promise that resolves to the selected Player if found, otherwise null.
     */
    selectByIdAsync(id: number): Promise<IPlayer | null>;

    /**
     * Selects a Player by their Squad Number.
     * @param {number} squadNumber - The Squad Number of the Player to select.
     * @returns {Promise<IPlayer | null>} A promise that resolves to the selected Player if found, otherwise null.
     */
    selectBySquadNumberAsync(squadNumber: number): Promise<IPlayer | null>;

    /**
     * Inserts a new Player into the database.
     * @param {Partial<IPlayer>} player - The Player to insert.
     * @returns {Promise<void>} A promise that resolves when the insertion is complete.
     */
    insertAsync(player: Partial<IPlayer>): Promise<void>;

    /**
     * Updates an existing Player in the database.
     * @param {Partial<IPlayer>} player - The Player to update.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    updateAsync(player: Partial<IPlayer>): Promise<void>;

    /**
     * Deletes an existing Player by their ID.
     * @param {number} id - The ID of the Player to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     */
    deleteAsync(id: number): Promise<void>;
}
