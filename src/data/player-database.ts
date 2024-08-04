import Player from '../models/player-model';
import { IPlayerDatabase } from '../data/player-database-interface';

/**
 * Implementation of IPlayerDatabase for handing the database operations of a Player.
 */
export default class PlayerDatabase implements IPlayerDatabase {
    /**
     * Selects all players from the database.
     * @returns {Promise<Player[]>} A promise that resolves to an array of Player models.
     */
    async selectAllAsync(): Promise<Player[]> {
        return await Player.findAll();
    }

    /**
     * Selects a Player by its ID.
     * @param {number} id - The ID of the Player to select.
     * @returns {Promise<Player | null>} A promise that resolves to the selected Player model if found, otherwise null.
     */
    async selectByIdAsync(id: number): Promise<Player | null> {
        return await Player.findByPk(id);
    }

    /**
     * Selects a Player by its Squad Number.
     * @param {number} squadNumber - The Squad Number of the Player to select.
     * @returns {Promise<Player | null>} A promise that resolves to the selected Player model if found, otherwise null.
     */
    async selectBySquadNumberAsync(squadNumber: number): Promise<Player | null> {
        return await Player.findOne({ where: { squadNumber } });
    }

    /**
     * Inserts a new Player into the database.
     * @param {Partial<Player>} player - The Player to insert.
     * @returns {Promise<void>} A promise that resolves when the insertion is complete.
     */
    async insertAsync(player: Partial<Player>): Promise<void> {
        await Player.create(player);
    }

    /**
     * Updates an existing Player in the database.
     * @param {Partial<Player>} player - The Player to update.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    async updateAsync(player: Partial<Player>): Promise<void> {
        await Player.update(player, { where: { id: player.id } });
    }

    /**
     * Deletes an existing Player by its ID.
     * @param {number} id - The ID of the Player to delete.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     */
    async deleteAsync(id: number): Promise<void> {
        await Player.destroy({ where: { id } });
    }
}
