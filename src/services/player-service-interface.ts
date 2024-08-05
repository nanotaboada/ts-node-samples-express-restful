import Player from '../models/player-model';

/**
 * Interface that defines service operations for a Player.
 */
export interface IPlayerService {
    /**
     * Retrieves all players, using cache if available.
     * @returns {Promise<Player[]>} A promise that resolves to an array of Player models.
     */
    retrieveAllAsync(): Promise<Player[]>;

    /**
     * Retrieves a Player by their ID, using cache if available.
     * @param {number} id - The ID of the Player to retrieve.
     * @returns {Promise<Player | undefined>} A promise that resolves to the Player model if found, otherwise undefined.
     */
    retrieveByIdAsync(id: number): Promise<Player | undefined>;

    /**
     * Retrieves a Player by their Squad Number, using cache if available.
     * @param {number} squadNumber - The Squad Number of the Player to retrieve.
     * @returns {Promise<Player | undefined>} A promise that resolves to the Player model if found, otherwise undefined.
     */
    retrieveBySquadNumberAsync(squadNumber: number): Promise<Player | undefined>;

    /**
     * Creates a new Player and clears the cache.
     * @param {Player} player - The Player to create.
     * @returns {Promise<void>} A promise that resolves when the creation is complete.
     */
    createAsync(player: Player): Promise<void>;

    /**
     * Updates an existing Player and clears the cache.
     * @param {Player} player - The Player to update.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    updateAsync(player: Player): Promise<void>;

    /**
     * Deletes an existing Player by their ID and clears the cache.
     * @param {number} id - The ID of the Player to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     */
    deleteAsync(id: number): Promise<void>;
}
