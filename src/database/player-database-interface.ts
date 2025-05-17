import Player from '../models/player-model';

/**
 * Interface that defines database operations for a Player.
 */
export interface IPlayerDatabase {
    /**
     * Selects all players from the database.
     * @returns {Promise<Player[]>} A promise that resolves to an array of players.
     */
    selectAllAsync(): Promise<Player[]>;

    /**
     * Selects a Player by their ID.
     * @param {number} id - The ID of the Player to select.
     * @returns {Promise<Player | null>} A promise that resolves to the selected Player if found, otherwise null.
     */
    selectByIdAsync(id: number): Promise<Player | null>;

    /**
     * Selects a Player by their Squad Number.
     * @param {number} squadNumber - The Squad Number of the Player to select.
     * @returns {Promise<Player | null>} A promise that resolves to the selected Player if found, otherwise null.
     */
    selectBySquadNumberAsync(squadNumber: number): Promise<Player | null>;

    /**
     * Inserts a new Player into the database.
     * @param {Partial<Player>} player - The Player to insert.
     * @returns {Promise<void>} A promise that resolves when the insertion is complete.
     */
    insertAsync(player: Partial<Player>): Promise<void>;

    /**
     * Updates an existing Player in the database.
     * @param {Partial<Player>} player - The Player to update.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    updateAsync(player: Partial<Player>): Promise<void>;

    /**
     * Deletes an existing Player by their ID.
     * @param {number} id - The ID of the Player to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     */
    deleteAsync(id: number): Promise<void>;
}
