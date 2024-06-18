/* -----------------------------------------------------------------------------
 * Service
 * -------------------------------------------------------------------------- */

import NodeCache from 'node-cache';
import playerDatabase from '../data/player-database';
import { Player } from '../models/player-model';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const playerService = {
    retrieveAll(): Player[] {
        const cacheKey = 'retrieveAll';
        let players = cache.get<Player[]>(cacheKey);
        if (!players) {
            players = playerDatabase.selectAll();
            cache.set(cacheKey, players);
        }
        return players;
    },
    retrieveById(id: number): Player | undefined {
        const cacheKey = `player_${id}`;
        let player = cache.get<Player>(cacheKey);
        if (!player) {
            player = playerDatabase.selectById(id);
            if (player) {
                cache.set(cacheKey, player);
            }
        }
        return player;
    },
    retrieveBySquadNumber(squadNumber: number): Player | undefined {
        const cacheKey = `player_squad_${squadNumber}`;
        let player = cache.get<Player>(cacheKey);
        if (!player) {
            player = playerDatabase.selectBySquadNumber(squadNumber);
            if (player) {
                cache.set(cacheKey, player);
            }
        }
        return player;
    },
    create(player: Player): void {
        playerDatabase.insert(player);
        cache.flushAll();
    },
    update(player: Player): void {
        playerDatabase.update(player);
        cache.flushAll();
    },
    delete(id: number): void {
        playerDatabase.delete(id);
        cache.flushAll();
    },
};

export default playerService;
