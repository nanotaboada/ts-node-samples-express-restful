/* -----------------------------------------------------------------------------
 * Service
 * -------------------------------------------------------------------------- */

import NodeCache from 'node-cache';
import playerDatabase from '../data/player-database';
import { Player } from '../models/player-model';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const playerService = {
    async retrieveAllAsync(): Promise<Player[]> {
        const cacheKey = 'retrieveAll';
        let players = cache.get<Player[]>(cacheKey);
        if (!players) {
            players = await playerDatabase.selectAllAsync();
            cache.set(cacheKey, players);
        }
        return players;
    },
    async retrieveByIdAsync(id: number): Promise<Player | undefined> {
        const cacheKey = `player_${id}`;
        let player = cache.get<Player>(cacheKey);
        if (!player) {
            player = (await playerDatabase.selectByIdAsync(id)) ?? undefined;
            if (player) {
                cache.set(cacheKey, player);
            }
        }
        return player;
    },
    async retrieveBySquadNumberAsync(squadNumber: number): Promise<Player | undefined> {
        const cacheKey = `player_squad_${squadNumber}`;
        let player = cache.get<Player>(cacheKey);
        if (!player) {
            player = (await playerDatabase.selectBySquadNumberAsync(squadNumber)) ?? undefined;
            if (player) {
                cache.set(cacheKey, player);
            }
        }
        return player;
    },
    async createAsync(player: Player): Promise<void> {
        await playerDatabase.insertAsync(player);
        cache.flushAll();
    },
    async updateAsync(player: Player): Promise<void> {
        await playerDatabase.updateAsync(player);
        cache.flushAll();
    },
    async deleteAsync(id: number): Promise<void> {
        await playerDatabase.deleteAsync(id);
        cache.flushAll();
    },
};

export default playerService;
