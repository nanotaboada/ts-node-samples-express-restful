/* -----------------------------------------------------------------------------
 * Database
 * -------------------------------------------------------------------------- */

import Player from '../models/player-model';

const playerDatabase = {
    selectAll: async (): Promise<Player[]> => {
        return await Player.findAll();
    },
    selectById: async (id: number): Promise<Player | null> => {
        return await Player.findByPk(id);
    },
    selectBySquadNumber: async (squadNumber: number): Promise<Player | null> => {
        return await Player.findOne({ where: { squadNumber } });
    },
    insert: async (player: Partial<Player>): Promise<void> => {
        await Player.create(player);
    },
    update: async (player: Partial<Player>): Promise<void> => {
        await Player.update(player, { where: { id: player.id } });
    },
    delete: async (id: number): Promise<void> => {
        await Player.destroy({ where: { id } });
    },
};

export default playerDatabase;
