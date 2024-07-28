/* -----------------------------------------------------------------------------
 * Service
 * -------------------------------------------------------------------------- */

import NodeCache from 'node-cache';
import playerDatabase from '../data/player-database';
import { Player } from '../models/player-model';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const playerService = {
    async retrieveAll(): Promise<Player[]> {
        const cacheKey = 'retrieveAll';
        let players = cache.get<Player[]>(cacheKey);
        if (!players) {
            players = await playerDatabase.selectAll();
            cache.set(cacheKey, players);
        }
        return players;
    },
    async retrieveById(id: number): Promise<Player | undefined> {
        const cacheKey = `player_${id}`;
        let player = cache.get<Player>(cacheKey);
        if (!player) {
            player = (await playerDatabase.selectById(id)) ?? undefined;
            if (player) {
                cache.set(cacheKey, player);
            }
        }
        return player;
    },
    async retrieveBySquadNumber(squadNumber: number): Promise<Player | undefined> {
        const cacheKey = `player_squad_${squadNumber}`;
        let player = cache.get<Player>(cacheKey);
        if (!player) {
            player = (await playerDatabase.selectBySquadNumber(squadNumber)) ?? undefined;
            if (player) {
                cache.set(cacheKey, player);
            }
        }
        return player;
    },
    async create(player: Player): Promise<void> {
        await playerDatabase.insert(player);
        cache.flushAll();
    },
    async update(player: Player): Promise<void> {
        await playerDatabase.update(player);
        cache.flushAll();
    },
    async delete(id: number): Promise<void> {
        await playerDatabase.delete(id);
        cache.flushAll();
    },
};

export default playerService;
