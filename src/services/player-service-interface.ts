import { IPlayer } from '../models/player-interface.js';

/**
 * Interface that defines service operations for a Player.
 * Uses IPlayer interface to decouple from ORM implementation.
 */
export interface IPlayerService {
    /**
     * Retrieves all players, using cache if available.
     * @returns {Promise<IPlayer[]>} A promise that resolves to an array of Player entities.
     */
    retrieveAllAsync(): Promise<IPlayer[]>;

    /**
     * Retrieves a Player by their ID, using cache if available.
     * @param {number} id - The ID of the Player to retrieve.
     * @returns {Promise<IPlayer | undefined>} A promise that resolves to the Player entity if found, otherwise undefined.
     */
    retrieveByIdAsync(id: number): Promise<IPlayer | undefined>;

    /**
     * Retrieves a Player by their Squad Number, using cache if available.
     * @param {number} squadNumber - The Squad Number of the Player to retrieve.
     * @returns {Promise<IPlayer | undefined>} A promise that resolves to the Player entity if found, otherwise undefined.
     */
    retrieveBySquadNumberAsync(squadNumber: number): Promise<IPlayer | undefined>;

    /**
     * Creates a new Player and clears the cache.
     * @param {IPlayer} player - The Player to create.
     * @returns {Promise<void>} A promise that resolves when the creation is complete.
     */
    createAsync(player: IPlayer): Promise<void>;

    /**
     * Updates an existing Player and clears the cache.
     * @param {IPlayer} player - The Player to update.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    updateAsync(player: IPlayer): Promise<void>;

    /**
     * Deletes an existing Player by their ID and clears the cache.
     * @param {number} id - The ID of the Player to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     */
    deleteAsync(id: number): Promise<void>;
}
