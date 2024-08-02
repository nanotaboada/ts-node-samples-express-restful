/* -----------------------------------------------------------------------------
 * Database
 * -------------------------------------------------------------------------- */

import Player from '../models/player-model';

const playerDatabase = {
    selectAllAsync: async (): Promise<Player[]> => {
        return await Player.findAll();
    },
    selectByIdAsync: async (id: number): Promise<Player | null> => {
        return await Player.findByPk(id);
    },
    selectBySquadNumberAsync: async (squadNumber: number): Promise<Player | null> => {
        return await Player.findOne({ where: { squadNumber } });
    },
    insertAsync: async (player: Partial<Player>): Promise<void> => {
        await Player.create(player);
    },
    updateAsync: async (player: Partial<Player>): Promise<void> => {
        await Player.update(player, { where: { id: player.id } });
    },
    deleteAsync: async (id: number): Promise<void> => {
        await Player.destroy({ where: { id } });
    },
};

export default playerDatabase;
