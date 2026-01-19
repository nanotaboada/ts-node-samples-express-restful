import PlayerModel from '../models/player-model.js';
import { IPlayer } from '../models/player-interface.js';
import { IPlayerDatabase } from './player-database-interface.js';

/**
 * Implementation of IPlayerDatabase for handling the database operations of a Player.
 * Provides data access layer using Sequelize ORM.
 * Converts Sequelize models to IPlayer plain objects to maintain decoupling.
 */
export default class PlayerDatabase implements IPlayerDatabase {
    async selectAllAsync(): Promise<IPlayer[]> {
        const players = await PlayerModel.findAll();
        return players.map((player) => player.toJSON());
    }

    async selectByIdAsync(id: number): Promise<IPlayer | null> {
        const player = await PlayerModel.findByPk(id);
        return player ? player.toJSON() : null;
    }

    async selectBySquadNumberAsync(squadNumber: number): Promise<IPlayer | null> {
        const player = await PlayerModel.findOne({ where: { squadNumber } });
        return player ? player.toJSON() : null;
    }

    async insertAsync(player: Partial<IPlayer>): Promise<void> {
        await PlayerModel.create(player);
    }

    async updateAsync(player: Partial<IPlayer>): Promise<void> {
        if (player.id === undefined) {
            throw new Error('Player id is required for update');
        }
        await PlayerModel.update(player, { where: { id: player.id } });
    }

    async deleteAsync(id: number): Promise<void> {
        await PlayerModel.destroy({ where: { id } });
    }
}
