import Player from '../models/player-model.js';
import { IPlayerDatabase } from './player-database-interface.js';

/**
 * Implementation of IPlayerDatabase for handling the database operations of a Player.
 * Provides data access layer using Sequelize ORM.
 */
export default class PlayerDatabase implements IPlayerDatabase {
    async selectAllAsync(): Promise<Player[]> {
        return await Player.findAll();
    }

    async selectByIdAsync(id: number): Promise<Player | null> {
        return await Player.findByPk(id);
    }

    async selectBySquadNumberAsync(squadNumber: number): Promise<Player | null> {
        return await Player.findOne({ where: { squadNumber } });
    }

    async insertAsync(player: Partial<Player>): Promise<void> {
        await Player.create(player);
    }

    async updateAsync(player: Partial<Player>): Promise<void> {
        await Player.update(player, { where: { id: player.id } });
    }

    async deleteAsync(id: number): Promise<void> {
        await Player.destroy({ where: { id } });
    }
}
